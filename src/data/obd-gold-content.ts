import type { MultiLangArray, MultiLangString, OBD2Code } from './db';

type GoldSystem =
  | 'sensor'
  | 'fuel'
  | 'injector'
  | 'misfire'
  | 'emissions'
  | 'evap'
  | 'transmission'
  | 'cooling'
  | 'turbo'
  | 'control'
  | 'powertrain';

const systemSymptoms: Record<GoldSystem, string[]> = {
  sensor: ['symp_check_engine', 'symp_poor_acceleration', 'symp_fuel_economy', 'symp_hesitation', 'symp_power_loss'],
  fuel: ['symp_check_engine', 'symp_hard_start', 'symp_stalling', 'symp_power_loss', 'symp_fuel_smell'],
  injector: ['symp_check_engine', 'symp_misfire_feel', 'symp_rough_idle', 'symp_power_loss', 'symp_poor_acceleration'],
  misfire: ['symp_check_engine', 'symp_misfire_feel', 'symp_rough_idle', 'symp_vibration', 'symp_failed_emissions'],
  emissions: ['symp_check_engine', 'symp_failed_emissions', 'symp_fuel_economy', 'symp_rotten_egg_smell', 'symp_power_loss'],
  evap: ['symp_check_engine', 'symp_fuel_smell', 'symp_failed_emissions', 'symp_hard_start', 'symp_rough_idle'],
  transmission: ['symp_check_engine', 'symp_hard_shifting', 'symp_transmission_slip', 'symp_delayed_engagement', 'symp_reduced_power_mode'],
  cooling: ['symp_check_engine', 'symp_engine_overheat', 'symp_coolant_temp_warning', 'symp_fan_not_working', 'symp_power_loss'],
  turbo: ['symp_check_engine', 'symp_turbo_lag', 'symp_power_loss', 'symp_black_smoke', 'symp_poor_acceleration'],
  control: ['symp_check_engine', 'symp_reduced_power_mode', 'symp_stalling', 'symp_no_start', 'symp_battery_drain'],
  powertrain: ['symp_check_engine', 'symp_power_loss', 'symp_poor_acceleration', 'symp_fuel_economy', 'symp_hesitation'],
};

const systemCauses: Record<GoldSystem, string[]> = {
  sensor: ['cause_wiring_damage', 'cause_connector_corrosion', 'cause_pcm_failure', 'cause_pcm_software', 'cause_throttle_position'],
  fuel: ['cause_fuel_pump', 'cause_fuel_filter', 'cause_fuel_pressure_reg', 'cause_wiring_damage', 'cause_connector_corrosion'],
  injector: ['cause_fuel_injector', 'cause_wiring_damage', 'cause_connector_corrosion', 'cause_pcm_failure', 'cause_fuel_pressure_reg'],
  misfire: ['cause_spark_plugs', 'cause_ignition_coil', 'cause_fuel_injector', 'cause_vacuum_leak', 'cause_head_gasket'],
  emissions: ['cause_o2_sensor', 'cause_cat_converter', 'cause_exhaust_leak', 'cause_spark_plugs', 'cause_pcm_software'],
  evap: ['cause_evap_gas_cap', 'cause_evap_purge_valve', 'cause_evap_vent_valve', 'cause_evap_hose_leak', 'cause_evap_canister'],
  transmission: ['cause_transmission_fluid', 'cause_shift_solenoid', 'cause_speed_sensor_in', 'cause_speed_sensor_out', 'cause_wiring_damage'],
  cooling: ['cause_thermostat', 'cause_ect_sensor', 'cause_coolant_leak', 'cause_fan_relay', 'cause_fan_motor'],
  turbo: ['cause_turbo_wastegate', 'cause_turbo_actuator', 'cause_intake_leak', 'cause_exhaust_leak', 'cause_wiring_damage'],
  control: ['cause_wiring_damage', 'cause_connector_corrosion', 'cause_battery', 'cause_alternator', 'cause_pcm_failure'],
  powertrain: ['cause_wiring_damage', 'cause_connector_corrosion', 'cause_vacuum_leak', 'cause_pcm_software', 'cause_pcm_failure'],
};

