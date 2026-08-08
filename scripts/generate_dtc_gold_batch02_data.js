const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const baseCodes = require(path.join(ROOT, 'src/data/base_codes.json'));

const BATCH02 = [
  'P0108', 'P0109', 'P0111', 'P0112', 'P0114', 'P0115', 'P0116', 'P0117', 'P0118', 'P0119',
  'P0120', 'P0121', 'P0122', 'P0123', 'P0124', 'P0126', 'P0127', 'P0128', 'P0129', 'P0130',
  'P0131', 'P0132', 'P0133', 'P0136', 'P0137', 'P0138', 'P0139', 'P0140', 'P0141', 'P0142',
  'P0143', 'P0144', 'P0145', 'P0146', 'P0147', 'P0150', 'P0151', 'P0152', 'P0153', 'P0154',
  'P0155', 'P0156', 'P0157', 'P0158', 'P0159', 'P0160', 'P0161', 'P0162', 'P0163', 'P0164',
  'P0165', 'P0166', 'P0167', 'P0168', 'P0169', 'P0170', 'P0173', 'P0176', 'P0177', 'P0178',
  'P0179', 'P0180', 'P0181', 'P0182', 'P0184', 'P0185', 'P0186', 'P0187', 'P0188', 'P0189',
  'P0200', 'P0202', 'P0204', 'P0205', 'P0206', 'P0207', 'P0208', 'P0209', 'P0210', 'P0211'
];

function text(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  return value.en || Object.values(value).flat().join(' ');
}

function title(code) {
  return text(baseCodes[code]?.title) || `${code} Diagnostic Trouble Code`;
}

function baseRecord(code, overrides) {
  const recordTitle = title(code);
  const baseDescription = text(baseCodes[code]?.description);
  return {
    code,
    title: recordTitle,
    generic_definition: recordTitle,
    code_specific_context: `${code} source definition: ${recordTitle}. ${baseDescription} Diagnostic focus for this recovery record must stay tied to this exact DTC definition and should not be merged with adjacent sibling codes.`,
    fixDifficulty: overrides.fixDifficulty || 'diff_moderate',
    estimatedCost: 'Vehicle-specific after confirmed diagnosis',
    ...overrides
  };
}

function mapRecord(code) {
  const high = code === 'P0108';
  const intermittent = code === 'P0109';
  const baroLow = code === 'P0129';
  const condition = baroLow ? 'barometric pressure is implausibly low' : intermittent ? 'MAP/BARO signal is unstable or drops out' : 'MAP/BARO signal is higher than expected';
  return baseRecord(code, {
    description: `${code} points to a MAP/BARO pressure input problem where ${condition}. The correct diagnostic path is not a blind MAP sensor swap: compare key-on pressure plausibility, inspect the reference/ground/signal circuits, check the sensor port or hose, and confirm whether the pressure data disagrees with throttle, load and altitude context.`,
    system: 'powertrain',
    subsystem: 'manifold pressure measurement',
    component: baroLow ? 'barometric pressure input' : 'MAP/BARO sensor circuit',
    circuit_type: baroLow ? 'pressure plausibility low' : intermittent ? 'intermittent pressure sensor input' : 'pressure sensor high input',
    severity: baroLow ? 'moderate' : 'moderate',
    driveability: 'Use caution if the engine hesitates, stalls, surges or shifts poorly because pressure data affects load calculation.',
    ecu_detection_condition: `The ECM detects that the ${condition} for the current operating context.`,
    symptoms: ['symp_check_engine', 'symp_poor_acceleration', 'symp_hesitation', 'symp_rough_idle', 'symp_fuel_economy'],
    causes: ['cause_map_sensor', 'cause_wiring_damage', 'cause_connector_corrosion', 'cause_vacuum_leak', 'cause_pcm_failure'],
    first_checks: ['Compare MAP/BARO data key-on engine-off.', 'Inspect the MAP connector and hose or port.', 'Check for intake leaks that distort pressure data.', 'Verify reference, ground and signal integrity.'],
    diagnosticSteps: [
      `Confirm ${code} and save freeze-frame load, throttle and pressure data.`,
      'Compare MAP/BARO values with engine-off atmospheric plausibility instead of using one universal number.',
      'Inspect the sensor connector, terminal fit, vacuum hose or sensing port for contamination or looseness.',
      'Test reference, ground and signal continuity according to vehicle service information.',
      intermittent ? 'Move the harness and tap-test the sensor area while watching live pressure data for dropouts.' : 'Compare live pressure response during idle, snap throttle and light-load operation.',
      'Repair wiring, port or vacuum faults before replacing a confirmed failed sensor.'
    ],
    electrical_tests: ['Reference feed integrity', 'sensor ground integrity', 'signal short/open check', 'connector terminal tension'],
    mechanical_tests: ['Sensor port restriction check', 'vacuum hose inspection where equipped', 'intake leak check', 'air duct inspection'],
    commonFixes: ['Repair MAP/BARO wiring or connector faults.', 'Clean or repair a blocked sensor port.', 'Correct vacuum leaks or hose damage where equipped.', 'Replace the MAP/BARO sensor only after circuit and plausibility checks fail.'],
    common_mistakes: ['Replacing the sensor before checking reference and ground.', 'Ignoring altitude and engine-off pressure plausibility.', 'Missing a blocked sensing port or split vacuum hose.'],
    do_not_replace_blindly: ['MAP/BARO sensor', 'throttle body', 'ECM/PCM'],
    freeze_frame_fields: ['MAP', 'BARO', 'RPM', 'throttle position', 'engine load'],
    live_data_fields: ['MAP', 'BARO', 'TPS', 'MAF where equipped', 'fuel trims'],
    related_codes: ['P0105', 'P0106', 'P0107', 'P0108', 'P0109', 'P0121'].filter(item => item !== code),
    applicability_notes: 'Pressure normality depends on altitude, engine design and sensor strategy; avoid universal pressure values without vehicle data.',
    source_confidence: 'HIGH'
  });
}

