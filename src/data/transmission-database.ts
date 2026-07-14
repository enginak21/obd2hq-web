export interface TransmissionProfile {
  slug: string;
  maker: string;
  family: string;
  type: string;
  gears: string;
  applications: string[];
  fluid: string;
  serviceNotes: string[];
  commonFailures: string[];
  relatedCodes: string[];
}

export const transmissionProfiles: TransmissionProfile[] = [
  {
    slug: 'zf-8hp',
    maker: 'ZF',
    family: '8HP',
    type: 'Torque-converter automatic',
    gears: '8-speed',
    applications: ['BMW', 'Audi', 'Jaguar', 'Land Rover', 'Dodge/Ram', 'Alfa Romeo'],
    fluid: 'ZF Lifeguard fluid family or OEM equivalent by exact variant.',
    serviceNotes: ['Many OEMs call it lifetime fluid, but service history matters on high mileage vehicles.', 'Use correct pan/filter assembly and fill temperature procedure.'],
    commonFailures: ['Harsh shifts from adaptation/fluid issues', 'Mechatronic sleeve leaks on some variants', 'Torque converter shudder', 'Solenoid/mechatronic faults'],
    relatedCodes: ['P0700', 'P0730', 'P0741', 'P0750'],
  },
  {
    slug: 'vw-dq250-dsg',
    maker: 'Volkswagen Group',
    family: 'DQ250 DSG',
    type: 'Wet dual-clutch transmission',
    gears: '6-speed',
    applications: ['Volkswagen GTI', 'Audi A3', 'Skoda performance models', 'SEAT/Cupra models'],
    fluid: 'DSG-specific fluid with filter service.',
    serviceNotes: ['Fluid and filter service is critical.', 'Adaptation and basic settings may be required after service or clutch work.'],
    commonFailures: ['Mechatronic faults', 'Clutch adaptation issues', 'Harsh engagement', 'Speed sensor faults'],
    relatedCodes: ['P0700', 'P0720', 'P0730', 'P17BF'],
  },
  {
    slug: 'ford-dps6-powershift',
    maker: 'Ford/Getrag',
    family: 'DPS6 PowerShift',
    type: 'Dry dual-clutch transmission',
    gears: '6-speed',
    applications: ['Ford Focus', 'Ford Fiesta'],
    fluid: 'Dual-clutch transmission fluid per Ford specification.',
    serviceNotes: ['Clutch condition, TCM status and adaptive strategy are central to diagnosis.', 'Do not diagnose shudder like a normal torque-converter automatic.'],
    commonFailures: ['Clutch shudder', 'TCM faults', 'Input shaft seal leaks', 'Fork motor/actuator issues'],
    relatedCodes: ['P0700', 'P0902', 'P2831', 'P2872'],
  },
  {
    slug: 'aisin-tf-80',
    maker: 'Aisin',
    family: 'TF-80 / AF40',
    type: 'Torque-converter automatic',
    gears: '6-speed',
    applications: ['Volvo', 'Saab', 'Opel/Vauxhall', 'Peugeot', 'Citroen'],
    fluid: 'JWS 3309 or OEM-specified fluid depending on variant.',
    serviceNotes: ['Fluid condition and correct specification are important.', 'Valve body wear can mimic solenoid faults.'],
    commonFailures: ['Shift flare', 'Valve body wear', 'Harsh engagement', 'Torque converter lockup issues'],
    relatedCodes: ['P0700', 'P0730', 'P0741', 'P0776'],
  },
  {
    slug: 'jatco-cvt7',
    maker: 'Jatco',
    family: 'CVT7/CVT8 family',
    type: 'Continuously variable transmission',
    gears: 'CVT',
    applications: ['Nissan', 'Mitsubishi', 'Renault alliance vehicles'],
    fluid: 'NS-2, NS-3 or exact OEM CVT fluid by transmission code.',
    serviceNotes: ['Use only correct CVT fluid.', 'Overheating and fluid degradation are major reliability factors.'],
    commonFailures: ['Belt/chain slip', 'Valve body faults', 'Step motor issues', 'Overheat protection/limp mode'],
    relatedCodes: ['P0700', 'P0746', 'P0776', 'P0841'],
  },
];

export function getTransmissionProfile(slug: string) {
  return transmissionProfiles.find(transmission => transmission.slug === slug) || null;
}
