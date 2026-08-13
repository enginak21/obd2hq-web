import { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import CrawlDepthContent from '@/components/CrawlDepthContent';

const contactGuides: Record<string, { title: string; text: string; items: string[]; note: string }> = {
  en: {
    title: 'What to include in a diagnostic message',
    text: 'OBD2HQ reviews editorial corrections, broken links, missing vehicle context and data quality reports. For personal vehicle safety or repair decisions, describe the issue clearly without sharing private information. A useful message helps the editorial team improve a guide, connect the right OBD2 code, or update a vehicle-specific note.',
    items: ['Vehicle make, model, year, market and engine if known.', 'Fault codes, warning lights, symptoms, weather, speed and when the issue appears.', 'Photos or scan data with VIN, plate, phone, address and personal details removed.'],
    note: 'OBD2HQ does not replace an in-person inspection. Urgent brake, steering, overheating, fuel smell, smoke or oil pressure issues should be handled by a qualified repair professional immediately.',
  },
  tr: {
    title: 'Teşhis mesajında neler olmalı?',
    text: 'OBD2HQ; editoryal düzeltme, kırık bağlantı, eksik araç bağlamı ve veri kalite bildirimlerini inceleyebilir. Kişisel güvenlik veya onarım kararı için özel veri paylaşmadan sorunu açıkça anlatın. İyi hazırlanmış bir mesaj, ilgili rehberin güçlenmesine, doğru OBD2 koduyla bağlanmasına veya araç özel notun güncellenmesine yardımcı olur.',
    items: ['Biliniyorsa marka, model, yıl, pazar ve motor bilgisi.', 'Arıza kodları, uyarı ışıkları, belirtiler, hava durumu, hız ve sorunun ne zaman ortaya çıktığı.', 'VIN, plaka, telefon, adres ve kişisel bilgiler silinmiş fotoğraf veya tarama verisi.'],
    note: 'OBD2HQ yüz yüze araç kontrolünün yerine geçmez. Fren, direksiyon, hararet, yakıt kokusu, yoğun duman veya yağ basıncı gibi acil konular gecikmeden yetkili bir onarım uzmanına gösterilmelidir.',
  },
  de: {
    title: 'Was in eine Diagnose-Nachricht gehört',
    text: 'OBD2HQ prüft redaktionelle Korrekturen, defekte Links, fehlenden Fahrzeugkontext und Hinweise zur Datenqualität. Beschreiben Sie das Problem klar, ohne private Daten zu teilen. Eine gute Nachricht hilft, einen Leitfaden zu verbessern, den passenden OBD2-Code zu verknüpfen oder fahrzeugspezifische Hinweise zu aktualisieren.',
    items: ['Marke, Modell, Baujahr, Markt und Motor, falls bekannt.', 'Fehlercodes, Warnleuchten, Symptome, Wetter, Geschwindigkeit und Auftreten.', 'Fotos oder Scandaten ohne VIN, Kennzeichen, Telefon, Adresse oder persönliche Details.'],
    note: 'OBD2HQ ersetzt keine Prüfung am Fahrzeug. Bremsen, Lenkung, Überhitzung, Kraftstoffgeruch, starker Rauch oder Öldruckwarnungen sollten sofort von Fachpersonal geprüft werden.',
  },
  es: {
    title: 'Qué incluir en un mensaje de diagnóstico',
    text: 'OBD2HQ revisa correcciones editoriales, enlaces rotos, contexto de vehículo faltante y avisos de calidad de datos. Describe el problema con claridad sin compartir información privada. Un buen mensaje ayuda a mejorar una guía, enlazar el código OBD2 correcto o actualizar una nota específica del vehículo.',
    items: ['Marca, modelo, año, mercado y motor si lo sabes.', 'Códigos, luces, síntomas, clima, velocidad y cuándo aparece el problema.', 'Fotos o datos de escáner sin VIN, matrícula, teléfono, dirección ni datos personales.'],
    note: 'OBD2HQ no sustituye una inspección presencial. Problemas de frenos, dirección, sobrecalentamiento, olor a combustible, humo intenso o presión de aceite deben revisarse de inmediato por un profesional.',
  },
  fr: {
    title: 'Que mettre dans un message diagnostic',
    text: 'OBD2HQ examine les corrections éditoriales, liens cassés, contextes véhicule manquants et rapports de qualité des données. Décrivez clairement le problème sans partager de données privées. Un message utile aide à améliorer un guide, relier le bon code OBD2 ou mettre à jour une note spécifique au véhicule.',
    items: ['Marque, modèle, année, marché et moteur si connus.', 'Codes défaut, voyants, symptômes, météo, vitesse et moment d’apparition.', 'Photos ou données de scan sans VIN, plaque, téléphone, adresse ni détails personnels.'],
    note: 'OBD2HQ ne remplace pas une inspection sur place. Freins, direction, surchauffe, odeur de carburant, fumée importante ou pression d’huile doivent être vérifiés immédiatement par un professionnel.',
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
          <p className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">{guide.note}</p>
        </section>
      </div>
      <CrawlDepthContent kind="contact" />
    </main>
  );
}
