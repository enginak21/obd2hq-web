type TrustPageKind = 'privacy' | 'terms' | 'disclaimer' | 'about' | 'reviewers';

type TrustCopy = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

const trustCopy: Record<TrustPageKind, Record<string, TrustCopy>> = {
  privacy: {
    en: {
      heading: 'How privacy works across diagnostic tools',
      paragraphs: [
        'OBD2HQ is designed so most diagnostic tasks can be completed without an account. A driver can read an OBD2 code, compare symptoms, open a warning-light guide or use a calculator without submitting a VIN, plate number, phone number or address.',
        'When anonymous analytics or diagnostic search logs are used, the purpose is editorial quality: finding broken journeys, improving unclear pages, detecting missing symptom language and understanding which vehicle guides need better first-check information.',
      ],
      bullets: ['Do not include VIN, license plate or personal contact details in public diagnostic messages.', 'Search data is reviewed in aggregate so weak guides can be improved.', 'Advertising and analytics partners may use cookies according to their own privacy controls.'],
    },
  },
  terms: {
    en: {
      heading: 'Using diagnostic information responsibly',
      paragraphs: [
        'OBD2HQ content is educational. It helps you understand likely systems, safe first checks, common mistakes and related codes, but it does not create a repair contract or replace a qualified inspection of your specific vehicle.',
        'Vehicle configuration, market, engine option, previous repairs and software calibration can change the correct procedure. Always verify critical service information before ordering parts or making safety-related repair decisions.',
      ],
      bullets: ['Use guides as a diagnostic starting point, not as a guaranteed repair result.', 'Do not ignore urgent warnings for brakes, steering, overheating, oil pressure, smoke or fuel smell.', 'Do not reproduce OBD2HQ datasets or pages without attribution and permission where required.'],
    },
  },
  disclaimer: {
    en: {
      heading: 'Safety boundaries for every guide',
      paragraphs: [
        'A fault code only tells you which system failed a monitor test. It does not automatically prove that one part is bad. A good diagnostic process checks power, ground, wiring, connector condition, live data and related symptoms before replacement.',
        'Some vehicle faults can become dangerous quickly. If a warning light is red, flashing, accompanied by smoke, severe noise, brake loss, steering change, overheating or oil pressure warning, stop safely and seek professional help.',
      ],
      bullets: ['Disconnecting parts, probing circuits or driving with active faults can create additional risk.', 'Repair costs and likely causes are estimates unless verified against your vehicle and market.', 'OBD2HQ avoids certainty language when a fault requires physical testing.'],
    },
  },
  about: {
    en: {
      heading: 'What OBD2HQ is building',
      paragraphs: [
        'OBD2HQ is being built as a multilingual diagnostic hub that connects OBD2 codes, vehicle symptoms, dashboard warning lights, maintenance context, engine data and practical first checks in one place.',
        'The product focus is simple: a non-technical driver should be able to describe a problem in plain language, while a more technical user can still move into code-specific testing, freeze-frame interpretation and related system checks.',
      ],
      bullets: ['Code pages explain meaning, symptoms, causes and test-before-replace logic.', 'Vehicle pages connect model context, warning lights, maintenance data and common problems.', 'Editorial quality checks are used to reduce duplicated, thin or unsupported content.'],
    },
  },
  reviewers: {
    en: {
      heading: 'How editorial review is handled',
      paragraphs: [
        'OBD2HQ uses an editorial team model instead of invented individual mechanic profiles. Pages are checked for diagnostic usefulness, unsafe certainty language, duplicate risk, missing first checks and unsupported precision before they are treated as high-quality reference pages.',
        'The review process favors practical information gain: what a driver should notice, what a technician should test first, what parts should not be replaced too early, and which related codes change the diagnostic direction.',
      ],
      bullets: ['No fake certifications or fictional expert biographies are used.', 'Priority DTC pages are upgraded only when they contain code-specific diagnostic value.', 'Vehicle-specific claims are separated from general OBD2 guidance when the data is not verified.'],
    },
  },
};

function getCopy(kind: TrustPageKind, locale: string) {
  return trustCopy[kind][locale] || trustCopy[kind].en;
}

export default function TrustPageContent({ kind, locale }: { kind: TrustPageKind; locale: string }) {
  const copy = getCopy(kind, locale);

  return (
    <section className="mt-10 rounded-3xl border border-white/5 bg-[#101827] p-6">
      <h2 className="text-2xl font-bold text-white">{copy.heading}</h2>
      <div className="mt-4 space-y-4 text-slate-300 leading-7">
        {copy.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <ul className="mt-5 space-y-3">
        {copy.bullets.map(item => (
          <li key={item} className="rounded-2xl bg-white/[0.04] px-4 py-3 text-sm leading-6 text-slate-300">{item}</li>
        ))}
      </ul>
    </section>
  );
}