function temperatureRecord(code, sensor) {
  const isIat = sensor === 'IAT';
  const isEct = sensor === 'ECT';
  const phrase = {
    P0111: 'does not match expected intake temperature behavior',
    P0112: 'is electrically low or shorted toward ground',
    P0114: 'is intermittent or drops out',
    P0115: 'has a general ECT circuit fault',
    P0116: 'does not track realistic warm-up behavior',
    P0117: 'is electrically low or shorted toward ground',
    P0118: 'is electrically high or open-circuit biased',
    P0119: 'is intermittent or unstable',
    P0126: 'does not reach stable operating temperature logic',
    P0127: 'reports intake air temperature too high for context',
    P0128: 'stays below thermostat regulating expectation'
  }[code];
  const component = isIat ? 'intake air temperature sensor circuit' : isEct ? 'engine coolant temperature sensor circuit' : 'engine temperature control strategy';
  const related = isIat ? ['P0110', 'P0111', 'P0112', 'P0113', 'P0114', 'P0103'] : ['P0115', 'P0116', 'P0117', 'P0118', 'P0119', 'P0125', 'P0128'];
  return baseRecord(code, {
    description: `${code} means the ${component} ${phrase}. The useful diagnostic split is electrical plausibility versus real temperature behavior: compare cold-soak readings, watch warm-up or intake heat changes, inspect connector and harness condition, and verify thermostat or airflow context before replacing sensors.`,
    system: 'powertrain',
    subsystem: isIat ? 'intake temperature measurement' : 'cooling and temperature measurement',
    component,
    circuit_type: phrase,
    severity: code === 'P0128' || code === 'P0126' ? 'moderate' : 'moderate',
    driveability: isEct ? 'Use caution if temperature gauge behavior is abnormal, fans run unexpectedly or overheating symptoms appear.' : 'Usually drivable with caution, but poor fueling and hesitation can occur when temperature data is wrong.',
    ecu_detection_condition: `The ECM detects that the ${component} ${phrase} compared with engine operating context.`,
    symptoms: isEct ? ['symp_check_engine', 'symp_fuel_economy', 'symp_hard_start', 'symp_overheating', 'symp_rough_idle'] : ['symp_check_engine', 'symp_hesitation', 'symp_fuel_economy', 'symp_hard_start', 'symp_rough_idle'],
    causes: isEct ? ['cause_ect_sensor', 'cause_wiring_damage', 'cause_connector_corrosion', 'cause_thermostat', 'cause_low_coolant'] : ['cause_iat_sensor', 'cause_wiring_damage', 'cause_connector_corrosion', 'cause_maf_sensor', 'cause_intake_air_leak'],
    first_checks: ['Compare cold readings after the vehicle sits.', 'Inspect connector pins and harness strain.', 'Check for contamination or poor sensor seating.', isEct ? 'Verify coolant level and thermostat behavior.' : 'Inspect intake ducting and heat-soak conditions.'],
    diagnosticSteps: [
      `Confirm ${code} and record freeze-frame temperature, RPM and load.`,
      'Compare cold-soak temperature readings against each other rather than relying on one fixed value.',
      'Inspect connector fit, corrosion, harness rub points and sensor seating.',
      isEct ? 'Verify coolant level, air pockets, thermostat operation and fan command context.' : 'Inspect intake ducting, MAF/IAT integration and heat-soak exposure.',
      'Check reference, ground and signal behavior following vehicle service information.',
      'Repair wiring or mechanical temperature-control faults before replacing the confirmed failed sensor.'
    ],
    electrical_tests: ['Sensor signal plausibility', 'ground integrity', 'connector terminal tension', 'harness movement test'],
    mechanical_tests: isEct ? ['Coolant level check', 'thermostat behavior check', 'cooling fan command review', 'air pocket inspection'] : ['Intake duct inspection', 'airbox seating check', 'sensor contamination check', 'heat source inspection'],
    commonFixes: isEct ? ['Repair ECT wiring or connector faults.', 'Correct low coolant or trapped air.', 'Replace a stuck thermostat when confirmed.', 'Replace the ECT sensor only after plausibility and circuit checks.'] : ['Repair IAT wiring or connector faults.', 'Correct loose intake ducting.', 'Clean or replace contaminated MAF/IAT assembly where confirmed.', 'Replace the IAT sensor only after circuit checks.'],
    common_mistakes: ['Treating one temperature reading as proof of a bad sensor.', 'Skipping connector and harness inspection.', 'Ignoring mechanical context that can mimic an electrical fault.'],
    do_not_replace_blindly: isEct ? ['ECT sensor', 'thermostat', 'radiator fan module'] : ['IAT sensor', 'MAF sensor', 'airbox'],
    freeze_frame_fields: isEct ? ['ECT', 'IAT', 'RPM', 'vehicle speed', 'fuel system status'] : ['IAT', 'ECT', 'MAF airflow', 'vehicle speed', 'engine load'],
    live_data_fields: isEct ? ['ECT', 'IAT', 'fan command', 'fuel trims', 'closed-loop status'] : ['IAT', 'ECT', 'MAF', 'fuel trims', 'ambient context'],
    related_codes: related.filter(item => item !== code),
    applicability_notes: 'Temperature thresholds and sensor integration vary by manufacturer; use service data for final electrical values.',
    source_confidence: 'HIGH'
  });
}

