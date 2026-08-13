import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronLeft, Share2 } from 'lucide-react';
import { getAllNews, getNewsBySlug, getNewsCategoryKey, getNewsRedirectSlug } from '@/data/news';
import { getLocalized } from '@/data/db';
import { fitSeoDescription, fitSeoTitle, getAlternates } from '@/utils/seo';
import { getTopClickNewsFocus } from '@/data/top-click-seo';

function asString(value: string | string[] | null, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export async function generateStaticParams() {
  const news = getAllNews();
  const locales = ['en', 'de', 'es', 'tr', 'fr'];
  return news.flatMap(article => locales.map(locale => ({ locale, slug: article.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    const redirectSlug = getNewsRedirectSlug(slug);
    if (redirectSlug) permanentRedirect(`/${locale}/news/${redirectSlug}`);
    notFound();
  }

  const title = asString(getLocalized(article.title, locale), article.slug);
  const description = asString(getLocalized(article.summary, locale));
  const topClickFocus = getTopClickNewsFocus(locale, slug);
  const metaTitle = fitSeoTitle(topClickFocus ? `${topClickFocus.query}: ${title}` : `${title} - OBD2HQ News`);
  const metaDescription = fitSeoDescription(topClickFocus ? `${topClickFocus.answer} Latest context, owner impact and diagnostic relevance.` : description);

  return {
    title: metaTitle,
    description: metaDescription,
    robots: {
      index: true,
      follow: true,
    },
    alternates: getAlternates(`news/${slug}`, locale),
    openGraph: {
      title,
      description: metaDescription,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'NewsPage' });
  const article = getNewsBySlug(slug);

  if (!article) {
    const redirectSlug = getNewsRedirectSlug(slug);
    if (redirectSlug) permanentRedirect(`/${locale}/news/${redirectSlug}`);
    notFound();
  }

  const locTitle = asString(getLocalized(article.title, locale), article.slug);
  const categoryKey = getNewsCategoryKey(article.category);
  const topClickFocus = getTopClickNewsFocus(locale, slug);
  const dateObj = new Date(article.date);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
  const articleSummary = asString(getLocalized(article.summary, locale));

  const overviewHeading = locale === 'tr' ? 'Haberin özeti' : locale === 'de' ? 'Kurzübersicht' : locale === 'es' ? 'Resumen de la noticia' : locale === 'fr' ? 'Résumé de l’article' : 'Article summary';
  const contextHeading = locale === 'tr' ? 'OBD2HQ notu' : locale === 'de' ? 'OBD2HQ-Einordnung' : locale === 'es' ? 'Nota de OBD2HQ' : locale === 'fr' ? 'Note OBD2HQ' : 'OBD2HQ context';
  const ownerImpactHeading = locale === 'tr' ? 'Araç sahibi için anlamı' : locale === 'de' ? 'Bedeutung für Fahrzeughalter' : locale === 'es' ? 'Qué significa para el propietario' : locale === 'fr' ? 'Ce que cela change pour le propriétaire' : 'What this means for owners';
  const diagnosticImpactHeading = locale === 'tr' ? 'Teşhis açısından neden önemli?' : locale === 'de' ? 'Warum es für die Diagnose wichtig ist' : locale === 'es' ? 'Por qué importa para el diagnóstico' : locale === 'fr' ? 'Pourquoi c’est important pour le diagnostic' : 'Why it matters for diagnostics';
  const relatedHeading = locale === 'tr' ? 'Takip edilmesi gereken noktalar' : locale === 'de' ? 'Worauf Sie achten sollten' : locale === 'es' ? 'Puntos a seguir' : locale === 'fr' ? 'Points à surveiller' : 'What to watch next';

  const contextText = locale === 'tr'
    ? 'Bu aktif haber sayfası kalite kontrolünden geçmiş kısa otomotiv bağlamı sunar. OBD2HQ haberleri araç sahipleri için teşhis, servis erişimi, tamir hakkı ve araç teknolojisi etkileriyle birlikte değerlendirir.'
    : locale === 'de'
      ? 'Diese aktive Nachrichtenseite hat die Qualitätsprüfung bestanden. OBD2HQ ordnet Nachrichten für Fahrzeughalter mit Blick auf Diagnose, Servicezugang, Reparaturrecht und Fahrzeugtechnik ein.'
      : locale === 'es'
        ? 'Esta noticia activa ha pasado el control de calidad. OBD2HQ la resume para propietarios con contexto sobre diagnóstico, acceso al servicio, derecho a reparar y tecnología del vehículo.'
        : locale === 'fr'
          ? 'Cette actualité active a passé le contrôle qualité. OBD2HQ la présente avec un contexte utile pour le diagnostic, l’accès au service, le droit à la réparation et la technologie automobile.'
          : 'This active news page has passed the quality gate. OBD2HQ frames each story around diagnostics, service access, right-to-repair impact and vehicle technology context for owners.';
  const ownerImpact = locale === 'tr'
    ? 'Bu gelişme doğrudan bir arıza kodunu açıklamasa bile, aracın nasıl teşhis edildiğini ve servis bilgisinin kimler tarafından erişilebilir olduğunu etkileyebilir. Kullanıcı açısından önemli nokta, bir arıza lambası yandığında yalnızca parça değişimi önerisine değil; tarama verisi, servis dokümanı, yazılım erişimi ve bağımsız tamir seçeneğine birlikte bakabilmektir.'
    : locale === 'de'
      ? 'Auch wenn diese Meldung keinen einzelnen Fehlercode erklärt, kann sie beeinflussen, wie Fahrzeuge diagnostiziert werden und wer Zugriff auf Servicedaten erhält. Für Halter zählt, dass Warnleuchten nicht nur mit Teiletausch beantwortet werden, sondern mit Scan-Daten, Servicedokumenten, Softwarezugang und unabhängigen Reparaturmöglichkeiten.'
      : locale === 'es'
        ? 'Aunque esta noticia no explica un código concreto, puede influir en cómo se diagnostican los vehículos y quién accede a la información de servicio. Para el propietario, lo importante es no quedarse solo con cambiar piezas: también cuentan los datos del escáner, documentación, acceso de software y opciones de reparación independiente.'
        : locale === 'fr'
          ? 'Même si cette actualité ne décrit pas un code défaut précis, elle peut modifier la manière dont les véhicules sont diagnostiqués et qui accède aux données de service. Pour l’utilisateur, l’enjeu est de ne pas réduire un voyant à un simple remplacement de pièce, mais de tenir compte du scan, des données techniques et de l’accès réparation.'
          : 'Even when a story does not explain one specific trouble code, it can affect how vehicles are diagnosed and who can access service information. For owners, the practical point is not to treat a warning light as a simple parts-replacement prompt; scan data, service documentation, software access and independent repair options all matter.';
  const diagnosticImpact = locale === 'tr'
    ? 'OBD2HQ bu tür haberleri arıza rehberlerinden ayrı tutar, fakat bağlantı noktası nettir: daha iyi veri erişimi, daha doğru teşhis sırası ve gereksiz parça değişiminin azalması. Bir haber düzenleme, standart veya servis erişimiyle ilgiliyse; etkisini araç sahibi diliyle, güvenli sürüş kararı ve ilk kontrol mantığı üzerinden açıklarız.'
    : locale === 'de'
      ? 'OBD2HQ trennt Nachrichten von Fehlercode-Anleitungen, verbindet sie aber über einen klaren Punkt: besserer Datenzugang kann präzisere Diagnose und weniger unnötigen Teiletausch ermöglichen. Bei Regeln, Standards oder Servicezugang erklären wir den Effekt in verständlicher Sprache und mit Blick auf sichere Entscheidungen.'
      : locale === 'es'
        ? 'OBD2HQ separa las noticias de las guías de códigos, pero el vínculo es claro: mejor acceso a datos puede mejorar la secuencia de diagnóstico y reducir reemplazos innecesarios. Si una noticia trata normas o acceso al servicio, explicamos su impacto con lenguaje práctico para propietarios.'
        : locale === 'fr'
          ? 'OBD2HQ sépare l’actualité des guides de codes défaut, mais le lien est clair : un meilleur accès aux données peut améliorer le diagnostic et limiter les remplacements inutiles. Quand une règle ou un standard concerne l’accès service, nous expliquons l’impact en langage utile pour les conducteurs.'
          : 'OBD2HQ keeps news separate from code guides, but the connection is clear: better data access can improve diagnostic order and reduce unnecessary parts replacement. When a regulation, standard or service-access topic matters, we explain its effect in owner-friendly language tied to safe decisions and first checks.';
  const watchItems = locale === 'tr'
    ? ['Resmi düzenlemenin yürürlüğe giriş tarihi ve hangi araçları kapsadığı', 'Bağımsız servislerin gerçek teşhis verisine erişim koşulları', 'Araç sahipleri için garanti, servis ve tamir maliyeti etkileri']
    : locale === 'de'
      ? ['Zeitpunkt des Inkrafttretens und betroffene Fahrzeuge', 'Bedingungen für unabhängige Werkstätten beim Zugriff auf Diagnosedaten', 'Auswirkungen auf Garantie, Service und Reparaturkosten']
      : locale === 'es'
        ? ['Fecha de aplicación y vehículos incluidos', 'Condiciones de acceso a datos para talleres independientes', 'Impacto en garantía, servicio y coste de reparación']
        : locale === 'fr'
          ? ['Date d’application et véhicules concernés', 'Conditions d’accès aux données pour les réparateurs indépendants', 'Impact sur garantie, entretien et coût de réparation']
          : ['Effective date and vehicles covered by the change', 'Access conditions for independent repairers and diagnostic data', 'Impact on warranty, service choices and repair cost'];

  const newsSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: locTitle,
    image: [article.image],
    datePublished: article.date,
    dateModified: article.date,
    author: [{
      '@type': 'Organization',
      name: 'OBD2HQ Editorial Desk',
      url: 'https://www.obd2hq.com',
    }],
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }} />

      <div className="relative h-[50vh] min-h-[400px] w-full bg-[#0d1425] overflow-hidden">
        <Image
          src={article.image}
          alt={locTitle}
          fill
          priority
          unoptimized={!article.image.startsWith('http')}
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/50 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <Link href={`/${locale}/news`} className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mb-6 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 backdrop-blur-md">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('backToNews')}
            </Link>

            <div className="flex items-center space-x-4 mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                {t(`categories.${categoryKey}`)}
              </span>
              <span className="flex items-center text-slate-300 text-sm font-medium">
                <Calendar className="w-4 h-4 mr-1.5 opacity-70" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {locTitle}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <article className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 lg:p-12 shadow-2xl relative">
          <div className="absolute top-8 right-8">
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all border border-white/5" aria-label="Share">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-p:font-light prose-p:leading-relaxed prose-headings:text-white prose-a:text-blue-400">
            <h2>{overviewHeading}</h2>
            <p>{articleSummary}</p>
            <h2>{contextHeading}</h2>
            <p>{contextText}</p>
            <h2>{ownerImpactHeading}</h2>
            <p>{ownerImpact}</p>
            <h2>{diagnosticImpactHeading}</h2>
            <p>{diagnosticImpact}</p>
            <h2>{relatedHeading}</h2>
            <ul>
              {watchItems.map(item => <li key={item}>{item}</li>)}
            </ul>
            {topClickFocus && (
              <>
                <h2>{topClickFocus.title}</h2>
                <p>{topClickFocus.answer}</p>
                <ul>
                  {topClickFocus.followUps.map(item => <li key={item}>{item}</li>)}
                </ul>
              </>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
