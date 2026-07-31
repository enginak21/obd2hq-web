import { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';

const contactGuides: Record<string, { title: string; text: string; items: string[] }> = {
  en: {
    title: 'What to include in a diagnostic message',
    text: 'OBD2HQ can review editorial corrections, broken links, missing vehicle context and data quality reports. For personal vehicle safety or repair decisions, include enough information for the issue to be understood without sharing private data.',
    items: ['Vehicle make, model, year and engine if known.', 'Fault codes, warning lights, symptoms and when they happen.', 'Photos or scan data with VIN, plate, phone and address removed.'],
  },
  tr: {
    title: 'Teşhis mesajında neler olmalı?',
    text: 'OBD2HQ; editoryal düzeltme, kırık bağlantı, eksik araç bağlamı ve veri kalite bildirimlerini inceleyebilir. Kişisel güvenlik veya onarım kararı için özel veri paylaşmadan sorunu anlaşılır hale getiren bilgileri ekleyin.',
    items: ['Biliniyorsa marka, model, yıl ve motor bilgisi.', 'Arıza kodları, uyarı ışıkları, belirtiler ve ne zaman ortaya çıktığı.', 'VIN, plaka, telefon ve adres silinmiş fotoğraf veya tarama verisi.'],
  },
  de: {
    title: 'Was in eine Diagnose-Nachricht gehört',
    text: 'OBD2HQ kann redaktionelle Korrekturen, defekte Links, fehlenden Fahrzeugkontext und Datenqualität prüfen. Teilen Sie keine privaten Daten, aber beschreiben Sie das Problem nachvollziehbar.',
    items: ['Marke, Modell, Baujahr und Motor, falls bekannt.', 'Fehlercodes, Warnleuchten, Symptome und Auftreten.', 'Fotos oder Scandaten ohne VIN, Kennzeichen, Telefon oder Adresse.'],
  },
  es: {
    title: 'Qué incluir en un mensaje de diagnóstico',
    text: 'OBD2HQ puede revisar correcciones editoriales, enlaces rotos, contexto de vehículo faltante y calidad de datos. No compartas datos privados, pero describe el problema con claridad.',
    items: ['Marca, modelo, año y motor si lo sabes.', 'Códigos, luces, síntomas y cuándo aparecen.', 'Fotos o datos de escáner sin VIN, matrícula, teléfono ni dirección.'],
  },
  fr: {
    title: 'Que mettre dans un message diagnostic',
    text: 'OBD2HQ peut examiner corrections éditoriales, liens cassés, contexte véhicule manquant et qualité des données. Ne partagez pas de données privées, mais décrivez clairement le problème.',
    items: ['Marque, modèle, année et moteur si connus.', 'Codes défaut, voyants, symptômes et moment d’apparition.', 'Photos ou données de scan sans VIN, plaque, téléphone ni adresse.'],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: getAlternates('contact', locale),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  const guide = contactGuides[locale] || contactGuides.en;

  return (
    <main className="min-h-[80vh] bg-[#0a0f1c] text-slate-200 font-sans p-6 md:p-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">{t('title')}</h1>
        <p className="text-slate-400 text-center mb-12">
          {t('subtitle')}
        </p>

        <div className="bg-[#131b2f] border border-white/5 p-8 rounded-3xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-500/10 p-4 rounded-full">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{t('emailUs')}</h2>
              <p className="text-slate-400">support@obd2hq.com</p>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t('name')}</label>
              <input type="text" className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder={t('namePlaceholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t('email')}</label>
              <input type="email" className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder={t('emailPlaceholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t('message')}</label>
              <textarea rows={5} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder={t('messagePlaceholder')}></textarea>
            </div>
            <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              {t('send')}
            </button>
          </form>
        </div>
        <section className="mt-8 rounded-3xl border border-white/5 bg-[#101827] p-8">
          <h2 className="text-2xl font-black text-white">{guide.title}</h2>
          <p className="mt-4 text-slate-300 leading-7">{guide.text}</p>
          <ul className="mt-5 space-y-3">
            {guide.items.map(item => (
              <li key={item} className="rounded-2xl bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
