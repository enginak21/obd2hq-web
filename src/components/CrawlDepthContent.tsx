type CrawlDepthKind = 'maintenance' | 'vehicles' | 'tools' | 'resources' | 'transmissions' | 'contact' | 'terms';

const copy: Record<CrawlDepthKind, { title: string; paragraphs: string[]; bullets: string[] }> = {
  maintenance: {
    title: 'How this maintenance data should be used',
    paragraphs: [
      'Use the maintenance hub together with the fault-code and symptom pages. A delayed oil service, blocked filter, worn spark plug, weak coolant mix or overdue transmission fluid can change live data before a part fails completely.',
      'Start by matching the vehicle profile, then compare recent service history with the symptoms you see. This avoids replacing sensors when the real cause is a basic service item, fluid condition or a missed inspection point.',
    ],
    bullets: ['Check service records before ordering parts.', 'Compare maintenance items with the active OBD2 code.', 'Treat brake, steering, overheating and oil-pressure warnings as urgent.'],
  },
  vehicles: {
    title: 'Vehicle profile verification checklist',
    paragraphs: [
      'Vehicle specifications can change by market, engine family, trim and production date. Use the selector to narrow the profile, then confirm the engine code, fluid type and capacity against the service label, registration data or a VIN-based parts catalog.',
      'The strongest vehicle profile is not only a list of numbers. It should help you connect engine code, oil capacity, common failure patterns, warning lights and related OBD2 codes so the first repair decision is based on context.',
    ],
    bullets: ['Confirm make, model, year and generation first.', 'Use engine code before choosing oil or ignition parts.', 'Open related codes when symptoms and scan data point to the same system.'],
  },
  tools: {
    title: 'Choosing the right diagnostic workflow',
    paragraphs: [
      'A scan tool is useful only when the result leads to a clear next step. Use the basic code lookup for a known DTC, the problem finder when the driver only knows the symptom, and calculators when cost or severity needs a quick estimate.',
      'For better accuracy, keep freeze-frame data, compare live values at idle and under load, and verify wiring or fluid condition before replacing a component. The tools are built to reduce guessing, not to skip testing.',
    ],
    bullets: ['Start with the symptom if no code is known.', 'Save freeze-frame data before clearing codes.', 'Use cost and severity tools after the first checks are complete.'],
  },
  resources: {
    title: 'Resource quality and attribution',
    paragraphs: [
      'The resource area is intended for legitimate reference use: datasets, checklists, widgets and diagnostic links that help communities explain OBD2 codes more clearly. Each asset should point users back to the full guide when a repair decision needs more context.',
      'Do not use these assets for scraped copies or low-value duplicate pages. Clean attribution and useful editorial context are important because the data is educational and should stay connected to safety notes, first checks and related code paths.',
    ],
    bullets: ['Link to the original guide when publishing data.', 'Keep warning-light and checklist context intact.', 'Avoid copying datasets into thin pages with no added value.'],
  },
  transmissions: {
    title: 'Transmission checks before replacement',
    paragraphs: [
      'Transmission symptoms are often affected by fluid condition, temperature, electrical faults and software behavior. A harsh shift or slip does not always mean the transmission is mechanically failed, especially when related sensor or solenoid codes are present.',
      'Identify the transmission family first, then check fluid type, level procedure, service history, leak evidence, live data and related DTCs. This helps separate maintenance issues from control circuit, speed sensor or internal pressure faults.',
    ],
    bullets: ['Verify exact transmission family before buying fluid.', 'Check leaks and temperature before judging shift quality.', 'Use related P07xx codes to guide electrical tests.'],
  },
  contact: {
    title: 'Before sending a report',
    paragraphs: [
      'The fastest way to improve a page is to describe the exact guide, vehicle, code or warning light that needs correction. Short reports with a URL, symptom, market and source note are easier to review than general messages.',
      'Please remove private details from screenshots or scan reports. OBD2HQ does not need VIN, plate, address or phone information to improve public diagnostic content.',
    ],
    bullets: ['Include the page URL when reporting an issue.', 'Describe what looked wrong or missing.', 'Remove personal information from attachments.'],
  },
  terms: {
    title: 'Important diagnostic limits',
    paragraphs: [
      'OBD2HQ pages are educational guides. They can help you understand likely systems, first checks and related codes, but they cannot inspect wiring, fluid condition, mechanical wear or previous repairs on a specific vehicle.',
      'Use the information as a structured starting point. Safety-related symptoms such as brake loss, steering change, overheating, smoke, fuel smell or oil-pressure warnings require immediate local inspection.',
    ],
    bullets: ['Do not treat a code as a guaranteed failed part.', 'Confirm critical service information before repairs.', 'Use a qualified professional for safety-critical faults.'],
  },
};

export default function CrawlDepthContent({ kind }: { kind: CrawlDepthKind }) {
  const item = copy[kind];
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="rounded-3xl border border-white/5 bg-[#101827] p-6">
        <h2 className="text-2xl font-black text-white">{item.title}</h2>
        <div className="mt-4 grid gap-4 text-slate-300 md:grid-cols-2">
          {item.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-7">{paragraph}</p>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {item.bullets.map((bullet) => (
            <p key={bullet} className="rounded-2xl bg-white/[0.04] p-4 text-sm font-semibold leading-6 text-slate-300">{bullet}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