function throttleRecord(code) {
  const mode = {
    P0120: 'general circuit malfunction',
    P0121: 'range/performance disagreement',
    P0122: 'low input',
    P0123: 'high input',
    P0124: 'intermittent input'
  }[code];
  return baseRecord(code, {
    description: `${code} identifies a throttle or accelerator pedal position sensor A ${mode}. Because throttle data affects torque control and limp-mode decisions, diagnosis should compare paired pedal/throttle tracks, inspect connector strain, check reference and ground integrity, and avoid cleaning or replacing the throttle body before proving the fault path.`,
    system: 'powertrain',
    subsystem: 'throttle and accelerator position monitoring',
    component: 'TPS/PPS sensor A circuit',
    circuit_type: mode,
    severity: 'high',
    driveability: 'Do not ignore reduced-power mode, sudden hesitation or unstable idle because throttle correlation faults can limit torque.',
    ecu_detection_condition: `The ECM detects TPS/PPS sensor A ${mode} or disagreement with expected throttle control behavior.`,
    symptoms: ['symp_check_engine', 'symp_reduced_power', 'symp_poor_acceleration', 'symp_rough_idle', 'symp_stalling'],
    causes: ['cause_tps_sensor', 'cause_throttle_body', 'cause_wiring_damage', 'cause_connector_corrosion', 'cause_pcm_failure'],
    first_checks: ['Check for reduced-power messages.', 'Inspect throttle/pedal connectors.', 'Compare sensor A to redundant tracks.', 'Look for harness strain near moving pedal or throttle components.'],
    diagnosticSteps: [
      `Confirm ${code} and note whether reduced-power mode was active.`,
      'Compare TPS/PPS sensor A with the redundant track through a smooth pedal sweep.',
      'Inspect throttle body and pedal connectors for terminal spread, corrosion or water intrusion.',
      'Check reference, ground and signal circuits using the vehicle wiring diagram.',
      code === 'P0124' ? 'Wiggle-test pedal and throttle harnesses while graphing live data for dropouts.' : 'Graph live data during slow and quick pedal movement to find dropouts or correlation errors.',
      'Repair wiring/connector issues before replacing a confirmed throttle body, pedal sensor or TPS assembly.'
    ],
    electrical_tests: ['Reference circuit check', 'ground integrity check', 'signal sweep graphing', 'connector tension check'],
    mechanical_tests: ['Throttle plate contamination inspection', 'pedal travel check', 'intake duct interference check', 'throttle return behavior review'],
    commonFixes: ['Repair damaged TPS/PPS wiring.', 'Repair connector terminal faults.', 'Clean or service throttle body only when sticking is confirmed.', 'Replace failed pedal or throttle sensor assembly after correlation testing.'],
    common_mistakes: ['Cleaning the throttle body as a guess.', 'Ignoring redundant sensor track comparison.', 'Replacing the pedal assembly without checking power and ground.'],
    do_not_replace_blindly: ['throttle body', 'accelerator pedal assembly', 'ECM/PCM'],
    freeze_frame_fields: ['TPS A', 'TPS B', 'accelerator pedal position', 'RPM', 'vehicle speed'],
    live_data_fields: ['TPS A', 'TPS B', 'APP sensors', 'throttle command', 'idle command'],
    related_codes: ['P0120', 'P0121', 'P0122', 'P0123', 'P0124', 'P0220', 'P0221'].filter(item => item !== code),
    applicability_notes: 'Electronic throttle systems often use redundant sensors; diagnose correlation and circuit integrity before parts replacement.',
    source_confidence: 'HIGH'
  });
}