const systemCosts: Record<GoldSystem, string> = {
  sensor: '$80 - $450',
  fuel: '$120 - $900',
  injector: '$150 - $800',
  misfire: '$80 - $1000',
  emissions: '$120 - $2500',
  evap: '$50 - $650',
  transmission: '$150 - $3000',
  cooling: '$80 - $900',
  turbo: '$200 - $2200',
  control: '$100 - $1800',
  powertrain: '$100 - $900',
};

export function getGoldCodeSystem(code: string): GoldSystem {
  const upperCode = code.toUpperCase();
  if (/^P01(0|1|2|3)/.test(upperCode)) return 'sensor';
  if (/^P02(0|1|2|6|7|8|9)/.test(upperCode)) return 'injector';
  if (/^P02(3|4|5)/.test(upperCode)) return 'fuel';
  if (/^P03/.test(upperCode)) return 'misfire';
  if (/^P04(0|1|2|3)/.test(upperCode)) return 'emissions';
  if (/^P04(4|5)/.test(upperCode)) return 'evap';
  if (/^P05/.test(upperCode)) return 'control';
  if (/^P06/.test(upperCode)) return 'control';
  if (/^P07/.test(upperCode)) return 'transmission';
  if (/^P08/.test(upperCode)) return 'transmission';
  if (/^P12(5|8)|^P011[5-9]/.test(upperCode)) return 'cooling';
  if (/^P02(3|4)|^P22|^P25/.test(upperCode)) return 'turbo';
  return 'powertrain';
}

function localizedText(value: MultiLangString | undefined, locale: string) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale as keyof typeof value] || value.en || '';
}

function descriptionIsWeak(value: MultiLangString | undefined) {
  const en = localizedText(value, 'en');
  return !en || en.length < 180 || /standard OBD2 diagnostic trouble code/i.test(en);
}

function mergeUnique(primary: string[] | undefined, fallback: string[], min = 5) {
  const values = [...(primary || []), ...fallback].filter(Boolean);
  return Array.from(new Set(values)).slice(0, Math.max(min, values.length));
}

function goldDescription(code: string, title: MultiLangString | undefined, system: GoldSystem): MultiLangString {
  const enTitle = localizedText(title, 'en') || `${code} OBD2 code`;
  const trTitle = localizedText(title, 'tr') || `${code} OBD2 arıza kodu`;
  const deTitle = localizedText(title, 'de') || `${code} OBD2-Fehlercode`;
  const esTitle = localizedText(title, 'es') || `código OBD2 ${code}`;
  const frTitle = localizedText(title, 'fr') || `code OBD2 ${code}`;
  return {
    en: `${code} means ${enTitle}. Treat it as a diagnostic starting point, not a parts order. Confirm the fault with freeze-frame data, related codes, wiring and connector checks, live data for the ${system} system, and a repair verification drive cycle before replacing expensive components.`,
    tr: `${code}, ${trTitle} anlamına gelir. Bu kodu doğrudan parça değişim listesi gibi değil, teşhis başlangıcı gibi değerlendirin. Pahalı parça değiştirmeden önce freeze-frame verisi, ilişkili kodlar, kablo-soket kontrolü, ${system} sistemi canlı verisi ve onarım sonrası sürüş döngüsüyle doğrulama yapılmalıdır.`,
    de: `${code} bedeutet ${deTitle}. Der Code ist ein Diagnoseausgangspunkt, keine Teileliste. Vor teuren Ersatzteilen sollten Freeze-Frame-Daten, verwandte Codes, Kabel und Stecker, Live-Daten des ${system}-Systems und eine Reparaturprüfung im Fahrzyklus kontrolliert werden.`,
    es: `${code} significa ${esTitle}. Úsalo como punto de partida de diagnóstico, no como una lista directa de piezas. Antes de reemplazar componentes costosos, confirma datos freeze-frame, códigos relacionados, cableado, conectores, datos en vivo del sistema ${system} y una prueba de manejo tras la reparación.`,
    fr: `${code} signifie ${frTitle}. Ce code est un point de départ de diagnostic, pas une liste de pièces. Avant de remplacer des composants coûteux, vérifiez les données freeze-frame, les codes associés, le câblage, les connecteurs, les données en direct du système ${system} et un cycle de conduite après réparation.`,
  };
}

