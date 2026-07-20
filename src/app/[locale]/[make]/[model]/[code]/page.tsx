import { notFound } from 'next/navigation';
import { cars, getHybridObdData, baseCodes, getLocalized } from '@/data/db';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import DisqusComments from '@/components/DisqusComments';
import AdSlot from '@/components/AdSlot';
import { fitSeoDescription, fitSeoTitle, getAlternates } from '@/utils/seo';
import { SEO_LAST_REVIEWED, getClusterLinks, getCodePageCopy, getFallbackDiagnosticSteps, getLocalizedSystemContent, getModelSpecificInsight, getRelatedCodes, getRepairTiers } from '@/data/seo';
import { getLocalizedCodeDescription, getLocalizedCodeTitle } from '@/data/code-localization';
import { ShieldCheck, AlertTriangle, AlertCircle, Wrench, Search, Clock, BadgeCheck } from 'lucide-react';

interface PageProps {
  params: Promise<{
    locale: string;
    make: string;
    model: string;
    code: string;
  }>;
}

function asString(value: string | string[] | null, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asStringArray(value: string | string[] | null) {
  return Array.isArray(value) ? value : null;
}

function getCodeMetaDescription(locale: string, code: string, make: string, model: string) {
  if (locale === 'tr') return `${make} ${model} ${code} arıza kodu: belirtiler, canlı veri kontrolleri, parça değiştirmeden önce test sırası ve onarım doğrulaması.`;
  if (locale === 'de') return `${make} ${model} ${code}: Symptome, Live-Daten-Prüfung, Testreihenfolge vor dem Teiletausch und Reparaturbestätigung.`;
  if (locale === 'es') return `${make} ${model} ${code}: síntomas, datos en vivo, pruebas antes de reemplazar piezas y verificación de reparación.`;
  if (locale === 'fr') return `${make} ${model} ${code}: symptômes, données en direct, tests avant remplacement et vérification après réparation.`;
  return `${make} ${model} ${code} diagnosis: symptoms, live-data checks, tests before replacing parts, repair cost, and post-repair verification.`;
}

function getCodeMetaTitle(locale: string, code: string, make: string, model: string) {
  if (locale === 'tr') return `${make} ${model} ${code} Arıza Kodu - OBD2HQ`;
  if (locale === 'de') return `${make} ${model} ${code} Fehlercode - OBD2HQ`;
  if (locale === 'es') return `${make} ${model} ${code} Código OBD2 - OBD2HQ`;
  if (locale === 'fr') return `${make} ${model} ${code} Code défaut - OBD2HQ`;
  return `${make} ${model} ${code} Code Guide - OBD2HQ`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { make, model, code } = resolvedParams;
  const obdData = getHybridObdData(make, model, code);
  if (!obdData) return { title: 'Code Not Found' };
  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  return {
    title: fitSeoTitle(getCodeMetaTitle(resolvedParams.locale, obdData.code, capMake, capModel)),
    description: fitSeoDescription(getCodeMetaDescription(resolvedParams.locale, obdData.code, capMake, capModel)),
    alternates: getAlternates(`${make}/${model}/${code}`, resolvedParams.locale)
  };
}

export default async function CodePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale, make, model, code } = resolvedParams;

  const obdData = getHybridObdData(make, model, code);
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  if (!obdData || !isValidCar) notFound();

  const upperCode = obdData.code;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'CodePage' });
  const tExtra = await getTranslations({ locale, namespace: 'CodePageExtra' });
  const tDb = await getTranslations({ locale, namespace: 'DB' });

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);

  const rawTitle = asString(getLocalized(obdData.title, locale), obdData.code);
  const rawDescription = asString(getLocalized(obdData.description, locale));
  const locTitle = getLocalizedCodeTitle(upperCode, locale, rawTitle);
  const locDescription = getLocalizedCodeDescription(upperCode, locale, rawDescription);
  const locDiagnosticSteps = asStringArray(getLocalized(obdData.diagnosticSteps, locale)) || getFallbackDiagnosticSteps(upperCode, make, model, locale);
  const locDrivingSafetyDesc = obdData.drivingSafety ? asString(getLocalized(obdData.drivingSafety.description, locale)) : '';
  const systemContent = getLocalizedSystemContent(upperCode, locale);
  const repairTiers = getRepairTiers(upperCode, obdData.estimatedCost, locale);
  const pageCopy = getCodePageCopy(locale);
  const modelInsight = getModelSpecificInsight(make, model, upperCode, locale);
  const clusterLinks = getClusterLinks(locale, make, model, upperCode);
  const localizedCauses = obdData.causes.map(cause => cause.startsWith('cause_') ? tDb(cause) : cause);
  const localizedSymptoms = obdData.symptoms.map(symptom => symptom.startsWith('symp_') ? tDb(symptom) : symptom);
  const isTurkish = locale === 'tr';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": tExtra('canDriveQuestion', { code: upperCode }),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": obdData.drivingSafety ? locDrivingSafetyDesc : tExtra('canDriveAnswer')
        }
      },
      {
        "@type": "Question",
        "name": isTurkish ? `${capMake} için ${upperCode} kodunun yaygın nedenleri nelerdir?` : `What are the common causes of the ${upperCode} code on a ${capMake}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": localizedCauses.join(', ')
        }
      },
      {
        "@type": "Question",
        "name": isTurkish ? `${upperCode} kodunu onarmak ne kadar tutar?` : `How much does it cost to fix the ${upperCode} code?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": isTurkish ? `${upperCode} kodu için tahmini onarım maliyeti ${obdData.estimatedCost}. Bu tutar parça ve işçilik maliyetine göre değişebilir.` : `The estimated repair cost for the ${upperCode} code is ${obdData.estimatedCost}. This includes parts and labor.`
        }
      },
      {
        "@type": "Question",
        "name": tExtra('clearQuestion', { code: upperCode }),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": tExtra('clearAnswer')
        }
      },
      {
        "@type": "Question",
        "name": tExtra('firstCheckQuestion', { code: upperCode }),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": systemContent.firstChecks.join(' ')
        }
      }
    ],
    "author": {
      "@type": "Organization",
      "name": "OBD2HQ",
      "url": "https://www.obd2hq.com"
    },
    "reviewedBy": {
      "@type": "Organization",
      "name": "OBD2HQ Editorial Team",
      "url": `https://www.obd2hq.com/${locale}/reviewers`
    }
  };


  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": isTurkish ? `1996-2026 ${capMake} ${capModel} ${upperCode} Kodu: ${locTitle}` : `1996-2026 ${capMake} ${capModel} ${upperCode} Code: ${locTitle}`,
    "description": locDescription.substring(0, 150),
    "author": {
      "@type": "Organization",
      "name": "OBD2HQ Editorial Team",
      "url": `https://www.obd2hq.com/${locale}/reviewers`
    },
    "publisher": {
      "@type": "Organization",
      "name": "OBD2HQ",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.obd2hq.com/icon.jpg"
      }
    },
    "datePublished": "2024-01-01T08:00:00+08:00",
    "dateModified": SEO_LAST_REVIEWED
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.obd2hq.com/${locale}` },
      { "@type": "ListItem", "position": 2, "name": capMake, "item": `https://www.obd2hq.com/${locale}/${make}` },
      { "@type": "ListItem", "position": 3, "name": capModel, "item": `https://www.obd2hq.com/${locale}/${make}/${model}` },
      { "@type": "ListItem", "position": 4, "name": upperCode, "item": `https://www.obd2hq.com/${locale}/${make}/${model}/${code}` },
    ]
  };

  const relatedCodes = getRelatedCodes(upperCode, Object.keys(baseCodes || {}), 5);

  const severityColor = obdData.drivingSafety?.level === 'danger' ? 'text-red-500 bg-red-500/10' :
                        obdData.drivingSafety?.level === 'caution' ? 'text-amber-500 bg-amber-500/10' :
                        'text-green-500 bg-green-500/10';

  const diffColor = obdData.fixDifficulty.includes('Hard') || obdData.fixDifficulty.includes('diff_professional') ? 'text-red-500' :
                    obdData.fixDifficulty.includes('Moderate') ? 'text-amber-500' : 'text-green-500';

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="hero-visual hero-visual-code relative border-b border-white/5 pt-12 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">

          <nav className="flex flex-wrap items-center text-sm text-slate-400 mb-6 font-medium gap-y-2" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors shrink-0">{t('home')}</Link>
            <span className="mx-2 shrink-0">/</span>
            <Link href={`/${locale}/${make}`} className="hover:text-blue-400 transition-colors shrink-0 capitalize">{make}</Link>
            <span className="mx-2 shrink-0">/</span>
            <Link href={`/${locale}/${make}/${model}`} className="hover:text-blue-400 transition-colors shrink-0 capitalize">{model}</Link>
            <span className="mx-2 shrink-0">/</span>
              <span className="text-white shrink-0">{upperCode}</span>
          </nav>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs sm:text-sm font-semibold tracking-wide">
                1996 - 2026 {capMake} {capModel}
              </span>
              <span className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold tracking-wide uppercase ${severityColor} border-current/20`}>
                {tExtra('severity')}: {obdData.drivingSafety?.level || tExtra('moderate')}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {tExtra('codeTitle', { code: upperCode, title: locTitle })}
            </h1>


            <div className="flex items-center text-slate-400 text-sm mt-2 border-t border-white/10 pt-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span>
                  {t('reviewedBy')} <Link href={`/${locale}/reviewers`} className="text-blue-400 font-medium hover:underline">{tExtra('team')}</Link>
                </span>
                <span className="text-xs opacity-70 flex items-center mt-0.5">
                  <Clock className="w-3 h-3 mr-1" /> {t('lastUpdated') || 'Last Updated:'} {new Date(SEO_LAST_REVIEWED).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 mt-2">
              <Link href={`/${locale}/editorial-policy`} className="hover:text-slate-300 underline underline-offset-2">
                {t('editorialPolicy') || 'Editorial Policy & Disclaimer'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">


        <div className="lg:col-span-2 space-y-12">

          {!obdData.isEnriched && (
            <div className="bg-slate-800/50 border border-amber-500/30 rounded-2xl p-6 shadow-lg mb-8">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-amber-500 mr-3 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed text-sm">
                  {t('genericDisclaimer', { make: capMake, model: capModel, code: upperCode }) || `Note: We do not currently have verified model-specific diagnostic data for the ${capMake} ${capModel}. The symptoms and fixes listed below are the standard generic OBD2 guidelines for the ${upperCode} code. Always consult a factory service manual before replacing parts.`}
                </p>
              </div>
            </div>
          )}

          <section className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white flex items-center m-0 mb-4">
              <AlertCircle className="w-6 h-6 mr-3 text-blue-400" />
              {t('whatDoesItMean')}
            </h2>
            <p className="text-slate-300 text-lg font-light leading-relaxed">
              {locDescription.replace(/Engine Control Module/g, `${capMake} Engine Control Module`)}
            </p>
          </section>

          {obdData.drivingSafety && (
            <section className="bg-[#131b2f] border border-red-500/20 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                {t('howSerious') || 'How Serious Is This Code?'}
              </h2>
              <p className="text-slate-300">{locDrivingSafetyDesc}</p>
            </section>
          )}

          <section className="bg-[#131b2f] border border-white/5 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center">
              <BadgeCheck className="w-5 h-5 mr-2 text-blue-400" />
              {tExtra('diagnosticSystem', { system: systemContent.label })}
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {tExtra('diagnosticSystemDesc', { make: capMake, model: capModel, code: upperCode, system: systemContent.label.toLowerCase() })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center border-b border-white/5 pb-4">
              <Search className="w-6 h-6 mr-3 text-amber-500" />
              {tExtra('commonCausesFor', { make: capMake, model: capModel })}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localizedCauses.map((causeText, idx) => {
                return (
                  <li key={idx} className="bg-[#131b2f] border border-white/5 rounded-xl p-4 flex items-start space-x-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="text-slate-300 font-medium">{causeText}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center border-b border-white/5 pb-4">
              <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
              {t('symptomsToWatch')}
            </h2>
            <ul className="space-y-3">
              {localizedSymptoms.map((symptomText, idx) => {
                return (
                  <li key={idx} className="flex items-center space-x-3 text-slate-300 bg-white/5 p-3 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>{symptomText}</span>
                  </li>
                );
              })}
            </ul>
          </section>


          <section className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2" />
              {t('beforeReplacing') || 'Before replacing parts, check these first'}
            </h2>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              {systemContent.firstChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
              <li>{tExtra('extraFirstCheck')}</li>
            </ul>
          </section>

          <section className="bg-[#131b2f] border border-white/5 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2 text-green-400" />
              {pageCopy.liveData}
            </h2>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              {modelInsight.liveData.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <AdSlot slot="0000000001" label={t('inArticleAd')} className="min-h-[120px]" />


          {locDiagnosticSteps && locDiagnosticSteps.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center border-b border-white/5 pb-4">
                <Wrench className="w-6 h-6 mr-3 text-blue-500" />
                {t('howToDiagnose')}
              </h2>
              <div className="space-y-4">
                {locDiagnosticSteps.map((step: string, idx: number) => (
                  <div key={idx} className="flex space-x-4 bg-[#131b2f] p-5 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="text-slate-300 pt-1 leading-relaxed">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}


          <section className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-red-400 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {t('commonMistakes') || 'Common Mistakes'}
            </h2>
            <p className="text-slate-300">
              {systemContent.mistake} {tExtra('commonMistakeSuffix')}
            </p>
          </section>

          <section className="bg-green-900/10 border border-green-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-green-300 mb-3 flex items-center">
              <BadgeCheck className="w-5 h-5 mr-2" />
              {pageCopy.repairVerification}
            </h2>
            <p className="text-slate-300">{pageCopy.verificationCopy(upperCode)}</p>
          </section>


          <section>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/5 pb-4">
              {t('faq') || 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-2">{tExtra('canDriveQuestion', { code: upperCode })}</h3>
                <p className="text-slate-400">{tExtra('canDriveAnswer')}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-2">{tExtra('clearQuestion', { code: upperCode })}</h3>
                <p className="text-slate-400">{tExtra('clearAnswer')}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-2">{tExtra('emissionsQuestion')}</h3>
                <p className="text-slate-400">{tExtra('emissionsAnswer', { code: upperCode, make: capMake })}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-2">{tExtra('firstCheckQuestion', { code: upperCode })}</h3>
                <p className="text-slate-400">{systemContent.firstChecks.join(' ')}</p>
              </div>
            </div>
          </section>

          <section className="pt-8">
            <DisqusComments
              url={`https://www.obd2hq.com/${locale}/${make}/${model}/${code}`}
              identifier={`${make}-${model}-${code}`}
              title={t('discussionTitle', { code: upperCode, make: capMake, model: capModel })}
            />
          </section>
        </div>


        <div className="space-y-6">

          <div className="bg-gradient-to-br from-[#131b2f] to-[#0d1425] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{t('repairEstimate')}</h3>
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-4xl font-black text-white">{obdData.estimatedCost}</span>
            </div>
            <div className="space-y-3 mb-4">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xs text-green-400 font-bold uppercase tracking-widest mb-1">{tExtra('cheapFix')}</div>
                <p className="text-sm text-slate-300">{repairTiers.cheap}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">{tExtra('expensiveFix')}</div>
                <p className="text-sm text-slate-300">{repairTiers.expensive}</p>
              </div>
            </div>

            {obdData.costBreakdown ? (
              <div className="mt-4 space-y-3 bg-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{t('partsCost')}</span>
                  <span className="text-white font-medium">{obdData.costBreakdown.parts}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{t('laborCost')}</span>
                  <span className="text-white font-medium">{obdData.costBreakdown.labor}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">{t('costIncludesParts')}</p>
            )}

            <div className="mt-6 pt-4 border-t border-white/10">
               <p className="text-xs text-slate-500 mb-3">{systemContent.costNote}</p>
               <div className="flex justify-between text-xs text-slate-400 mb-1">
                 <span>{tExtra('cheapFixShort')}</span>
                 <span>{tExtra('expensiveFixShort')}</span>
               </div>
               <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                 <div className="w-1/3 bg-green-500"></div>
                 <div className="w-1/3 bg-amber-500"></div>
                 <div className="w-1/3 bg-red-500"></div>
               </div>
            </div>
          </div>

          <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 shadow-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{t('diyDifficulty')}</h3>
            <div className="flex items-center space-x-4">
              <span className={`font-bold text-xl ${diffColor}`}>
                {obdData.fixDifficulty.startsWith('diff_') ? tDb(obdData.fixDifficulty) : obdData.fixDifficulty}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {obdData.fixDifficulty.includes('Hard') ? tExtra('hardDifficulty') : tExtra('easyDifficulty')}
            </p>
          </div>

          <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 shadow-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{t('relatedCodes', { make: capMake })}</h3>
            <div className="flex flex-col space-y-3">
              {relatedCodes.map(c => (
                <Link key={c} href={`/${locale}/${make}/${model}/${c.toLowerCase()}`} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 group">
                  <span className="font-bold text-blue-400 group-hover:text-blue-300">{c}</span>
                  <span className="text-xs text-slate-500 group-hover:text-white">{tExtra('viewDetails')}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 shadow-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{pageCopy.clusterTitle}</h3>
            <div className="flex flex-col space-y-3">
              {clusterLinks.map(link => (
                <Link key={link.href} href={link.href} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 group">
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white capitalize">{link.label}</span>
                  <span className="text-xs text-blue-400">{tExtra('viewDetails')}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