function o2Record(code) {
  const map = {
    P0130: [1, 1, 'circuit malfunction'], P0131: [1, 1, 'low signal'], P0132: [1, 1, 'high signal'], P0133: [1, 1, 'slow response'],
    P0136: [1, 2, 'circuit malfunction'], P0137: [1, 2, 'low signal'], P0138: [1, 2, 'high signal'], P0139: [1, 2, 'slow response'], P0140: [1, 2, 'no activity'], P0141: [1, 2, 'heater circuit fault'],
    P0142: [1, 3, 'circuit malfunction'], P0143: [1, 3, 'low signal'], P0144: [1, 3, 'high signal'], P0145: [1, 3, 'slow response'], P0146: [1, 3, 'no activity'], P0147: [1, 3, 'heater circuit fault'],
    P0150: [2, 1, 'circuit malfunction'], P0151: [2, 1, 'low signal'], P0152: [2, 1, 'high signal'], P0153: [2, 1, 'slow response'], P0154: [2, 1, 'no activity'], P0155: [2, 1, 'heater circuit fault'],
    P0156: [2, 2, 'circuit malfunction'], P0157: [2, 2, 'low signal'], P0158: [2, 2, 'high signal'], P0159: [2, 2, 'slow response'], P0160: [2, 2, 'no activity'], P0161: [2, 2, 'heater circuit fault'],
    P0162: [2, 3, 'circuit malfunction'], P0163: [2, 3, 'low signal'], P0164: [2, 3, 'high signal'], P0165: [2, 3, 'slow response'], P0166: [2, 3, 'no activity'], P0167: [2, 3, 'heater circuit fault']
  };
  const [bank, sensor, mode] = map[code];
  const upstream = sensor === 1;
  const heater = mode.includes('heater');
  const noActivity = mode === 'no activity';
  const slow = mode === 'slow response';
  const low = mode === 'low signal';
  const high = mode === 'high signal';
  const role = upstream ? 'fuel-control feedback' : sensor === 2 ? 'catalyst monitoring feedback' : 'post-catalyst auxiliary monitoring feedback';
  const bankNote = bank === 1 ? 'Bank 1 must be confirmed by cylinder-one location.' : 'Bank 2 must be confirmed on the opposite engine bank before any sensor is ordered.';
  return baseRecord(code, {
    description: `${code} is an oxygen or air-fuel sensor ${mode} for Bank ${bank} Sensor ${sensor}. This sensor position is used for ${role}, so diagnosis should separate sensor signal behavior from exhaust leaks, wiring damage, heater supply/control faults, fuel trim bias and wrong-bank identification. ${bankNote}`,
    system: 'powertrain',
    subsystem: upstream ? 'fuel control oxygen sensing' : 'catalyst oxygen monitoring',
    component: `oxygen sensor Bank ${bank} Sensor ${sensor}`,
    circuit_type: mode,
    severity: upstream ? 'moderate' : 'moderate',
    driveability: upstream ? 'Use caution if fuel economy drops, idle becomes rough or fuel trims are abnormal.' : 'Usually drivable with caution, but emissions readiness and catalyst monitoring may be affected.',
    ecu_detection_condition: `The ECM detects Bank ${bank} Sensor ${sensor} ${mode} inconsistent with expected oxygen sensor monitoring.`,
    symptoms: ['symp_check_engine', 'symp_fuel_economy', 'symp_rough_idle', 'symp_emissions_failure', upstream ? 'symp_hesitation' : 'symp_no_driveability_symptom'],
    causes: heater ? ['cause_o2_sensor_heater', 'cause_fuse_relay', 'cause_wiring_damage', 'cause_connector_corrosion', 'cause_pcm_failure'] : ['cause_o2_sensor', 'cause_exhaust_leak', 'cause_wiring_damage', 'cause_fuel_trim_issue', 'cause_connector_corrosion'],
    first_checks: [`Confirm Bank ${bank} Sensor ${sensor} identity.`, 'Inspect exhaust leaks near the sensor.', 'Check connector heat damage and harness routing.', heater ? 'Verify heater feed and control path.' : 'Compare live sensor behavior with fuel trim and engine state.'],
    diagnosticSteps: [
      `Confirm ${code}, Bank ${bank} Sensor ${sensor}, and freeze-frame operating conditions.`,
      bank === 2 ? 'Identify bank 2 physically before touching the sensor or harness.' : 'Identify bank 1 physically before touching the sensor or harness.',
      heater ? 'Check heater fuse/feed, ground or control circuit before condemning the sensor.' : 'Graph sensor activity together with short and long fuel trims.',
      low ? 'Look for lean bias, exhaust leaks, signal shorts or an inactive sensor before replacing parts.' : high ? 'Look for rich bias, signal short-to-feed, contamination or fuel control issues.' : slow ? 'Check sensor response in context with exhaust leaks, aging sensor behavior and fuel trim movement.' : noActivity ? 'Check for fixed signal, open signal circuit, heater readiness and connector damage.' : 'Check signal circuit integrity, connector condition and exhaust influence.',
      'Inspect wiring for melted insulation, water intrusion and poor terminal grip.',
      'Repair exhaust, wiring or fuel-control issues before replacing the confirmed failed sensor.'
    ],
    electrical_tests: heater ? ['heater feed check', 'heater control check', 'sensor ground check', 'connector heat damage inspection'] : ['signal circuit check', 'sensor ground check', 'connector tension check', 'harness heat damage inspection'],
    mechanical_tests: ['exhaust leak inspection', 'vacuum leak review for upstream sensors', 'fuel trim context check', 'sensor location verification'],
    commonFixes: heater ? ['Repair heater circuit wiring.', 'Replace blown fuse only after finding the cause.', 'Repair heat-damaged connector.', 'Replace confirmed failed oxygen sensor heater assembly.'] : ['Repair exhaust leaks near the sensor.', 'Repair damaged sensor wiring.', 'Correct fuel trim causes that bias the signal.', 'Replace the sensor only after signal and circuit checks confirm it.'],
    common_mistakes: [`Replacing the wrong bank or sensor position for ${code}.`, 'Ignoring exhaust leaks that distort oxygen content.', heater ? 'Replacing the sensor without checking heater power and control.' : 'Replacing the sensor without checking fuel trim context.'],
    do_not_replace_blindly: [`Bank ${bank} Sensor ${sensor} oxygen sensor`, 'catalytic converter', 'ECM/PCM'],
    freeze_frame_fields: [`B${bank}S${sensor} sensor signal`, 'STFT', 'LTFT', 'RPM', 'closed-loop status'],
    live_data_fields: [`B${bank}S${sensor} signal`, heater ? 'heater command' : 'sensor switching/activity', 'fuel trims', 'closed-loop status', 'engine load'],
    related_codes: relatedO2(code, bank, sensor, heater),
    applicability_notes: 'Some vehicles use wideband air-fuel sensors upstream and narrowband oxygen sensors downstream; bank and sensor naming must be verified by vehicle layout.',
    source_confidence: sensor === 3 ? 'MEDIUM' : 'HIGH'
  });
}