function goldDiagnosticSteps(code: string): MultiLangArray {
  return {
    en: [
      `Confirm ${code} with a quality scan tool and save freeze-frame data before clearing codes.`,
      'Read all stored, pending and permanent codes so the root cause is not diagnosed in isolation.',
      'Inspect the named system visually: wiring, connectors, fuses, vacuum lines, fluid condition, leaks and heat damage.',
      'Use live data or a multimeter to verify power, ground, signal and operating range before replacing parts.',
      'Repair the simplest verified fault first, clear codes, then complete the required drive cycle.',
      `If ${code} returns, compare manufacturer service information and module data before replacing expensive components.`,
    ],
    tr: [
      `${code} kodunu kaliteli bir teşhis cihazıyla doğrulayın ve kodları silmeden önce freeze-frame verisini kaydedin.`,
      'Kök nedeni tek başına yorumlamamak için kayıtlı, bekleyen ve kalıcı tüm kodları okuyun.',
      'İlgili sistemi görsel olarak inceleyin: kablo, soket, sigorta, vakum hattı, sıvı durumu, kaçak ve ısı hasarı.',
      'Parça değiştirmeden önce canlı veri veya multimetre ile güç, şase, sinyal ve çalışma aralığını doğrulayın.',
      'Önce doğrulanmış en basit arızayı onarın, kodları silin ve gerekli sürüş döngüsünü tamamlayın.',
      `${code} geri gelirse pahalı parça değiştirmeden önce üretici servis bilgisi ve modül verilerini karşılaştırın.`,
    ],
    de: [
      `${code} mit einem guten Diagnosegerät bestätigen und Freeze-Frame-Daten sichern.`,
      'Alle gespeicherten, ausstehenden und permanenten Codes auslesen.',
      'Das betroffene System visuell prüfen: Kabel, Stecker, Sicherungen, Unterdruckleitungen, Flüssigkeit, Lecks und Hitzeschäden.',
      'Vor dem Teiletausch Spannung, Masse, Signal und Live-Daten mit Multimeter oder Diagnosegerät prüfen.',
      'Den einfachsten bestätigten Fehler zuerst reparieren, Codes löschen und Fahrzyklus abschließen.',
      `Wenn ${code} zurückkehrt, Herstellerdaten und Moduldaten prüfen, bevor teure Teile ersetzt werden.`,
    ],
    es: [
      `Confirma ${code} con un escáner de calidad y guarda los datos freeze-frame antes de borrar códigos.`,
      'Lee códigos almacenados, pendientes y permanentes para no diagnosticar el fallo de forma aislada.',
      'Inspecciona el sistema indicado: cableado, conectores, fusibles, mangueras, fluidos, fugas y daño por calor.',
      'Verifica alimentación, masa, señal y rango de operación con datos en vivo o multímetro antes de cambiar piezas.',
      'Repara primero la falla simple ya confirmada, borra códigos y completa el ciclo de manejo.',
      `Si ${code} vuelve, compara información de servicio y datos de módulos antes de reemplazar componentes costosos.`,
    ],
    fr: [
      `Confirmez ${code} avec un outil de diagnostic fiable et sauvegardez les données freeze-frame avant effacement.`,
      'Lisez les codes enregistrés, en attente et permanents pour éviter un diagnostic isolé.',
      'Inspectez le système concerné : câblage, connecteurs, fusibles, durites, fluides, fuites et traces de chaleur.',
      'Vérifiez alimentation, masse, signal et plage de fonctionnement avec données en direct ou multimètre avant remplacement.',
      'Réparez d’abord la panne simple confirmée, effacez les codes puis effectuez le cycle de conduite.',
      `Si ${code} revient, comparez les données constructeur et les données modules avant de remplacer des pièces coûteuses.`,
    ],
  };
}

