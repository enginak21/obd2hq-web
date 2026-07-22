import { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileJson, FileText, Gauge, Image as ImageIcon, Link2, Wrench } from 'lucide-react';
import { baseCodes } from '@/data/db';
import { SEO_LAST_REVIEWED } from '@/data/seo';
import { fitSeoDescription, fitSeoTitle, getAlternates } from '@/utils/seo';

type PageProps = {
  params: Promise<{ locale: string }>;
};

const copy = {
  en: {
    title: 'Free OBD2 Resources, Dataset, Widget and Checklists',
    meta: 'Free OBD2HQ resources for websites, forums and drivers: code dataset, lookup widget, warning light library, diagnostic checklist and yearly code report.',
    h1: 'Free OBD2 resources for diagnostics and research',
    intro: 'Use these resources to reference OBD2 codes, help drivers find safer first checks, build community posts, and link back to the original OBD2HQ diagnostic guides.',
    dataset: 'Open OBD2 code dataset',
    widget: 'Embeddable OBD2 lookup widget',
    lights: 'Dashboard warning light image library',
    checklist: 'Diagnostic checklist',
    report: 'Most watched OBD2 code report',
    linkKit: 'Linkable diagnostic source kit',
    attribution: 'Attribution: link to OBD2HQ when you use the dataset, widget, warning-light library or checklist publicly. Clean editorial links from forums, guides and tool pages help keep the resource free.',
    open: 'Open resource',
  },
  tr: {
    title: 'Ücretsiz OBD2 Kaynakları, Veri Seti, Widget ve Kontrol Listeleri',
    meta: 'Siteler, forumlar ve sürücüler için ücretsiz OBD2HQ kaynakları: kod veri seti, sorgulama widgetı, uyarı ışığı kütüphanesi, teşhis checklisti ve yıllık kod raporu.',
    h1: 'Teşhis ve araştırma için ücretsiz OBD2 kaynakları',
    intro: 'Bu kaynakları OBD2 kodlarına referans vermek, sürücülere güvenli ilk kontrolleri göstermek, forum/rehber içerikleri hazırlamak ve OBD2HQ rehberlerine kaynak bağlantısı vermek için kullanabilirsiniz.',
    dataset: 'Açık OBD2 kod veri seti',
    widget: 'Gömülebilir OBD2 sorgulama widgetı',
    lights: 'Gösterge paneli uyarı ışığı görsel kütüphanesi',
    checklist: 'Teşhis kontrol listesi',
    report: 'En çok izlenen OBD2 kodları raporu',
    linkKit: 'Kaynak gösterilebilir teşhis kiti',
    attribution: 'Atıf: Veri seti, widget, uyarı ışığı kütüphanesi veya checklisti herkese açık kullanırken OBD2HQ bağlantısı verin. Forum, rehber ve araç sayfalarından gelen temiz editoryal linkler bu kaynağın ücretsiz kalmasına yardımcı olur.',
    open: 'Kaynağı aç',
  },
  de: {
    title: 'Kostenlose OBD2-Ressourcen, Datensatz, Widget und Checklisten',
    meta: 'Kostenlose OBD2HQ-Ressourcen: Code-Datensatz, Lookup-Widget, Warnleuchten-Bibliothek, Diagnose-Checkliste und jährlicher Code-Report.',
    h1: 'Kostenlose OBD2-Ressourcen für Diagnose und Recherche',
    intro: 'Nutzen Sie diese Ressourcen, um OBD2-Codes zu referenzieren, sichere Erstprüfungen zu zeigen und auf OBD2HQ-Leitfäden zu verlinken.',
    dataset: 'Offener OBD2-Code-Datensatz',
    widget: 'Einbettbares OBD2-Lookup-Widget',
    lights: 'Warnleuchten-Bildbibliothek',
    checklist: 'Diagnose-Checkliste',
    report: 'Report der meistbeobachteten OBD2-Codes',
    linkKit: 'Zitierfähiges Diagnose-Quellenkit',
    attribution: 'Attribution: Bitte auf OBD2HQ verlinken, wenn Sie Datensatz, Widget oder Checkliste öffentlich nutzen.',
    open: 'Ressource öffnen',
  },
  es: {
    title: 'Recursos OBD2 gratis, dataset, widget y listas de diagnóstico',
    meta: 'Recursos gratuitos de OBD2HQ: dataset de códigos, widget de búsqueda, biblioteca de luces del tablero, checklist y reporte anual.',
    h1: 'Recursos OBD2 gratis para diagnóstico e investigación',
    intro: 'Usa estos recursos para citar códigos OBD2, mostrar primeras revisiones seguras y enlazar a las guías originales de OBD2HQ.',
    dataset: 'Dataset abierto de códigos OBD2',
    widget: 'Widget OBD2 insertable',
    lights: 'Biblioteca visual de luces del tablero',
    checklist: 'Lista de revisión diagnóstica',
    report: 'Reporte de códigos OBD2 más vistos',
    linkKit: 'Kit de recursos enlazables',
    attribution: 'Atribución: enlaza a OBD2HQ si usas públicamente el dataset, widget o checklist.',
    open: 'Abrir recurso',
  },
  fr: {
    title: 'Ressources OBD2 gratuites, jeu de données, widget et listes',
    meta: 'Ressources OBD2HQ gratuites : jeu de données de codes, widget de recherche, bibliothèque de voyants, checklist diagnostic et rapport annuel.',
    h1: 'Ressources OBD2 gratuites pour le diagnostic et la recherche',
    intro: 'Utilisez ces ressources pour citer les codes OBD2, guider les premiers contrôles sûrs et créer des liens vers les guides OBD2HQ.',
    dataset: 'Jeu de données OBD2 ouvert',
    widget: 'Widget OBD2 intégrable',
    lights: 'Bibliothèque visuelle de voyants',
    checklist: 'Checklist diagnostic',
    report: 'Rapport des codes OBD2 les plus suivis',
    linkKit: 'Kit de sources diagnostic à citer',
    attribution: 'Attribution : ajoutez un lien vers OBD2HQ si vous utilisez publiquement le jeu de données, le widget ou la checklist.',
    open: 'Ouvrir la ressource',
  },
} as const;