function relatedO2(code, bank, sensor, heater) {
  const family = Object.keys(baseCodes).filter(item => /^P01[3456]/.test(item));
  const sameBank = family.filter(item => title(item).includes(`Bank ${bank}`)).slice(0, 4);
  const core = heater ? ['P0135', 'P0141', 'P0147', 'P0155', 'P0161', 'P0167'] : ['P0130', 'P0131', 'P0132', 'P0133', 'P0134', 'P0171', 'P0172'];
  return [...new Set([...sameBank, ...core])].filter(item => item !== code && baseCodes[item]).slice(0, 7);
}

function fuelRecord(code) {
  const mode = {
    P0168: 'fuel temperature too high',
    P0169: 'fuel composition is implausible or incorrect',
    P0170: 'fuel trim control malfunction on Bank 1',
    P0173: 'fuel trim control malfunction on Bank 2',
    P0176: 'fuel composition sensor circuit malfunction',
    P0177: 'fuel composition sensor range/performance',
    P0178: 'fuel composition sensor low input',
    P0179: 'fuel composition sensor high input',
    P0180: 'fuel temperature sensor 1 circuit malfunction',
    P0181: 'fuel temperature sensor 1 range/performance',
    P0182: 'fuel temperature sensor 1 low input',
    P0184: 'fuel temperature sensor 1 intermittent',
    P0185: 'fuel temperature sensor 2 circuit malfunction',
    P0186: 'fuel temperature sensor 2 range/performance',
    P0187: 'fuel temperature sensor 2 low input',
    P0188: 'fuel temperature sensor 2 high input',
    P0189: 'fuel temperature sensor 2 intermittent'
  }[code];
  const composition = /^P017[6-9]|P0169/.test(code);
  const trim = code === 'P0170' || code === 'P0173';
  const sensor2 = /^P018[5-9]/.test(code);
  return baseRecord(code, {
    description: `${code} indicates ${mode}. Diagnosis should separate true fuel condition from sensor/circuit plausibility: review freeze-frame load and temperature, compare related fuel temperature or composition data, inspect tank/rail harness routing, and check fuel trim context before replacing a pump, injector or sensor assembly.`,
    system: 'powertrain',
    subsystem: trim ? 'fuel trim control' : composition ? 'fuel composition monitoring' : 'fuel temperature monitoring',
    component: trim ? `fuel trim ${code === 'P0173' ? 'Bank 2' : 'Bank 1'}` : composition ? 'fuel composition sensor circuit' : `fuel temperature sensor ${sensor2 ? '2' : '1'} circuit`,
    circuit_type: mode,
    severity: trim ? 'moderate' : 'moderate',
    driveability: 'Use caution if hard starting, hesitation, fuel smell or abnormal fuel economy is present.',
    ecu_detection_condition: `The ECM detects ${mode} based on fuel system monitoring and plausibility checks.`,
    symptoms: ['symp_check_engine', 'symp_fuel_economy', 'symp_hard_start', 'symp_hesitation', 'symp_rough_idle'],
    causes: trim ? ['cause_vacuum_leak', 'cause_fuel_pressure_issue', 'cause_o2_sensor', 'cause_maf_sensor', 'cause_exhaust_leak'] : ['cause_fuel_temp_sensor', 'cause_fuel_composition_sensor', 'cause_wiring_damage', 'cause_connector_corrosion', 'cause_fuel_contamination'],
    first_checks: ['Save freeze-frame fuel system data.', 'Inspect harness routing near tank, rail or fuel module.', 'Compare related fuel temperature/composition data where available.', trim ? 'Check both short and long fuel trims.' : 'Confirm whether the vehicle actually uses this sensor strategy.'],
    diagnosticSteps: [
      `Confirm ${code} and record fuel trim, load and temperature context.`,
      trim ? 'Compare bank-specific fuel trims and look for lean/rich bias causes.' : 'Verify whether the sensor is standalone or integrated into a fuel module.',
      'Inspect connectors and harnesses exposed to heat, fuel vapor, road debris or tank service.',
      composition ? 'Check for contaminated or incorrect fuel history before replacing the sensor.' : 'Compare fuel temperature data with ambient and operating context for plausibility.',
      'Check circuit integrity using vehicle service information and avoid universal test thresholds.',
      'Repair wiring, fuel quality or airflow/fuel-control causes before replacing confirmed failed components.'
    ],
    electrical_tests: ['sensor feed check', 'ground integrity check', 'signal plausibility review', 'connector inspection'],
    mechanical_tests: trim ? ['vacuum leak check', 'exhaust leak check', 'fuel delivery review', 'MAF contamination inspection'] : ['fuel contamination review', 'fuel module inspection where accessible', 'heat exposure review', 'tank/rail harness inspection'],
    commonFixes: trim ? ['Repair vacuum or exhaust leaks.', 'Correct fuel delivery faults.', 'Clean or repair MAF-related issues where confirmed.', 'Replace a biased sensor only after data proves it.'] : ['Repair fuel sensor wiring.', 'Repair corroded connector terminals.', 'Correct contaminated fuel when confirmed.', 'Replace integrated sensor/module only after circuit testing.'],
    common_mistakes: ['Replacing injectors or pump without fuel system data.', 'Ignoring wiring damage near fuel components.', 'Using one fixed value instead of vehicle-specific service information.'],
    do_not_replace_blindly: trim ? ['oxygen sensor', 'fuel injectors', 'fuel pump'] : ['fuel temperature sensor', 'fuel pump module', 'fuel composition sensor'],
    freeze_frame_fields: ['fuel trims', 'fuel temperature', 'engine load', 'RPM', 'vehicle speed'],
    live_data_fields: trim ? ['STFT', 'LTFT', 'MAF', 'O2/AF sensor data', 'fuel pressure where available'] : ['fuel temperature', 'fuel composition where available', 'battery voltage', 'fuel trims', 'ambient context'],
    related_codes: relatedFuel(code, trim, composition),
    applicability_notes: 'Fuel sensor availability and location are vehicle-specific; some generic codes are only meaningful on vehicles equipped with the relevant strategy.',
    source_confidence: composition || sensor2 ? 'MEDIUM' : 'HIGH'
  });
}

