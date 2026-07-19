export interface WarningLight {
  id: string;
  name: string;
  color: 'red' | 'yellow' | 'green' | 'blue';
  urgency: 'Critical' | 'Moderate' | 'Information';
  description: string;
  commonCauses: string[];
  whatToDo: string;
  iconSvg: string;
  imageSrc: string;
}

export const warningLights: Record<string, WarningLight> = {
  'check-engine': {
    id: 'check-engine',
    name: 'Check Engine Light',
    color: 'yellow',
    urgency: 'Moderate',
    description: 'The check engine light is part of your car\'s onboard diagnostics (OBD) system. It indicates an issue with the engine, emissions, or powertrain.',
    commonCauses: ['Loose gas cap', 'Faulty oxygen sensor', 'Catalytic converter failure', 'Bad spark plugs or wires', 'Mass airflow sensor failure'],
    whatToDo: 'If it is solid, schedule a diagnostic check soon. If it is flashing, pull over safely and turn off the engine immediately as it indicates a severe misfire that could damage the catalytic converter.',
    iconSvg: '<img src="/icons/check-engine.jpg" alt="Check Engine Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />',
    imageSrc: '/images/lights/check_engine_light_1783448321560.jpg',
  },
  'abs': {
    id: 'abs',
    name: 'ABS (Anti-lock Braking System)',
    color: 'yellow',
    urgency: 'Moderate',
    description: 'Indicates a problem with the Anti-lock Braking System. Normal braking will still function, but the anti-lock feature is disabled.',
    commonCauses: ['Faulty wheel speed sensor', 'Low brake fluid', 'Blown fuse', 'Damaged ABS module'],
    whatToDo: 'Drive with caution as you will not have anti-lock assistance during hard braking. Have the system inspected by a mechanic.',
    iconSvg: '<img src="/icons/abs.jpg" alt="ABS Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />',
    imageSrc: '/images/lights/abs_light_1783448344625.jpg',
  },
  'oil-pressure': {
    id: 'oil-pressure',
    name: 'Low Engine Oil Pressure',
    color: 'red',
    urgency: 'Critical',
    description: 'Indicates that the engine has lost oil pressure or the oil level is critically low. This is one of the most serious warning lights.',
    commonCauses: ['Low oil level', 'Faulty oil pump', 'Defective oil pressure sensor', 'Worn engine bearings'],
    whatToDo: 'Pull over immediately in a safe place and turn off the engine. Check the oil level with the dipstick. Do not drive the car until the issue is resolved to prevent catastrophic engine failure.',
    iconSvg: '<img src="/icons/oil-pressure.jpg" alt="Oil Pressure Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />',
    imageSrc: '/images/lights/oil_light_1783448354002.jpg',
  },
  'battery': {
    id: 'battery',
    name: 'Battery / Charging System',
    color: 'red',
    urgency: 'Critical',
    description: 'Indicates a problem with the vehicle\'s charging system, meaning the battery is not being charged by the alternator.',
    commonCauses: ['Failing alternator', 'Broken alternator belt', 'Corroded battery terminals', 'Dead or dying battery'],
    whatToDo: 'Turn off unnecessary electrical accessories (radio, AC, heater). Drive to the nearest mechanic or safe location immediately. The car will stop running once the battery drains completely.',
    iconSvg: '<img src="/icons/battery.jpg" alt="Battery Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />',
    imageSrc: '/images/lights/battery_light_1783448361904.jpg',
  },
  'tpms': {
    id: 'tpms',
    name: 'Tire Pressure (TPMS)',
    color: 'yellow',
    urgency: 'Moderate',
    description: 'Indicates that one or more of your tires is significantly under-inflated.',
    commonCauses: ['Punctured tire', 'Natural pressure loss over time', 'Sudden temperature drop', 'Faulty TPMS sensor'],
    whatToDo: 'Check tire pressures as soon as possible and inflate to the recommended PSI found inside the driver\'s door jamb. If the light flashes for 60-90 seconds when you start the car, a TPMS sensor has failed.',
    iconSvg: '<img src="/icons/tpms.jpg" alt="TPMS Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />',
    imageSrc: '/images/lights/tpms_light_1783448369920.jpg',
  },
  'coolant-temp': {
    id: 'coolant-temp',
    name: 'Engine Temperature',
    color: 'red',
    urgency: 'Critical',
    description: 'Indicates that the engine is overheating. Continuing to drive can cause severe permanent engine damage.',
    commonCauses: ['Low coolant level', 'Coolant leak', 'Failing water pump', 'Broken radiator fan', 'Stuck thermostat'],
    whatToDo: 'Pull over safely and turn off the engine immediately. Do NOT attempt to open the radiator cap while the engine is hot. Wait for it to cool before checking coolant levels.',
    iconSvg: '<img src="/icons/coolant-temp.jpg" alt="Coolant Temperature Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />',
    imageSrc: '/images/lights/coolant_light_1783448378276.jpg',
  },
  'brake': {
    id: 'brake',
    name: 'Brake System',
    color: 'red',
    urgency: 'Critical',
    description: 'Indicates a serious issue with the braking system or that the parking brake is engaged.',
    commonCauses: ['Parking brake is on', 'Low brake fluid', 'Worn brake pads', 'Failed hydraulic circuit'],
    whatToDo: 'Ensure the parking brake is fully released. If the light stays on, pull over safely. The car may take significantly longer to stop. Have the vehicle towed to a mechanic.',
    iconSvg: '<img src="/icons/brake.jpg" alt="Brake System Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />',
    imageSrc: '/images/lights/brake_light_1783448395046.jpg',
  },
  'airbag': {
    id: 'airbag',
    name: 'Airbag (SRS)',
    color: 'red',
    urgency: 'Moderate',
    description: 'Indicates a malfunction in the Supplemental Restraint System (Airbags). The airbags will likely NOT deploy in an accident.',
    commonCauses: ['Faulty clock spring', 'Loose connector under seat', 'Failed impact sensor', 'Seatbelt latch failure'],
    whatToDo: 'The vehicle is safe to drive, but occupants are at higher risk in an accident. Have the system scanned and repaired by a professional.',
    iconSvg: '<img src="/icons/airbag.jpg" alt="Airbag Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />',
    imageSrc: '/images/lights/airbag_light_1783448402719.jpg',
  },
  'traction': {
    id: 'traction',
    name: 'Traction Control System',
    color: 'yellow',
    urgency: 'Information',
    description: 'When flashing, it indicates the system is actively working to prevent wheel slip. If it stays on continuously, the system is disabled or faulty.',
    commonCauses: ['Slippery road conditions (if flashing)', 'Faulty wheel speed sensor', 'TCS manually turned off', 'Steering angle sensor issue'],
    whatToDo: 'If flashing, drive carefully as roads are slippery. If solid, ensure the TCS button wasn\'t accidentally pressed. If it remains on, normal driving is fine but expect wheel slip in poor conditions.',
    iconSvg: '<img src="/icons/traction.jpg" alt="Traction Control Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />',
    imageSrc: '/images/lights/traction_light_1783448410452.jpg',
  }
};

