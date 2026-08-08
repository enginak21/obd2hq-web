export type TopClickVehicleFocus = {
  query: string;
  targetPath: string;
  title: string;
  answer: string;
  firstChecks: string[];
  avoid: string;
  links: Array<{ href: string; label: string }>;
};

export type TopClickNewsFocus = {
  query: string;
  title: string;
  answer: string;
  followUps: string[];
};

const VEHICLE_FOCUS: Record<string, TopClickVehicleFocus> = {
  'suzuki/jimny/P0234': {
    query: 'p0234 suzuki',
    targetPath: '/en/suzuki/jimny/p0234',
    title: 'Quick answer for P0234 Suzuki searches',
    answer: 'On a Suzuki Jimny, P0234 usually means the engine computer saw boost pressure higher than expected. Treat it as a boost-control system diagnosis: wastegate control, boost solenoid command, pressure hoses, MAP/boost sensor data, and wiring should be checked before blaming the turbocharger.',
    firstChecks: [
      'Compare MAP/boost pressure key-on engine-off, at idle, and during a controlled load test.',
      'Inspect wastegate actuator movement, vacuum/pressure hoses, and boost-control solenoid plumbing.',
      'Check the boost/MAP sensor connector, 5V reference, ground, and signal wire for corrosion or intermittent dropouts.',
      'Look for related underboost or sensor codes such as P0235 and P0299 before replacing parts.',
    ],
    avoid: 'Do not replace the turbocharger first. A stuck wastegate, hose routing issue, boost solenoid fault, or sensor signal problem can trigger the same search complaint.',
    links: [
      { href: '/en/codes/p0234', label: 'P0234 code hub' },
      { href: '/en/suzuki/jimny/p0235', label: 'Suzuki Jimny P0235' },
      { href: '/en/codes/p0299', label: 'P0299 underboost code' },
      { href: '/en/suzuki/jimny/lights', label: 'Suzuki Jimny warning lights' },
    ],
  },
  'ford/fiesta/P0216': {
    query: 'p0216 ford',
    targetPath: '/en/ford/fiesta/p0216',
    title: 'Quick answer for P0216 Ford searches',
    answer: 'For Ford vehicles, P0216 points toward injection timing or fuel delivery control being outside the expected range. On a Fiesta, verify fuel pressure, crank/cam timing signals, pump control data, and wiring before assuming the injection pump or PCM is bad.',
    firstChecks: [
      'Save freeze-frame data to see RPM, load, fuel pressure, and temperature when P0216 set.',
      'Check battery voltage, grounds, fuses, and fuel pump/injection control wiring.',
      'Compare crankshaft and camshaft synchronization data with the scan tool.',
      'Inspect fuel supply restriction, filter condition, and pressure behavior under load.',
    ],
    avoid: 'Do not jump straight to an injection pump, timing component, or PCM replacement without confirming fuel pressure, timing sync, and circuit integrity.',
    links: [
      { href: '/en/codes/p0216', label: 'P0216 code hub' },
      { href: '/en/ford/focus/p0213', label: 'Ford Focus P0213' },
      { href: '/en/ford/f-150/p0251', label: 'Ford P0251' },
      { href: '/en/ford/warning-lights', label: 'Ford warning lights' },
    ],
  },
  'suzuki/jimny/P0203': {
    query: 'p0203 suzuki',
    targetPath: '/en/suzuki/jimny/p0203',
    title: 'Quick answer for P0203 Suzuki searches',
    answer: 'P0203 Suzuki searches are usually looking for cylinder 3 injector circuit help. On a Jimny, prove the injector circuit electrically: resistance, power feed, injector pulse, connector tension, and harness movement matter more than replacing the injector immediately.',
    firstChecks: [
      'Compare cylinder 3 injector resistance with the other injectors.',
      'Use a noid light or scope to confirm injector pulse on cylinder 3.',
      'Inspect the cylinder 3 connector for loose pins, corrosion, oil contamination, or broken lock tabs.',
      'Wiggle-test the harness while watching misfire counts or injector command data.',
    ],
    avoid: 'Do not replace the injector until the circuit has power, ground/driver command, correct resistance, and no harness fault.',
    links: [
      { href: '/en/codes/p0203', label: 'P0203 code hub' },
      { href: '/en/suzuki/jimny/p0201', label: 'Suzuki Jimny P0201' },
      { href: '/en/suzuki/jimny/p0204', label: 'Suzuki Jimny P0204' },
      { href: '/en/suzuki/jimny/lights', label: 'Suzuki Jimny warning lights' },
    ],
  },
  'ford/focus/P0103': {
    query: 'p0103 ford focus',
    targetPath: '/en/ford/focus/p0103',
    title: 'Quick answer for P0103 Ford Focus searches',
    answer: 'On a Ford Focus, P0103 means the MAF signal is reading higher than expected. Check intake ducting, MAF sensor contamination, signal voltage, ground quality, and fuel trims before replacing the MAF sensor.',
    firstChecks: [
      'Inspect the air intake duct after the MAF for leaks, loose clamps, or aftermarket turbulence.',
      'Compare MAF grams/second at idle and 2500 RPM against realistic values.',
      'Check MAF power, ground, and signal voltage while gently moving the harness.',
      'Review short-term and long-term fuel trims to see whether the PCM is compensating for false airflow.',
    ],
    avoid: 'Do not replace the MAF sensor until intake leaks, dirty sensing element, wiring, and fuel-trim behavior have been verified.',
    links: [
      { href: '/en/codes/p0103', label: 'P0103 code hub' },
      { href: '/en/codes/p0101', label: 'P0101 MAF performance code' },
      { href: '/en/codes/p0102', label: 'P0102 MAF low input code' },
      { href: '/en/ford/focus/lights', label: 'Ford Focus warning lights' },
    ],
  },
};

const NEWS_FOCUS: Record<string, TopClickNewsFocus> = {
  'the-grand-tour-returns-in-september-with-three-new': {
    query: 'throttle house grand tour',
    title: 'Why people are searching “Throttle House Grand Tour”',
    answer: 'This story answers the search intent behind Throttle House Grand Tour: Thomas Holland and James Engelsman are being discussed as the new faces tied to The Grand Tour’s next chapter after the Clarkson, Hammond, and May era.',
    followUps: [
      'Who from Throttle House is connected to The Grand Tour?',
      'What changes after Clarkson, Hammond, and May?',
      'Why this matters for modern car media and enthusiast audiences.',
    ],
  },
};

export function getTopClickVehicleFocus(locale: string, make: string, model: string, code: string) {
  if (locale !== 'en') return null;
  return VEHICLE_FOCUS[`${make}/${model}/${code.toUpperCase()}`] || null;
}

export function getTopClickNewsFocus(locale: string, slug: string) {
  if (locale !== 'en') return null;
  return NEWS_FOCUS[slug] || null;
}

export function getTopClickTargets() {
  return Object.values(VEHICLE_FOCUS).map(item => item.targetPath);
}