function relatedFuel(code, trim, composition) {
  const list = trim ? ['P0170', 'P0171', 'P0172', 'P0173', 'P0174', 'P0175', 'P0101'] : composition ? ['P0168', 'P0169', 'P0176', 'P0177', 'P0178', 'P0179'] : ['P0180', 'P0181', 'P0182', 'P0183', 'P0184', 'P0185', 'P0186', 'P0187', 'P0188', 'P0189'];
  return list.filter(item => item !== code && baseCodes[item]).slice(0, 7);
}

function injectorRecord(code) {
  const cylinder = code === 'P0200' ? null : Number(code.slice(3));
  const cylText = cylinder ? `cylinder ${cylinder}` : 'one or more injector circuits';
  const confidence = cylinder && cylinder > 8 ? 'MEDIUM' : 'HIGH';
  return baseRecord(code, {
    description: `${code} is an injector circuit fault for ${cylText}. The key is to prove whether the ECM is seeing an open/shorted injector driver path, a connector/harness fault, a failed injector coil or a cylinder-specific wiring branch issue. Do not treat this as a fuel pressure or spark-plug code unless supporting misfire data points there.`,
    system: 'powertrain',
    subsystem: 'fuel injection electrical control',
    component: cylinder ? `fuel injector circuit cylinder ${cylinder}` : 'fuel injector circuit group',
    circuit_type: cylinder ? 'cylinder-specific injector circuit fault' : 'injector circuit malfunction',
    severity: 'high',
    driveability: 'Avoid extended driving if the engine misfires strongly, smells of fuel or risks catalyst damage.',
    ecu_detection_condition: `The ECM detects injector circuit behavior inconsistent with commanded injector operation for ${cylText}.`,
    symptoms: ['symp_check_engine', 'symp_rough_idle', 'symp_misfire', 'symp_power_loss', 'symp_fuel_smell'],
    causes: ['cause_injector', 'cause_wiring_damage', 'cause_connector_corrosion', 'cause_pcm_failure', 'cause_fuel_contamination'],
    first_checks: [`Confirm ${cylText} and any paired misfire code.`, 'Inspect injector connector lock and terminal tension.', 'Check harness routing near heat and moving components.', 'Compare command and cylinder contribution data where available.'],
    diagnosticSteps: [
      `Confirm ${code} and note whether a matching cylinder misfire is stored.`,
      cylinder ? `Verify cylinder ${cylinder} numbering on the engine before testing.` : 'Identify which injector circuit or bank is implicated by scan data and wiring information.',
      'Inspect injector connector fit, corrosion, pin drag and harness rub-through.',
      'Check injector circuit continuity and driver control using vehicle service information.',
      'Compare injector command, misfire counters and fuel trim behavior to avoid chasing a mechanical misfire.',
      'Repair wiring/connector faults or replace the confirmed failed injector after electrical proof.'
    ],
    electrical_tests: ['injector connector inspection', 'circuit continuity check', 'driver control verification', 'harness movement test'],
    mechanical_tests: ['cylinder contribution review', 'misfire data review', 'fuel contamination check', 'connector access inspection'],
    commonFixes: ['Repair broken injector wiring.', 'Repair loose or corroded injector connector terminals.', 'Replace a confirmed failed injector.', 'Repair ECM driver circuit only after wiring and injector tests pass.'],
    common_mistakes: ['Replacing spark plugs for an injector circuit code.', 'Skipping cylinder numbering verification.', 'Replacing an injector without checking connector tension and harness damage.'],
    do_not_replace_blindly: ['fuel injector', 'spark plugs', 'ECM/PCM'],
    freeze_frame_fields: ['injector command', 'misfire counters', 'RPM', 'load', 'fuel trims'],
    live_data_fields: ['injector pulse command', 'misfire counters', 'fuel trims', 'fuel pressure where available', 'battery voltage'],
    related_codes: relatedInjector(code, cylinder),
    applicability_notes: cylinder && cylinder > 8 ? 'High cylinder-number injector codes apply only to engines with that cylinder count; verify engine configuration before diagnosis.' : 'Cylinder numbering and injector access vary by engine layout.',
    source_confidence: confidence
  });
}

