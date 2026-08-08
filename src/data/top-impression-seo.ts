export type TopImpressionCodeFocus = {
  query: string;
  title: string;
  answer: string;
  severity: string;
  safeToDrive: string;
  firstChecks: string[];
  doNotReplace: string;
  costLevel: string;
  relatedSearches: string[];
  links: Array<{ href: string; label: string }>;
};

const CODE_FOCUS: Record<string, TopImpressionCodeFocus> = {
  P0213: {
    query: 'p0213',
    title: 'P0213 Code: Meaning, Symptoms, Causes and Fixes',
    answer: 'P0213 is an OBD2 diagnostic trouble code for a cold start injector 1 circuit or control fault. The highest-value checks are injector power, PCM command, connector tension, coolant temperature input, and wiring continuity before any injector or control module is replaced.',
    severity: 'Moderate. It can cause hard cold starts, rough idle after startup, rich/lean correction problems, and misfire-like symptoms when the engine is cold.',
    safeToDrive: 'Usually short local driving is possible if the engine runs normally after warm-up, but diagnose before repeated cold-start failures, fuel smell, stalling, or a flashing check engine light.',
    firstChecks: [
      'Save freeze-frame data and note coolant temperature when P0213 set.',
      'Check the cold start injector fuse/feed, ground or PCM command, and connector pin tension.',
      'Compare coolant temperature sensor data to ambient temperature after the car sits overnight.',
      'Measure injector coil resistance and compare it with service-data expectations.',
      'Inspect harness sections near hot engine areas for brittle insulation or rub-through.',
      'Clear the code only after repair and confirm the cold-start monitor does not reset P0213.',
    ],
    doNotReplace: 'Do not replace the injector, PCM, or coolant temperature sensor first without proving power, ground/command, resistance, and wiring integrity.',
    costLevel: 'Low to moderate when it is wiring, connector, fuse, or injector related; high only if module diagnosis and programming are truly required.',
    relatedSearches: ['p0213 code', 'p0213 symptoms', 'p0213 cold start injector', 'p0213 ford', 'p0213 causes'],
    links: [
      { href: '/en/ford/focus/p0213', label: 'Ford Focus P0213' },
      { href: '/en/codes/p0216', label: 'P0216 related fuel timing code' },
      { href: '/en/codes/p0251', label: 'P0251 fuel metering code' },
      { href: '/en/car-problem-finder/car-hard-to-start', label: 'Hard start symptom guide' },
    ],
  },
  P0251: {
    query: 'p0251 ford',
    title: 'Ford P0251 Code: Symptoms, Causes and Fuel System Fixes',
    answer: 'Ford P0251 usually points to a diesel fuel metering or injection pump control problem, but the repair should start with fuel supply and pressure validation. A restricted fuel filter, air in fuel, weak pump command, wiring fault, pressure sensor issue, or metering valve fault can all create the same search complaint.',
    severity: 'High when the vehicle has low power, stalls, enters limp mode, or rail pressure cannot follow commanded pressure.',
    safeToDrive: 'Avoid heavy acceleration or towing until fuel pressure behavior is verified. Stop driving if the engine stalls, loses power suddenly, or fuel leaks are present.',
    firstChecks: [
      'Record freeze-frame fuel pressure, RPM, load, and temperature.',
      'Check fuel filter condition, air intrusion, low-pressure supply, and obvious fuel leaks.',
      'Compare commanded versus actual rail pressure at idle and under controlled load.',
      'Inspect pump metering valve wiring, connector corrosion, fuse power, and ground quality.',
      'Look for related fuel pressure, crank/cam sync, or injector balance codes.',
      'Verify repair with a road test that confirms rail pressure tracks command without P0251 returning.',
    ],
    doNotReplace: 'Do not replace the high-pressure pump first. Confirm supply pressure, filter condition, wiring, sensor data, and metering-valve command before expensive fuel-system work.',
    costLevel: 'Moderate when filter, wiring, or metering valve repairs solve it; expensive if the high-pressure pump or injector system is verified as the root cause.',
    relatedSearches: ['p0251 ford', 'ford p0251', 'p0251 ford focus', 'p0251 ford f150', 'p0251 injection pump'],
    links: [
      { href: '/en/ford/f-150/p0251', label: 'Ford F-150 P0251' },
      { href: '/en/codes/p0251', label: 'P0251 code hub' },
      { href: '/en/codes/p0216', label: 'P0216 injection timing' },
      { href: '/en/ford/warning-lights', label: 'Ford warning lights' },
    ],
  },
  P0292: {
    query: 'p0292',
    title: 'P0292 Code: Cylinder 11 Injector Circuit High',
    answer: 'P0292 means cylinder 11 injector circuit is reading high voltage or excessive resistance. On engines with enough cylinders to use cylinder 11, this is an electrical injector-circuit diagnosis first: connector, harness, injector coil, FICM/driver command, and power feed must be checked before parts are replaced.',
    severity: 'Moderate to high. It can cause rough running, cylinder contribution faults, fuel smell, reduced power, and catalyst or DPF stress if the cylinder is not fueling correctly.',
    safeToDrive: 'Drive only gently if the engine runs smoothly. Do not keep driving with severe misfire, heavy smoke, fuel smell, limp mode, or a flashing check engine light.',
    firstChecks: [
      'Confirm the engine actually has cylinder 11 and note firing order/location from service data.',
      'Compare injector resistance on cylinder 11 against neighboring injectors.',
      'Check connector lock, pin drag, corrosion, oil intrusion, and harness chafe near the injector.',
      'Verify injector power feed and driver command with a scope or noid-style test where appropriate.',
      'Check related cylinder contribution, FICM, fuel pressure, and misfire codes.',
      'After repair, clear codes and verify cylinder balance or contribution data under load.',
    ],
    doNotReplace: 'Do not replace the injector or control module before confirming the circuit high condition with resistance, power, ground/driver command, and harness testing.',
    costLevel: 'Moderate for connector, harness, or injector repair; higher if driver module diagnosis is verified.',
    relatedSearches: ['p0292 code', 'p0292 symptoms', 'p0292 cylinder 11 injector', 'p0292 causes', 'p0292 fix'],
    links: [
      { href: '/en/codes/p0283', label: 'P0283 injector circuit high' },
      { href: '/en/codes/p0282', label: 'P0282 cylinder 8 injector low' },
      { href: '/en/codes/p0203', label: 'P0203 injector circuit' },
      { href: '/en/car-problem-finder/car-jerks-while-driving', label: 'Misfire and jerking guide' },
    ],
  },
  P0257: {
    query: 'p0257',
    title: 'P0257 Code: Symptoms, Causes and Injection Pump Checks',
    answer: 'P0257 means the fuel metering control B circuit or actuator response is outside the expected range. Treat it as a fuel pressure control diagnosis: actual pressure, commanded pressure, metering actuator response, wiring, fuel restriction, and related sensor data must line up before replacing the injection pump.',
    severity: 'High when the vehicle has limp mode, low power, hard start, stalling, or rail pressure that cannot follow command.',
    safeToDrive: 'Avoid long drives, towing, or high-load acceleration until fuel pressure control is verified. Stop if the engine stalls, leaks fuel, smokes heavily, or loses power suddenly.',
    firstChecks: [
      'Save freeze-frame data showing load, RPM, commanded pressure, and actual pressure.',
      'Inspect fuel supply, filter restriction, air intrusion, and visible leaks.',
      'Compare commanded versus actual rail pressure at idle, snap throttle, and controlled load.',
      'Check metering control B connector, wiring continuity, fuse feed, ground, and actuator command.',
      'Inspect related fuel pressure sensor and crank/cam sync data.',
      'Verify the repair by confirming pressure tracks command and P0257 does not reset.',
    ],
    doNotReplace: 'Do not install a high-pressure pump before checking supply fuel, wiring, actuator command, and sensor plausibility.',
    costLevel: 'Moderate for filter, wiring, actuator, or connector repair; expensive only after pump failure is proven.',
    relatedSearches: ['p0257 code', 'p0257 injection pump', 'p0257 symptoms', 'p0257 causes', 'p0257 fix'],
    links: [
      { href: '/en/codes/p0251', label: 'P0251 fuel metering A' },
      { href: '/en/codes/p0216', label: 'P0216 injection timing' },
      { href: '/en/codes/p0258', label: 'P0258 related metering code' },
      { href: '/en/car-problem-finder/loss-of-power', label: 'Loss of power guide' },
    ],
  },
  P0283: {
    query: 'p0283',
    title: 'P0283 Code: Cylinder 8 Injector Circuit High',
    answer: 'P0283 means the cylinder 8 injector circuit is reading high. The usual diagnostic split is injector coil resistance, connector condition, short-to-voltage, open/high-resistance wiring, and driver/FICM control. It should not be treated as a guaranteed bad injector.',
    severity: 'Moderate to high. A dead or uncontrolled cylinder can cause rough idle, misfire, low power, increased fuel use, smoke, and catalyst or DPF stress.',
    safeToDrive: 'Avoid driving if the engine shakes badly, smokes, smells of raw fuel, or the check engine light flashes. Gentle short driving may be possible only if symptoms are mild.',
    firstChecks: [
      'Confirm cylinder 8 location and save freeze-frame conditions.',
      'Compare cylinder 8 injector resistance to other injectors.',
      'Inspect the cylinder 8 connector for spread pins, corrosion, oil, or broken locking tabs.',
      'Check for short-to-voltage or open/high resistance in the injector harness.',
      'Use live cylinder balance, contribution, or misfire data to confirm the affected cylinder.',
      'Clear codes after repair and verify the cylinder contribution returns to normal.',
    ],
    doNotReplace: 'Do not replace the injector, injector driver module, or PCM before proving the cylinder 8 circuit with electrical tests.',
    costLevel: 'Moderate for injector, connector, or harness repair; higher if a driver module is proven faulty.',
    relatedSearches: ['p0283 code', 'p0283 symptoms', 'p0283 cylinder 8 injector', 'p0283 causes', 'p0283 fix'],
    links: [
      { href: '/en/codes/p0292', label: 'P0292 injector circuit high' },
      { href: '/en/codes/p0282', label: 'P0282 cylinder 8 injector low' },
      { href: '/en/codes/p0208', label: 'P0208 cylinder 8 injector circuit' },
      { href: '/en/car-problem-finder/car-jerks-while-driving', label: 'Misfire and jerking guide' },
    ],
  },
};

export function getTopImpressionCodeFocus(locale: string, code: string) {
  if (locale !== 'en') return null;
  return CODE_FOCUS[code.toUpperCase()] || null;
}

export function getTopImpressionCodes() {
  return Object.keys(CODE_FOCUS);
}
