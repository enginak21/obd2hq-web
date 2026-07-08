export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  image: string;
}

const postsEN: BlogPost[] = [
  {
    slug: 'best-obd2-scanners-2026',
    title: 'Top 5 Best OBD2 Scanners in 2026 (For Beginners & Pros)',
    description: 'Find out which OBD2 scanners are actually worth your money in 2026. We review the top 5 tools that can save you thousands in mechanic bills.',
    date: '2026-07-08',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      <h2>Why You Need an OBD2 Scanner</h2>
      <p>If your Check Engine Light (CEL) comes on, taking your car to a mechanic just to read the code can cost anywhere from $50 to $150. An OBD2 scanner pays for itself the first time you use it.</p>
      
      <h3>1. BlueDriver Bluetooth Pro</h3>
      <p><strong>Best Overall</strong><br/>The BlueDriver is a favorite among DIY mechanics. It connects directly to your smartphone via Bluetooth and offers a massive database of verified fixes. <br/><a href="#" class="text-blue-400 font-bold hover:underline">Check Price on Amazon</a></p>

      <h3>2. FOXWELL NT301</h3>
      <p><strong>Best Budget Option</strong><br/>If you don't want to use your phone, this standalone scanner is rugged, reliable, and incredibly easy to use. It features a color screen and one-click I/M readiness keys. <br/><a href="#" class="text-blue-400 font-bold hover:underline">Check Price on Amazon</a></p>

      <h3>3. Innova 6100P</h3>
      <p><strong>Best for ABS & SRS</strong><br/>While cheap scanners only read engine codes, the Innova 6100P can also read Anti-lock Brake System (ABS) and Airbag (SRS) codes on most vehicles. <br/><a href="#" class="text-blue-400 font-bold hover:underline">Check Price on Amazon</a></p>

      <h2>Conclusion</h2>
      <p>Buying an OBD2 scanner is the single best investment you can make for your car. It empowers you to know exactly what's wrong before a mechanic tries to upsell you.</p>
    `
  },
  {
    slug: 'how-to-fix-p0420',
    title: 'How to Fix the P0420 Code (Catalyst System Efficiency)',
    description: 'The P0420 is one of the most common OBD2 codes. Learn exactly what it means, the common causes, and how to fix it without replacing your catalytic converter.',
    date: '2026-07-05',
    image: 'https://images.unsplash.com/photo-1486262715619-6708146bc9c5?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      <h2>Understanding the P0420 Code</h2>
      <p>The P0420 code means "Catalyst System Efficiency Below Threshold (Bank 1)". This means your car's computer has detected that the catalytic converter is not functioning as efficiently as it should be.</p>
      
      <h3>Common Causes</h3>
      <ul>
        <li>Faulty oxygen (O2) sensor (front or rear)</li>
        <li>Exhaust leak near the catalytic converter</li>
        <li>Failed or degraded catalytic converter</li>
        <li>Engine misfires running rich/lean</li>
      </ul>

      <h3>Don't Just Replace the Converter!</h3>
      <p>Mechanics love to quote $1,000+ for a new catalytic converter when they see a P0420 code. However, in many cases, the issue is actually a faulty downstream O2 sensor. An O2 sensor costs around $50 on Amazon and takes 20 minutes to replace.</p>
      
      <h3>Recommended O2 Sensor Socket Tool</h3>
      <p>If you're going to replace the sensor yourself, you will need a special slotted socket. <a href="#" class="text-blue-400 font-bold hover:underline">View O2 Sensor Tools on Amazon</a>.</p>
    `
  }
];