function getCopy(locale: string) {
  return copy[locale as keyof typeof copy] || copy.en;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = getCopy(locale);
  return {
    title: fitSeoTitle(c.title),
    description: fitSeoDescription(c.meta),
    alternates: getAlternates('resources', locale),
  };
}

export default async function ResourcesPage({ params }: PageProps) {
  const { locale } = await params;
  const c = getCopy(locale);
  const resources = [
    { title: c.dataset, href: '/open-data/obd2-codes.json', icon: FileJson, note: `${Object.keys(baseCodes).length} OBD2 codes` },
    { title: c.widget, href: '/widget/obd2hq-lookup.js', icon: Wrench, note: '<div data-obd2hq-widget></div>' },
    { title: c.lights, href: '/open-data/warning-lights.json', icon: ImageIcon, note: 'ABS, battery, oil, coolant, SRS, TPMS' },
    { title: c.checklist, href: '/open-data/diagnostic-checklist.json', icon: FileText, note: 'Freeze-frame, live data, first checks' },
    { title: c.linkKit, href: '/open-data/link-assets.json', icon: Link2, note: 'Dataset, widget, attribution, editorial link guidance' },
    { title: c.report, href: `/${locale}/codes/p0213`, icon: Gauge, note: `Last reviewed ${SEO_LAST_REVIEWED.slice(0, 10)}` },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: c.title,
    description: c.meta,
    url: `https://obd2hq.com/${locale}/resources`,
    publisher: { '@type': 'Organization', name: 'OBD2HQ' },
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="hero-visual hero-visual-diagnostic relative overflow-hidden border-b border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link href={`/${locale}`} className="hover:text-blue-300">OBD2HQ</Link>
            <span>/</span>
            <span className="text-white">Resources</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{c.h1}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{c.intro}</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="group rounded-2xl border border-white/10 bg-[#111827] p-5 transition hover:border-blue-400/40 hover:bg-[#152033]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-200">
                      <Icon size={21} />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.note}</p>
                    </div>
                  </div>
                  <Download className="mt-1 text-slate-500 transition group-hover:text-blue-200" size={18} />
                </div>
                <span className="mt-5 inline-flex text-sm font-semibold text-blue-200">{c.open}</span>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50">{c.attribution}</p>
      </section>
    </main>
  );
}
