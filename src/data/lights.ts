export interface WarningLight {
  id: string;
  name: string;
  color: 'red' | 'yellow' | 'green' | 'blue';
  urgency: 'Critical' | 'Moderate' | 'Information';
  description: string;
  commonCauses: string[];
  whatToDo: string;
  iconSvg: string;
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
    iconSvg: '<img src="/icons/check-engine.jpg" alt="Check Engine Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />'
  },
  'abs': {
    id: 'abs',
    name: 'ABS (Anti-lock Braking System)',
    color: 'yellow',
    urgency: 'Moderate',
    description: 'Indicates a problem with the Anti-lock Braking System. Normal braking will still function, but the anti-lock feature is disabled.',
    commonCauses: ['Faulty wheel speed sensor', 'Low brake fluid', 'Blown fuse', 'Damaged ABS module'],
    whatToDo: 'Drive with caution as you will not have anti-lock assistance during hard braking. Have the system inspected by a mechanic.',
    iconSvg: '<img src="/icons/abs.jpg" alt="ABS Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />'
  },
  'oil-pressure': {
    id: 'oil-pressure',
    name: 'Low Engine Oil Pressure',
    color: 'red',
    urgency: 'Critical',
    description: 'Indicates that the engine has lost oil pressure or the oil level is critically low. This is one of the most serious warning lights.',
    commonCauses: ['Low oil level', 'Faulty oil pump', 'Defective oil pressure sensor', 'Worn engine bearings'],
    whatToDo: 'Pull over immediately in a safe place and turn off the engine. Check the oil level with the dipstick. Do not drive the car until the issue is resolved to prevent catastrophic engine failure.',
    iconSvg: '<img src="/icons/oil-pressure.jpg" alt="Oil Pressure Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />'
  },
  'battery': {
    id: 'battery',
    name: 'Battery / Charging System',
    color: 'red',
    urgency: 'Critical',
    description: 'Indicates a problem with the vehicle\'s charging system, meaning the battery is not being charged by the alternator.',
    commonCauses: ['Failing alternator', 'Broken alternator belt', 'Corroded battery terminals', 'Dead or dying battery'],
    whatToDo: 'Turn off unnecessary electrical accessories (radio, AC, heater). Drive to the nearest mechanic or safe location immediately. The car will stop running once the battery drains completely.',
    iconSvg: '<img src="/icons/battery.jpg" alt="Battery Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />'
  },
  'tpms': {
    id: 'tpms',
    name: 'Tire Pressure (TPMS)',
    color: 'yellow',
    urgency: 'Moderate',
    description: 'Indicates that one or more of your tires is significantly under-inflated.',
    commonCauses: ['Punctured tire', 'Natural pressure loss over time', 'Sudden temperature drop', 'Faulty TPMS sensor'],
    whatToDo: 'Check tire pressures as soon as possible and inflate to the recommended PSI found inside the driver\'s door jamb. If the light flashes for 60-90 seconds when you start the car, a TPMS sensor has failed.',
    iconSvg: '<img src="/icons/tpms.jpg" alt="TPMS Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />'
  },
  'coolant-temp': {
    id: 'coolant-temp',
    name: 'Engine Temperature',
    color: 'red',
    urgency: 'Critical',
    description: 'Indicates that the engine is overheating. Continuing to drive can cause severe permanent engine damage.',
    commonCauses: ['Low coolant level', 'Coolant leak', 'Failing water pump', 'Broken radiator fan', 'Stuck thermostat'],
    whatToDo: 'Pull over safely and turn off the engine immediately. Do NOT attempt to open the radiator cap while the engine is hot. Wait for it to cool before checking coolant levels.',
    iconSvg: '<img src="/icons/coolant-temp.jpg" alt="Coolant Temperature Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />'
  },
  'brake': {
    id: 'brake',
    name: 'Brake System',
    color: 'red',
    urgency: 'Critical',
    description: 'Indicates a serious issue with the braking system or that the parking brake is engaged.',
    commonCauses: ['Parking brake is on', 'Low brake fluid', 'Worn brake pads', 'Failed hydraulic circuit'],
    whatToDo: 'Ensure the parking brake is fully released. If the light stays on, pull over safely. The car may take significantly longer to stop. Have the vehicle towed to a mechanic.',
    iconSvg: '<img src="/icons/brake.jpg" alt="Brake System Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />'
  },
  'airbag': {
    id: 'airbag',
    name: 'Airbag (SRS)',
    color: 'red',
    urgency: 'Moderate',
    description: 'Indicates a malfunction in the Supplemental Restraint System (Airbags). The airbags will likely NOT deploy in an accident.',
    commonCauses: ['Faulty clock spring', 'Loose connector under seat', 'Failed impact sensor', 'Seatbelt latch failure'],
    whatToDo: 'The vehicle is safe to drive, but occupants are at higher risk in an accident. Have the system scanned and repaired by a professional.',
    iconSvg: '<img src="/icons/airbag.jpg" alt="Airbag Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />'
  },
  'traction': {
    id: 'traction',
    name: 'Traction Control System',
    color: 'yellow',
    urgency: 'Information',
    description: 'When flashing, it indicates the system is actively working to prevent wheel slip. If it stays on continuously, the system is disabled or faulty.',
    commonCauses: ['Slippery road conditions (if flashing)', 'Faulty wheel speed sensor', 'TCS manually turned off', 'Steering angle sensor issue'],
    whatToDo: 'If flashing, drive carefully as roads are slippery. If solid, ensure the TCS button wasn\'t accidentally pressed. If it remains on, normal driving is fine but expect wheel slip in poor conditions.',
    iconSvg: '<img src="/icons/traction.jpg" alt="Traction Control Warning Light" class="w-full h-full object-cover mix-blend-screen rounded-full" />'
  }
};