const postsTR: BlogPost[] = [
  {
    slug: 'en-iyi-obd2-cihazlari-2026',
    title: '2026 Yılının En İyi 5 OBD2 Arıza Tespit Cihazı',
    description: '2026 yılında paranızın karşılığını veren en iyi OBD2 tarayıcılarını öğrenin. Sizi binlerce liralık tamir masrafından kurtaracak ilk 5 cihazı inceliyoruz.',
    date: '2026-07-08',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      <h2>Neden Bir OBD2 Cihazına İhtiyacınız Var?</h2>
      <p>Motor Arıza Lambanız yandığında, sadece arıza kodunu okumak için tamirciye gitmek bile size ciddi bir masraf çıkarabilir. Bir OBD2 cihazı, ilk kullanımında kendini amorti eder.</p>
      
      <h3>1. BlueDriver Bluetooth Pro</h3>
      <p><strong>Genel Klasmanda En İyisi</strong><br/>BlueDriver, araba tutkunları arasında favoridir. Bluetooth ile telefonunuza bağlanır ve devasa bir çözüm veritabanı sunar. <br/><a href="#" class="text-blue-400 font-bold hover:underline">Amazon'da Fiyatını Gör</a></p>

      <h3>2. FOXWELL NT301</h3>
      <p><strong>En İyi Bütçe Dostu Seçenek</strong><br/>Telefonunuzu kullanmak istemiyorsanız, bu bağımsız tarayıcı son derece dayanıklı, güvenilir ve kullanımı kolaydır. <br/><a href="#" class="text-blue-400 font-bold hover:underline">Amazon'da Fiyatını Gör</a></p>

      <h3>3. Innova 6100P</h3>
      <p><strong>ABS & SRS İçin En İyisi</strong><br/>Ucuz tarayıcılar sadece motor kodlarını okurken, Innova 6100P çoğu araçta ABS ve Hava Yastığı (SRS) kodlarını da okuyabilir. <br/><a href="#" class="text-blue-400 font-bold hover:underline">Amazon'da Fiyatını Gör</a></p>

      <h2>Sonuç</h2>
      <p>Bir OBD2 cihazı satın almak, arabanız için yapabileceğiniz en iyi yatırımdır. Bir tamirci size gereksiz parça satmaya çalışmadan önce sorunun tam olarak ne olduğunu bilmenizi sağlar.</p>
    `
  },
  {
    slug: 'p0420-ariza-kodu-nasil-cozulur',
    title: 'P0420 Arıza Kodu Nasıl Çözülür? (Katalizör Sistemi)',
    description: 'P0420 en yaygın OBD2 kodlarından biridir. Ne anlama geldiğini, yaygın nedenlerini ve katalizörü değiştirmeden nasıl onaracağınızı öğrenin.',
    date: '2026-07-05',
    image: 'https://images.unsplash.com/photo-1486262715619-6708146bc9c5?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      <h2>P0420 Kodunu Anlamak</h2>
      <p>P0420 kodu "Katalizör Sistemi Verimliliği Eşik Değerinin Altında (Sıra 1)" anlamına gelir. Bu, aracınızın bilgisayarının katalitik konvertörün gerektiği kadar verimli çalışmadığını algıladığını gösterir.</p>
      
      <h3>Yaygın Nedenleri</h3>
      <ul>
        <li>Arızalı oksijen (O2) sensörü (ön veya arka)</li>
        <li>Katalitik konvertör çevresinde egzoz sızıntısı</li>
        <li>Bozulmuş veya ömrünü tamamlamış katalizör</li>
        <li>Motorun zengin/fakir karışımla çalışması</li>
      </ul>

      <h3>Hemen Katalizörü Değiştirmeyin!</h3>
      <p>Tamirciler P0420 kodunu gördüklerinde hemen yeni bir katalizör (binlerce lira) fiyatı vermeyi severler. Ancak çoğu durumda sorun aslında sadece arızalı bir O2 sensörüdür. Sensör değişimi çok daha ucuz ve kolaydır.</p>
      
      <h3>Önerilen Sensör Sökme Anahtarı</h3>
      <p>Sensörü kendiniz değiştirecekseniz, kablonun geçmesi için yarıklı özel bir lokma anahtarına ihtiyacınız olacak. <a href="#" class="text-blue-400 font-bold hover:underline">O2 Sensör Araçlarını Amazon'da İnceleyin</a>.</p>
    `
  }
];

const postsDE: BlogPost[] = [
  {
    slug: 'die-besten-obd2-scanner-2026',
    title: 'Die 5 besten OBD2-Scanner im Jahr 2026',
    description: 'Finden Sie heraus, welche OBD2-Scanner ihr Geld wert sind. Wir überprüfen die Top 5 Werkzeuge.',
    date: '2026-07-08',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      <h2>Warum Sie einen OBD2-Scanner brauchen</h2>
      <p>Wenn Ihre Motorkontrollleuchte aufleuchtet, kann es Sie viel Geld kosten, nur um den Code auslesen zu lassen. Ein OBD2-Scanner macht sich schnell bezahlt.</p>
      
      <h3>1. BlueDriver Bluetooth Pro</h3>
      <p><strong>Bester insgesamt</strong><br/>Der BlueDriver verbindet sich per Bluetooth mit Ihrem Smartphone. <br/><a href="#" class="text-blue-400 font-bold hover:underline">Preis auf Amazon prüfen</a></p>

      <h3>2. FOXWELL NT301</h3>
      <p><strong>Beste Budget-Option</strong><br/>Dieses eigenständige Gerät ist robust, zuverlässig und sehr einfach zu bedienen. <br/><a href="#" class="text-blue-400 font-bold hover:underline">Preis auf Amazon prüfen</a></p>

      <h3>3. Innova 6100P</h3>
      <p><strong>Bester für ABS & SRS</strong><br/>Dieser Scanner kann auch Antiblockiersystem- (ABS) und Airbag- (SRS) Codes lesen. <br/><a href="#" class="text-blue-400 font-bold hover:underline">Preis auf Amazon prüfen</a></p>
    `
  },
  {
    slug: 'wie-man-p0420-behebt',
    title: 'Wie man den Code P0420 behebt (Katalysatorsystem)',
    description: 'Erfahren Sie genau, was er bedeutet, die häufigsten Ursachen und wie Sie ihn reparieren können.',
    date: '2026-07-05',
    image: 'https://images.unsplash.com/photo-1486262715619-6708146bc9c5?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      <h2>Verständnis des P0420-Codes</h2>
      <p>Der Code P0420 bedeutet "Katalysatorsystem Wirkungsgrad unter Schwellenwert (Bank 1)".</p>
      
      <h3>Häufige Ursachen</h3>
      <ul>
        <li>Defekter Sauerstoffsensor (O2)</li>
        <li>Auspuffabgasleck</li>
        <li>Defekter Katalysator</li>
      </ul>

      <h3>Tauschen Sie nicht sofort den Katalysator aus!</h3>
      <p>Oftmals ist das Problem nur ein defekter Sauerstoffsensor, der viel billiger ist.</p>
    `
  }
];

// Fallback translations for ES and FR
const postsES = postsEN;
const postsFR = postsEN;

export const blogPosts: BlogPost[] = postsEN; // Keep for backward compatibility

export function getBlogPosts(locale: string): BlogPost[] {
  switch (locale) {
    case 'tr': return postsTR;
    case 'de': return postsDE;
    case 'es': return postsES;
    case 'fr': return postsFR;
    default: return postsEN;
  }
}