function relatedInjector(code, cylinder) {
  const group = ['P0200', 'P0201', 'P0202', 'P0203', 'P0204', 'P0205', 'P0206', 'P0207', 'P0208', 'P0209', 'P0210', 'P0211', 'P0212'];
  const misfire = cylinder ? [`P03${String(cylinder).padStart(2, '0')}`, 'P0300'] : ['P0300', 'P0301', 'P0302'];
  return [...new Set([...group, ...misfire])].filter(item => item !== code && baseCodes[item]).slice(0, 7);
}

function build(code) {
  if (['P0108', 'P0109', 'P0129'].includes(code)) return mapRecord(code);
  if (['P0111', 'P0112', 'P0114', 'P0127'].includes(code)) return temperatureRecord(code, 'IAT');
  if (['P0115', 'P0116', 'P0117', 'P0118', 'P0119', 'P0126', 'P0128'].includes(code)) return temperatureRecord(code, 'ECT');
  if (/^P012[0-4]$/.test(code)) return throttleRecord(code);
  if (/^P01(?:3[0-9]|4[0-7]|5[0-9]|6[0-7])$/.test(code)) return o2Record(code);
  if (/^P016[89]$|^P017[036789]$|^P018[0-9]$/.test(code)) return fuelRecord(code);
  if (/^P02(00|02|04|05|06|07|08|09|10|11)$/.test(code)) return injectorRecord(code);
  throw new Error(`No batch 02 builder for ${code}`);
}

const output = {};
for (const code of BATCH02) output[code] = build(code);

fs.writeFileSync(
  path.join(ROOT, 'src/data/verified_dtc_gold_batch02.json'),
  `${JSON.stringify(output, null, 2)}\n`
);

console.log(`Generated ${Object.keys(output).length} Batch 02 DTC records.`);