type LightCopy = Pick<WarningLight, 'name' | 'description' | 'commonCauses' | 'whatToDo'>;

const localizedWarningLights: Record<string, Record<string, LightCopy>> = {
  de: {
    'check-engine': {
      name: 'Motorkontrollleuchte',
      description: 'Die Motorkontrollleuchte geh\u00F6rt zum OBD-Diagnosesystem des Fahrzeugs. Sie weist auf ein Problem mit Motor, Abgasreinigung oder Antriebsstrang hin.',
      commonCauses: ['Lockerer Tankdeckel', 'Defekte Lambdasonde', 'Katalysatorproblem', 'Verschlissene Z\u00FCndkerzen oder Kabel', 'Defekter Luftmassenmesser'],
      whatToDo: 'Wenn die Leuchte dauerhaft leuchtet, lassen Sie die Fehlercodes bald auslesen. Wenn sie blinkt, halten Sie sicher an und stellen Sie den Motor ab, da schwere Fehlz\u00FCndungen den Katalysator besch\u00E4digen k\u00F6nnen.',
    },
  },
  es: {
    'check-engine': {
      name: 'Luz de Check Engine',
      description: 'La luz de Check Engine forma parte del sistema de diagn\u00F3stico OBD del veh\u00EDculo. Indica un problema en el motor, emisiones o tren motriz.',
      commonCauses: ['Tap\u00F3n de combustible flojo', 'Sensor de ox\u00EDgeno defectuoso', 'Problema del catalizador', 'Buj\u00EDas o cables desgastados', 'Fallo del sensor MAF'],
      whatToDo: 'Si la luz permanece fija, lea los c\u00F3digos pronto. Si parpadea, det\u00E9ngase en un lugar seguro y apague el motor, ya que un fallo de encendido severo puede da\u00F1ar el catalizador.',
    },
  },
  fr: {
    'check-engine': {
      name: 'Voyant moteur',
      description: 'Le voyant moteur fait partie du syst\u00E8me de diagnostic OBD du v\u00E9hicule. Il signale un probl\u00E8me li\u00E9 au moteur, aux \u00E9missions ou au groupe motopropulseur.',
      commonCauses: ['Bouchon de carburant mal serr\u00E9', 'Sonde oxyg\u00E8ne d\u00E9fectueuse', 'Probl\u00E8me de catalyseur', 'Bougies ou c\u00E2bles us\u00E9s', 'D\u00E9faillance du capteur MAF'],
      whatToDo: 'Si le voyant reste fixe, faites lire les codes rapidement. S\u2019il clignote, arr\u00EAtez-vous en s\u00E9curit\u00E9 et coupez le moteur, car des rat\u00E9s s\u00E9v\u00E8res peuvent endommager le catalyseur.',
    },
  },
  tr: {
    'check-engine': {
      name: 'Motor Ar\u0131za Lambas\u0131',
      description: 'Motor ar\u0131za lambas\u0131, arac\u0131n OBD te\u015Fhis sisteminin bir par\u00E7as\u0131d\u0131r. Motor, emisyon veya g\u00FC\u00E7 aktarma sistemiyle ilgili bir sorun alg\u0131land\u0131\u011F\u0131nda yanar.',
      commonCauses: ['Gev\u015Fek yak\u0131t kapa\u011F\u0131', 'Ar\u0131zal\u0131 oksijen sens\u00F6r\u00FC', 'Katalitik konvert\u00F6r verim sorunu', 'A\u015F\u0131nm\u0131\u015F buji veya buji kablosu', 'MAF sens\u00F6r\u00FC ar\u0131zas\u0131'],
      whatToDo: 'Lamba sabit yan\u0131yorsa k\u0131sa s\u00FCre i\u00E7inde ar\u0131za kodunu okutun. Lamba yan\u0131p s\u00F6n\u00FCyorsa g\u00FCvenli bir yerde durup motoru kapat\u0131n; bu durum kataliz\u00F6re zarar verebilecek ciddi teklemeyi g\u00F6sterebilir.',
    },
    abs: {
      name: 'ABS Fren Uyar\u0131s\u0131',
      description: 'ABS sisteminde sorun oldu\u011Funu g\u00F6sterir. Normal frenleme \u00E7al\u0131\u015Fabilir, ancak kilitlenmeyi \u00F6nleme deste\u011Fi devre d\u0131\u015F\u0131 kalm\u0131\u015F olabilir.',
      commonCauses: ['Ar\u0131zal\u0131 tekerlek h\u0131z sens\u00F6r\u00FC', 'D\u00FC\u015F\u00FCk fren hidroli\u011Fi', 'Yanm\u0131\u015F sigorta', 'ABS mod\u00FCl\u00FC ar\u0131zas\u0131'],
      whatToDo: 'Ani frenlerde ABS deste\u011Fi olmayabilece\u011Fi i\u00E7in dikkatli s\u00FCr\u00FCn. Fren hidroli\u011Fi ve ABS kodlar\u0131 kontrol edilmelidir.',
    },
    'oil-pressure': {
      name: 'D\u00FC\u015F\u00FCk Motor Ya\u011F\u0131 Bas\u0131nc\u0131',
      description: 'Motor ya\u011F bas\u0131nc\u0131n\u0131n d\u00FC\u015Ft\u00FC\u011F\u00FCn\u00FC veya ya\u011F seviyesinin kritik seviyede oldu\u011Funu g\u00F6sterir. En ciddi uyar\u0131lardan biridir.',
      commonCauses: ['D\u00FC\u015F\u00FCk ya\u011F seviyesi', 'Ar\u0131zal\u0131 ya\u011F pompas\u0131', 'Ar\u0131zal\u0131 ya\u011F bas\u0131n\u00E7 sens\u00F6r\u00FC', 'A\u015F\u0131nm\u0131\u015F motor yataklar\u0131'],
      whatToDo: 'G\u00FCvenli \u015Fekilde hemen durun ve motoru kapat\u0131n. Ya\u011F seviyesini kontrol edin; sorun \u00E7\u00F6z\u00FClmeden arac\u0131 kullanmay\u0131n.',
    },
    battery: {
      name: 'Ak\u00FC / \u015Earj Sistemi',
      description: 'Ak\u00FCn\u00FCn alternat\u00F6r taraf\u0131ndan do\u011Fru \u015Farj edilmedi\u011Fini veya \u015Farj sisteminde sorun oldu\u011Funu g\u00F6sterir.',
      commonCauses: ['Ar\u0131zal\u0131 alternat\u00F6r', 'Kopmu\u015F alternat\u00F6r kay\u0131\u015F\u0131', 'Korozyonlu ak\u00FC kutuplar\u0131', 'Zay\u0131f veya bitmi\u015F ak\u00FC'],
      whatToDo: 'Gereksiz elektrikli donan\u0131mlar\u0131 kapat\u0131n ve g\u00FCvenli bir yere ya da servise gidin. Ak\u00FC tamamen bo\u015Fal\u0131rsa ara\u00E7 stop edebilir.',
    },
    tpms: {
      name: 'Lastik Bas\u0131nc\u0131 Uyar\u0131s\u0131 (TPMS)',
      description: 'Bir veya daha fazla lasti\u011Fin \u00F6nerilen bas\u0131nc\u0131n belirgin \u015Fekilde alt\u0131nda oldu\u011Funu g\u00F6sterir.',
      commonCauses: ['Patlak lastik', 'Zamanla bas\u0131n\u00E7 kayb\u0131', 'Ani s\u0131cakl\u0131k d\u00FC\u015F\u00FC\u015F\u00FC', 'TPMS sens\u00F6r\u00FC ar\u0131zas\u0131'],
      whatToDo: 'Lastik bas\u0131n\u00E7lar\u0131n\u0131 en k\u0131sa s\u00FCrede kontrol edip kap\u0131 i\u00E7indeki etikette yazan de\u011Fere g\u00F6re ayarlay\u0131n.',
    },
    'coolant-temp': {
      name: 'Motor S\u0131cakl\u0131\u011F\u0131 Uyar\u0131s\u0131',
      description: 'Motorun a\u015F\u0131r\u0131 \u0131s\u0131nd\u0131\u011F\u0131n\u0131 g\u00F6sterir. S\u00FCrmeye devam etmek kal\u0131c\u0131 motor hasar\u0131na neden olabilir.',
      commonCauses: ['D\u00FC\u015F\u00FCk so\u011Futma suyu', 'So\u011Futma suyu ka\u00E7a\u011F\u0131', 'Ar\u0131zal\u0131 su pompas\u0131', 'Bozuk radyat\u00F6r fan\u0131', 'Tak\u0131l\u0131 termostat'],
      whatToDo: 'G\u00FCvenli \u015Fekilde durup motoru kapat\u0131n. Motor s\u0131cakken radyat\u00F6r kapa\u011F\u0131n\u0131 a\u00E7may\u0131n.',
    },
    brake: {
      name: 'Fren Sistemi Uyar\u0131s\u0131',
      description: 'Fren sisteminde ciddi bir sorun olabilece\u011Fini veya el freninin \u00E7ekili kald\u0131\u011F\u0131n\u0131 g\u00F6sterir.',
      commonCauses: ['El freni \u00E7ekili', 'D\u00FC\u015F\u00FCk fren hidroli\u011Fi', 'A\u015F\u0131nm\u0131\u015F fren balatalar\u0131', 'Hidrolik devre ar\u0131zas\u0131'],
      whatToDo: 'El freninin tamamen indi\u011Fini kontrol edin. Lamba s\u00F6nm\u00FCyorsa g\u00FCvenli \u015Fekilde durun ve fren sistemini kontrol ettirin.',
    },
    airbag: {
      name: 'Hava Yast\u0131\u011F\u0131 (SRS) Uyar\u0131s\u0131',
      description: 'Hava yast\u0131\u011F\u0131 sisteminde ar\u0131za oldu\u011Funu g\u00F6sterir. Kaza an\u0131nda hava yast\u0131klar\u0131 \u00E7al\u0131\u015Fmayabilir.',
      commonCauses: ['Ar\u0131zal\u0131 direksiyon zembere\u011Fi', 'Koltuk alt\u0131 soket gev\u015Fekli\u011Fi', 'Darbe sens\u00F6r\u00FC ar\u0131zas\u0131', 'Emniyet kemeri kilidi ar\u0131zas\u0131'],
      whatToDo: 'Ara\u00E7 y\u00FCr\u00FCyebilir; ancak kaza g\u00FCvenli\u011Fi azal\u0131r. Sistemi profesyonel bir serviste tarat\u0131n.',
    },
    traction: {
      name: '\u00C7eki\u015F Kontrol Sistemi',
      description: 'Yan\u0131p s\u00F6n\u00FCyorsa sistem patinaj\u0131 \u00F6nlemek i\u00E7in \u00E7al\u0131\u015F\u0131yordur. S\u00FCrekli yan\u0131yorsa sistem kapal\u0131 veya ar\u0131zal\u0131 olabilir.',
      commonCauses: ['Kaygan yol ko\u015Fullar\u0131', 'Ar\u0131zal\u0131 tekerlek h\u0131z sens\u00F6r\u00FC', 'TCS d\u00FC\u011Fmesinin kapat\u0131lmas\u0131', 'Direksiyon a\u00E7\u0131 sens\u00F6r\u00FC sorunu'],
      whatToDo: 'Yan\u0131p s\u00F6n\u00FCyorsa dikkatli s\u00FCr\u00FCn. S\u00FCrekli yan\u0131yorsa TCS d\u00FC\u011Fmesini ve ilgili ar\u0131za kodlar\u0131n\u0131 kontrol edin.',
    },
  },
};
export function getLocalizedWarningLight(light: WarningLight, locale: string): WarningLight {
  const localized = localizedWarningLights[locale]?.[light.id];
  if (!localized) return light;
  return { ...light, ...localized };
}