function goldCommonFixes(code: string): MultiLangArray {
  return {
    en: [
      'Repair damaged wiring or loose/corroded connectors tied to the affected circuit.',
      'Correct leaks, fluid condition, fuses or power supply faults before replacing sensors or modules.',
      'Replace the confirmed failed component only after live-data or circuit testing supports it.',
      `After repair, clear ${code} and verify that readiness monitors complete without the code returning.`,
    ],
    tr: [
      'Etkilenen devreye bağlı hasarlı kabloyu veya gevşek/korozyonlu soketi onarın.',
      'Sensör veya modül değiştirmeden önce kaçak, sıvı durumu, sigorta ve besleme hatalarını düzeltin.',
      'Arızalı parça yalnızca canlı veri veya devre testi bunu destekliyorsa değiştirilmelidir.',
      `Onarımdan sonra ${code} kodunu silin ve readiness monitörleri tamamlandığında kodun geri dönmediğini doğrulayın.`,
    ],
    de: [
      'Beschädigte Kabel oder lose/korrodierte Stecker am betroffenen Stromkreis reparieren.',
      'Lecks, Flüssigkeitszustand, Sicherungen oder Spannungsversorgung vor Sensor- oder Modultausch korrigieren.',
      'Das bestätigte defekte Bauteil erst ersetzen, wenn Live-Daten oder Stromkreisprüfung dafür sprechen.',
      `${code} nach der Reparatur löschen und prüfen, ob die Bereitschaftsmonitore ohne Rückkehr des Codes abgeschlossen werden.`,
    ],
    es: [
      'Repara cableado dañado o conectores flojos/corroídos del circuito afectado.',
      'Corrige fugas, estado de fluidos, fusibles o alimentación antes de cambiar sensores o módulos.',
      'Reemplaza el componente confirmado solo si los datos en vivo o la prueba eléctrica lo justifican.',
      `Tras reparar, borra ${code} y confirma que los monitores se completan sin que el código vuelva.`,
    ],
    fr: [
      'Réparer le câblage endommagé ou les connecteurs desserrés/corrodés du circuit concerné.',
      'Corriger fuites, état des fluides, fusibles ou alimentation avant de remplacer capteurs ou modules.',
      'Remplacer la pièce confirmée uniquement si les données en direct ou le test électrique le justifient.',
      `Après réparation, effacer ${code} et vérifier que les moniteurs se terminent sans retour du code.`,
    ],
  };
}

function goldSafety(code: string, system: GoldSystem): OBD2Code['drivingSafety'] {
  const level = system === 'misfire' || system === 'cooling' || system === 'transmission' ? 'caution' : 'safe';
  return {
    level,
    description: {
      en: `${code} may be drivable if the vehicle runs normally, but stop driving if the warning light flashes, the engine overheats, power drops sharply, shifting becomes unsafe, or fuel/exhaust smells are strong.`,
      tr: `${code} varken araç normal çalışıyorsa kısa süreli kullanım mümkün olabilir; ancak uyarı lambası yanıp sönüyorsa, hararet varsa, güç ciddi düşüyorsa, vites geçişleri güvensizse veya yoğun yakıt/egzoz kokusu varsa aracı kullanmayı bırakın.`,
      de: `${code} kann fahrbar sein, wenn das Fahrzeug normal läuft. Bei blinkender Warnleuchte, Überhitzung, starkem Leistungsverlust, unsicherem Schalten oder starkem Kraftstoff-/Abgasgeruch nicht weiterfahren.`,
      es: `${code} puede permitir conducir si el vehículo funciona normal, pero detente si la luz parpadea, hay sobrecalentamiento, pérdida fuerte de potencia, cambios inseguros o olor intenso a combustible/escape.`,
      fr: `${code} peut permettre de rouler si le véhicule fonctionne normalement, mais arrêtez-vous si le voyant clignote, si le moteur chauffe, si la puissance chute, si les passages de vitesse deviennent dangereux ou si une forte odeur apparaît.`,
    },
  };
}

export function applyGoldObdFallback<T extends Partial<OBD2Code> & { code: string }>(data: T): T & OBD2Code {
  const code = data.code.toUpperCase();
  const system = getGoldCodeSystem(code);
  const strengthened = {
    ...data,
    code,
    title: data.title || code,
    description: descriptionIsWeak(data.description) ? goldDescription(code, data.title, system) : data.description,
    symptoms: mergeUnique(data.symptoms, systemSymptoms[system], 5),
    causes: mergeUnique(data.causes, systemCauses[system], 5),
    fixDifficulty: data.fixDifficulty || (system === 'transmission' || system === 'control' ? 'diff_professional' : 'diff_moderate'),
    estimatedCost: data.estimatedCost || systemCosts[system],
    diagnosticSteps: data.diagnosticSteps || goldDiagnosticSteps(code),
    commonFixes: data.commonFixes || goldCommonFixes(code),
    drivingSafety: data.drivingSafety || goldSafety(code, system),
  };

  return strengthened as T & OBD2Code;
}