type LightCopy = Pick<WarningLight, 'name' | 'description' | 'commonCauses' | 'whatToDo'>;

const localizedWarningLights: Record<string, Record<string, LightCopy>> = {
  de: {
    'check-engine': {
      name: 'Motorkontrollleuchte',
      description: 'Die Motorkontrollleuchte gehört zum OBD-Diagnosesystem des Fahrzeugs. Sie weist auf ein Problem mit Motor, Abgasreinigung oder Antriebsstrang hin.',
      commonCauses: ['Lockerer Tankdeckel', 'Defekte Lambdasonde', 'Katalysatorproblem', 'Verschlissene Zündkerzen oder Kabel', 'Defekter Luftmassenmesser'],
      whatToDo: 'Wenn die Leuchte dauerhaft leuchtet, lassen Sie die Fehlercodes bald auslesen. Wenn sie blinkt, halten Sie sicher an und stellen Sie den Motor ab, da schwere Fehlzündungen den Katalysator beschädigen können.',
    },
  },
  es: {
    'check-engine': {
      name: 'Luz de Check Engine',
      description: 'La luz de Check Engine forma parte del sistema de diagnóstico OBD del vehículo. Indica un problema en el motor, emisiones o tren motriz.',
      commonCauses: ['Tapón de combustible flojo', 'Sensor de oxígeno defectuoso', 'Problema del catalizador', 'Bujías o cables desgastados', 'Fallo del sensor MAF'],
      whatToDo: 'Si la luz permanece fija, lea los códigos pronto. Si parpadea, deténgase en un lugar seguro y apague el motor, ya que un fallo de encendido severo puede dañar el catalizador.',
    },
  },
  fr: {
    'check-engine': {
      name: 'Voyant moteur',
      description: 'Le voyant moteur fait partie du système de diagnostic OBD du véhicule. Il signale un problème lié au moteur, aux émissions ou au groupe motopropulseur.',
      commonCauses: ['Bouchon de carburant mal serré', 'Sonde oxygène défectueuse', 'Problème de catalyseur', 'Bougies ou câbles usés', 'Défaillance du capteur MAF'],
      whatToDo: 'Si le voyant reste fixe, faites lire les codes rapidement. S’il clignote, arrêtez-vous en sécurité et coupez le moteur, car des ratés sévères peuvent endommager le catalyseur.',
    },
  },
  tr: {
    'check-engine': {
      name: 'Motor Arıza Lambası',
      description: 'Motor arıza lambası, aracın OBD teşhis sisteminin bir parçasıdır. Motor, emisyon veya güç aktarma sistemiyle ilgili bir sorun algılandığında yanar.',
      commonCauses: ['Gevşek yakıt kapağı', 'Arızalı oksijen sensörü', 'Katalitik konvertör verim sorunu', 'Aşınmış buji veya buji kablosu', 'MAF sensörü arızası'],
      whatToDo: 'Lamba sabit yanıyorsa kısa süre içinde arıza kodunu okutun. Lamba yanıp sönüyorsa güvenli bir yerde durup motoru kapatın; bu durum katalizöre zarar verebilecek ciddi teklemeyi gösterebilir.',
    },
    abs: {
      name: 'ABS Fren Uyarısı',
      description: 'ABS sisteminde sorun olduğunu gösterir. Normal frenleme çalışabilir, ancak kilitlenmeyi önleme desteği devre dışı kalmış olabilir.',
      commonCauses: ['Arızalı tekerlek hız sensörü', 'Düşük fren hidroliği', 'Yanmış sigorta', 'ABS modülü arızası'],
      whatToDo: 'Ani frenlerde ABS desteği olmayabileceği için dikkatli sürün. Fren hidroliği ve ABS kodları kontrol edilmelidir.',
    },
    'oil-pressure': {
      name: 'Düşük Motor Yağı Basıncı',
      description: 'Motor yağ basıncının düştüğünü veya yağ seviyesinin kritik seviyede olduğunu gösterir. En ciddi uyarılardan biridir.',
      commonCauses: ['Düşük yağ seviyesi', 'Arızalı yağ pompası', 'Arızalı yağ basınç sensörü', 'Aşınmış motor yatakları'],
      whatToDo: 'Güvenli şekilde hemen durun ve motoru kapatın. Yağ seviyesini kontrol edin; sorun çözülmeden aracı kullanmayın.',
    },
    battery: {
      name: 'Akü / Şarj Sistemi',
      description: 'Akünün alternatör tarafından doğru şarj edilmediğini veya şarj sisteminde sorun olduğunu gösterir.',
      commonCauses: ['Arızalı alternatör', 'Kopmuş alternatör kayışı', 'Korozyonlu akü kutupları', 'Zayıf veya bitmiş akü'],
      whatToDo: 'Gereksiz elektrikli donanımları kapatın ve güvenli bir yere ya da servise gidin. Akü tamamen boşalırsa araç stop edebilir.',
    },
    tpms: {
      name: 'Lastik Basıncı Uyarısı (TPMS)',
      description: 'Bir veya daha fazla lastiğin önerilen basıncın belirgin şekilde altında olduğunu gösterir.',
      commonCauses: ['Patlak lastik', 'Zamanla basınç kaybı', 'Ani sıcaklık düşüşü', 'TPMS sensörü arızası'],
      whatToDo: 'Lastik basınçlarını en kısa sürede kontrol edip kapı içindeki etikette yazan değere göre ayarlayın.',
    },
    'coolant-temp': {
      name: 'Motor Sıcaklığı Uyarısı',
      description: 'Motorun aşırı ısındığını gösterir. Sürmeye devam etmek kalıcı motor hasarına neden olabilir.',
      commonCauses: ['Düşük soğutma suyu', 'Soğutma suyu kaçağı', 'Arızalı su pompası', 'Bozuk radyatör fanı', 'Takılı termostat'],
      whatToDo: 'Güvenli şekilde durup motoru kapatın. Motor sıcakken radyatör kapağını açmayın.',
    },
    brake: {
      name: 'Fren Sistemi Uyarısı',
      description: 'Fren sisteminde ciddi bir sorun olabileceğini veya el freninin çekili kaldığını gösterir.',
      commonCauses: ['El freni çekili', 'Düşük fren hidroliği', 'Aşınmış fren balataları', 'Hidrolik devre arızası'],
      whatToDo: 'El freninin tamamen indiğini kontrol edin. Lamba sönmüyorsa güvenli şekilde durun ve fren sistemini kontrol ettirin.',
    },
    airbag: {
      name: 'Hava Yastığı (SRS) Uyarısı',
      description: 'Hava yastığı sisteminde arıza olduğunu gösterir. Kaza anında hava yastıkları çalışmayabilir.',
      commonCauses: ['Arızalı direksiyon zembereği', 'Koltuk altı soket gevşekliği', 'Darbe sensörü arızası', 'Emniyet kemeri kilidi arızası'],
      whatToDo: 'Araç yürüyebilir; ancak kaza güvenliği azalır. Sistemi profesyonel bir serviste taratın.',
    },
    traction: {
      name: 'Çekiş Kontrol Sistemi',
      description: 'Yanıp sönüyorsa sistem patinajı önlemek için çalışıyordur. Sürekli yanıyorsa sistem kapalı veya arızalı olabilir.',
      commonCauses: ['Kaygan yol koşulları', 'Arızalı tekerlek hız sensörü', 'TCS düğmesinin kapatılması', 'Direksiyon açı sensörü sorunu'],
      whatToDo: 'Yanıp sönüyorsa dikkatli sürün. Sürekli yanıyorsa TCS düğmesini ve ilgili arıza kodlarını kontrol edin.',
    },
  },
};

export function getLocalizedWarningLight(light: WarningLight, locale: string): WarningLight {
  const localized = localizedWarningLights[locale]?.[light.id];
  if (!localized) return light;
  return { ...light, ...localized };
}
