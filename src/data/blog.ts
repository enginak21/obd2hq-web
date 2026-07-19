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
      <p><strong>Best Overall</strong><br/>The BlueDriver is a favorite among DIY mechanics. It connects directly to your smartphone via Bluetooth and offers a massive database of verified fixes. <br/><span class="text-slate-400 font-semibold">Affiliate link pending editorial review</span></p>

      <h3>2. FOXWELL NT301</h3>
      <p><strong>Best Budget Option</strong><br/>If you don't want to use your phone, this standalone scanner is rugged, reliable, and incredibly easy to use. It features a color screen and one-click I/M readiness keys. <br/><span class="text-slate-400 font-semibold">Affiliate link pending editorial review</span></p>

      <h3>3. Innova 6100P</h3>
      <p><strong>Best for ABS & SRS</strong><br/>While cheap scanners only read engine codes, the Innova 6100P can also read Anti-lock Brake System (ABS) and Airbag (SRS) codes on most vehicles. <br/><span class="text-slate-400 font-semibold">Affiliate link pending editorial review</span></p>

      <h2>Conclusion</h2>
      <p>Buying an OBD2 scanner is the single best investment you can make for your car. It empowers you to know exactly what's wrong before a mechanic tries to upsell you.</p>
    `
  },
  {
    slug: 'how-to-fix-p0420',
    title: 'How to Fix P0420 Without Replacing the Catalytic Converter',
    description: 'A practical P0420 diagnostic guide: symptoms, cheap checks, O2 sensor testing, exhaust leaks, fuel trim, and when the catalytic converter is actually the problem.',
    date: '2026-07-05',
    image: 'https://images.unsplash.com/photo-1486262715619-6708146bc9c5?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      <p>The P0420 code means <strong>Catalyst System Efficiency Below Threshold (Bank 1)</strong>. In plain English, your engine computer believes the catalytic converter is no longer cleaning exhaust gases as well as it should. That does not automatically mean the converter is bad. A lazy oxygen sensor, exhaust leak, misfire, rich fuel mixture, or wiring problem can make the converter look guilty even when it is not.</p>

      <p>This guide is written to help you avoid the expensive "parts cannon" approach. A catalytic converter can cost hundreds or thousands of dollars, so the right move is to test the cheap and likely causes first.</p>

      <h2>Quick Safety and Severity Check</h2>
      <p>If the check engine light is solid, most drivers can usually continue driving to a safe place or repair shop. If the check engine light is flashing, stop driving as soon as it is safe. A flashing light usually means active misfire, and active misfires can overheat and destroy the catalytic converter quickly.</p>

      <h2>Common P0420 Symptoms</h2>
      <ul>
        <li>Check engine light is on</li>
        <li>Failed emissions or smog test</li>
        <li>Reduced fuel economy</li>
        <li>Rotten egg or sulfur smell from the exhaust</li>
        <li>Loss of power at higher speed or under load</li>
        <li>No noticeable symptoms other than the stored code</li>
      </ul>

      <h2>Most Common Causes</h2>
      <ul>
        <li>Exhaust leak before or near the catalytic converter</li>
        <li>Failing downstream oxygen sensor</li>
        <li>Upstream oxygen sensor reporting incorrect data</li>
        <li>Engine running rich or lean because of fuel trim problems</li>
        <li>Recent or current misfire damaging converter efficiency</li>
        <li>Aging or contaminated catalytic converter</li>
        <li>Aftermarket converter that does not meet the vehicle's emissions standard</li>
      </ul>

      <h2>Before Replacing the Catalytic Converter, Check These First</h2>
      <p><strong>1. Scan for related codes.</strong> P0300 misfire codes, P0171/P0174 lean codes, and oxygen sensor heater codes can explain why P0420 appeared. Fix active engine or fuel mixture problems first.</p>
      <p><strong>2. Inspect for exhaust leaks.</strong> A small leak before the rear O2 sensor can pull in outside air and trick the computer into thinking the converter is not working.</p>
      <p><strong>3. Look at live oxygen sensor data.</strong> On many vehicles, the upstream O2 sensor should switch rapidly, while the downstream sensor should be much steadier once the converter is hot. If both sensors mirror each other closely, converter efficiency may be low. If the downstream sensor is stuck or erratic, test the sensor and wiring before blaming the converter.</p>
      <p><strong>4. Check fuel trims.</strong> High positive or negative fuel trims suggest the engine is running lean or rich. A converter cannot work correctly if the engine is feeding it the wrong mixture.</p>
      <p><strong>5. Verify operating temperature.</strong> A stuck-open thermostat or short trips can keep the exhaust system too cool for proper catalyst monitoring.</p>

      <h2>Step-by-Step Diagnostic Flow</h2>
      <ol>
        <li>Confirm P0420 and save freeze-frame data before clearing the code.</li>
        <li>Check for misfire, fuel trim, oxygen sensor, or coolant temperature codes.</li>
        <li>Inspect the exhaust from the engine to the converter for leaks, cracks, or loose flanges.</li>
        <li>Warm the engine fully and compare upstream and downstream O2 sensor behavior with live data.</li>
        <li>Inspect O2 sensor wiring and connectors for heat damage or corrosion.</li>
        <li>Fix verified leaks, misfires, sensor faults, or fuel trim problems first.</li>
        <li>Clear the code and complete a drive cycle. If P0420 returns after all supporting systems test good, the converter is more likely to be the real fault.</li>
      </ol>

      <h2>Typical Repair Cost</h2>
      <p>A cheap fix can be a loose exhaust clamp, damaged connector, or minor exhaust leak. A typical fix may involve an oxygen sensor or exhaust repair. The expensive fix is catalytic converter replacement, especially on vehicles with integrated manifold converters or strict emissions requirements.</p>

      <h2>Common Mistakes</h2>
      <ul>
        <li>Replacing the catalytic converter without checking for exhaust leaks</li>
        <li>Replacing O2 sensors without looking at live data</li>
        <li>Ignoring misfire or fuel trim codes that caused converter damage</li>
        <li>Installing a low-quality aftermarket converter on a vehicle that needs a higher-grade emissions part</li>
        <li>Clearing the code right before an emissions test without completing readiness monitors</li>
      </ul>

      <h2>Vehicle-Specific P0420 Guides</h2>
      <p>For model-specific symptoms, repair cost ranges, and diagnostic notes, open the matching OBD2HQ code guide: <a href="/en/toyota/camry/p0420" class="text-blue-400 font-bold hover:underline">Toyota Camry P0420</a>, <a href="/en/honda/civic/p0420" class="text-blue-400 font-bold hover:underline">Honda Civic P0420</a>, or <a href="/en/ford/f-150/p0420" class="text-blue-400 font-bold hover:underline">Ford F-150 P0420</a>.</p>

      <h2>Bottom Line</h2>
      <p>P0420 is not a command to buy a catalytic converter. It is a signal to verify converter efficiency after checking the systems that can distort the test. Start with scan data, exhaust leaks, O2 sensor behavior, fuel trim, and misfire history. Replace the converter only when the supporting evidence points there.</p>
    `
  },
  {
    slug: 'p0300-symptoms-random-misfire',
    title: 'P0300 Symptoms: Random Misfire Causes, Diagnosis, and Safe Fixes',
    description: 'Learn what P0300 means, the symptoms that matter, how to diagnose random misfires, when it is safe to drive, and what to test before replacing coils.',
    date: '2026-07-14',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      <p>P0300 means the engine computer detected random or multiple-cylinder misfires. Unlike a single-cylinder code such as P0301 or P0302, P0300 usually means the problem can affect the whole engine: air leaks, fuel delivery, ignition quality, sensor data, compression, or timing.</p>
      <h2>Most Important Symptoms</h2>
      <ul>
        <li>Flashing or solid check engine light</li>
        <li>Rough idle, shaking, or stumbling under load</li>
        <li>Fuel smell, poor fuel economy, or hard starting</li>
        <li>Loss of power during acceleration</li>
        <li>Catalytic converter overheating if the misfire is severe</li>
      </ul>
      <h2>Can You Drive With P0300?</h2>
      <p>If the check engine light is flashing, stop driving as soon as it is safe. A flashing light means active misfire that can damage the catalytic converter. If the light is solid and the engine runs normally, drive gently to a repair location and avoid heavy load.</p>
      <h2>Diagnose P0300 Without Guessing</h2>
      <ol>
        <li>Save freeze-frame data before clearing the code.</li>
        <li>Check for related lean, fuel trim, crank sensor, cam sensor, or catalyst codes.</li>
        <li>Review misfire counters to see which cylinders are affected.</li>
        <li>Inspect spark plugs, ignition coils, coil boots, and injector connectors.</li>
        <li>Check for vacuum leaks, intake boot cracks, and PCV leaks.</li>
        <li>Compare fuel trims at idle and cruise. Lean trims at idle often point to air leaks.</li>
        <li>Verify fuel pressure and compression if ignition and air checks pass.</li>
      </ol>
      <h2>Common Mistakes</h2>
      <p>The expensive mistake is replacing every ignition coil without checking plugs, vacuum leaks, fuel trims, injector pulse, and compression. Move coils only when the misfire is cylinder-specific. For random P0300, prove the system-level cause first.</p>
      <h2>Vehicle-Specific Guides</h2>
      <p>Continue with model-specific diagnosis: <a href="/en/toyota/camry/p0300" class="text-blue-400 font-bold hover:underline">Toyota Camry P0300</a>, <a href="/en/honda/civic/p0300" class="text-blue-400 font-bold hover:underline">Honda Civic P0300</a>, <a href="/en/ford/focus/p0300" class="text-blue-400 font-bold hover:underline">Ford Focus P0300</a>, and <a href="/en/suzuki/jimny/p0300" class="text-blue-400 font-bold hover:underline">Suzuki Jimny P0300</a>.</p>
      <h2>Bottom Line</h2>
      <p>P0300 is a diagnosis path, not a parts list. Use freeze-frame data, misfire counters, fuel trims, vacuum testing, ignition checks, and compression data to prove the cause before buying parts.</p>
    `
  },
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
      <p><strong>Genel Klasmanda En İyisi</strong><br/>BlueDriver, araba tutkunları arasında favoridir. Bluetooth ile telefonunuza bağlanır ve devasa bir çözüm veritabanı sunar. <br/><span class="text-slate-400 font-semibold">Satın alma bağlantısı editoryal incelemeden sonra eklenecek</span></p>

      <h3>2. FOXWELL NT301</h3>
      <p><strong>En İyi Bütçe Dostu Seçenek</strong><br/>Telefonunuzu kullanmak istemiyorsanız, bu bağımsız tarayıcı son derece dayanıklı, güvenilir ve kullanımı kolaydır. <br/><span class="text-slate-400 font-semibold">Satın alma bağlantısı editoryal incelemeden sonra eklenecek</span></p>

      <h3>3. Innova 6100P</h3>
      <p><strong>ABS & SRS İçin En İyisi</strong><br/>Ucuz tarayıcılar sadece motor kodlarını okurken, Innova 6100P çoğu araçta ABS ve Hava Yastığı (SRS) kodlarını da okuyabilir. <br/><span class="text-slate-400 font-semibold">Satın alma bağlantısı editoryal incelemeden sonra eklenecek</span></p>

      <h2>Sonuç</h2>
      <p>Bir OBD2 cihazı satın almak, arabanız için yapabileceğiniz en iyi yatırımdır. Bir tamirci size gereksiz parça satmaya çalışmadan önce sorunun tam olarak ne olduğunu bilmenizi sağlar.</p>
    `
  },
  {
    slug: 'p0420-ariza-kodu-nasil-cozulur',
    title: 'P0420 Arıza Kodu Katalizör Değişmeden Nasıl Çözülür?',
    description: 'P0420 kodu için pratik teşhis rehberi: oksijen sensörü, egzoz kaçağı, yakıt trimleri, tekleme ve katalizörün gerçekten arızalı olup olmadığını kontrol edin.',
    date: '2026-07-05',
    image: 'https://images.unsplash.com/photo-1486262715619-6708146bc9c5?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      <p>P0420 kodu <strong>Katalizör Sistemi Verimliliği Eşik Değerinin Altında (Sıra 1)</strong> anlamına gelir. Bu kod görüldüğünde ilk akla gelen parça katalitik konvertördür, fakat sorun her zaman katalizör değildir. Egzoz kaçağı, oksijen sensörü, yakıt karışımı, motor teklemesi veya kablo/soket arızası da P0420 kodunu tetikleyebilir.</p>

      <p>Bu rehberin amacı pahalı katalizör değişimine gitmeden önce kontrol edilmesi gereken ucuz ve mantıklı adımları göstermektir.</p>

      <h2>Önem Derecesi</h2>
      <p>Motor arıza lambası sabit yanıyorsa araç genellikle güvenli bir yere veya servise kadar kullanılabilir. Işık yanıp sönüyorsa aracı zorlamayın; aktif tekleme katalizöre ciddi zarar verebilir.</p>

      <h2>Yaygın Belirtiler</h2>
      <ul>
        <li>Motor arıza lambası yanar</li>
        <li>Yakıt tüketimi artabilir</li>
        <li>Egzozdan kötü koku gelebilir</li>
        <li>Emisyon testinden kalabilir</li>
        <li>Bazen hiçbir belirti olmaz, sadece kod görünür</li>
      </ul>

      <h2>Yaygın Nedenler</h2>
      <ul>
        <li>Katalizör öncesinde veya çevresinde egzoz kaçağı</li>
        <li>Arka oksijen sensörünün hatalı veri göndermesi</li>
        <li>Ön oksijen sensörünün yanlış ölçüm yapması</li>
        <li>Fakir veya zengin karışım</li>
        <li>Motor teklemesi geçmişi</li>
        <li>Ömrünü tamamlamış veya kalitesiz katalitik konvertör</li>
      </ul>

      <h2>Katalizör Değişmeden Önce Kontrol Edin</h2>
      <ol>
        <li>OBD2 cihazı ile P0420 kodunu doğrulayın ve freeze frame verisini kaydedin.</li>
        <li>P0300, P0171, P0174, P0136, P0141 gibi ilişkili kodlar var mı bakın.</li>
        <li>Egzoz hattında kaçak, çatlak, gevşek flanş veya conta problemi arayın.</li>
        <li>Motor ısındıktan sonra ön ve arka oksijen sensörü canlı verilerini karşılaştırın.</li>
        <li>Yakıt trim değerleri çok yüksek veya çok düşükse önce karışım problemini çözün.</li>
        <li>Kodu silip sürüş döngüsünü tamamlayın. Kod geri gelirse eldeki veriye göre sensör, egzoz veya katalizör kararını verin.</li>
      </ol>

      <h2>Sık Yapılan Hatalar</h2>
      <ul>
        <li>Egzoz kaçağı kontrol edilmeden katalizör değiştirmek</li>
        <li>Canlı veri bakmadan oksijen sensörü değiştirmek</li>
        <li>Tekleme ve yakıt karışımı sorunlarını görmezden gelmek</li>
        <li>Ucuz ve uyumsuz katalizör takıp kodun geri dönmesine sebep olmak</li>
      </ul>

      <h2>Modele Özel Rehberler</h2>
      <p>Aracınıza özel belirtiler ve maliyet aralıkları için ilgili rehberi açın: <a href="/tr/toyota/camry/p0420" class="text-blue-400 font-bold hover:underline">Toyota Camry P0420</a>, <a href="/tr/honda/civic/p0420" class="text-blue-400 font-bold hover:underline">Honda Civic P0420</a> veya <a href="/tr/ford/f-150/p0420" class="text-blue-400 font-bold hover:underline">Ford F-150 P0420</a>.</p>

      <h2>Sonuç</h2>
      <p>P0420 kodu pahalı bir katalizör değişimi emri değildir. Önce egzoz kaçağı, oksijen sensörü verisi, yakıt trimleri ve tekleme geçmişi kontrol edilmelidir. Katalizör ancak diğer olasılıklar test edilip elendikten sonra değiştirilmelidir.</p>
    `
  },
  {
    slug: 'p0300-belirtileri-rastgele-tekleme',
    title: 'P0300 Belirtileri: Rastgele Tekleme Nedenleri ve Güvenli Teşhis',
    description: 'P0300 kodunun belirtileri, rastgele tekleme nedenleri, aracı kullanma güvenliği ve bobin değiştirmeden önce yapılacak testler.',
    date: '2026-07-14',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `<p>P0300, motor kontrol ünitesinin rastgele veya birden fazla silindirde tekleme algıladığını gösterir. Bu kod yalnızca bobin arızası anlamına gelmez; vakum kaçağı, yakıt basıncı, buji, enjektör, kompresyon veya sensör verisi de nedeni olabilir.</p><h2>Güvenlik</h2><p>Motor arıza lambası yanıp sönüyorsa aracı zorlamayın. Aktif tekleme katalizöre zarar verebilir. Işık sabitse ve motor normal çalışıyorsa düşük yükle servise kadar gidilebilir.</p><h2>Teşhis Sırası</h2><ol><li>Freeze-frame verisini silmeden kaydedin.</li><li>Tekleme sayaçlarını ve hangi silindirlerin etkilendiğini kontrol edin.</li><li>Vakum kaçağı, buji, bobin, enjektör, yakıt basıncı ve kompresyonu sırayla doğrulayın.</li><li>Yakıt trimlerini rölanti ve sabit hızda karşılaştırın.</li><li>Onarımdan sonra kodu silip sürüş döngüsünü tamamlayın.</li></ol><p><a href="/tr/ford/focus/p0300" class="text-blue-400 font-bold hover:underline">Ford Focus P0300</a> ve <a href="/tr/toyota/camry/p0300" class="text-blue-400 font-bold hover:underline">Toyota Camry P0300</a> rehberleriyle devam edin.</p>`
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
      <p><strong>Bester insgesamt</strong><br/>Der BlueDriver verbindet sich per Bluetooth mit Ihrem Smartphone. <br/><span class="text-slate-400 font-semibold">Kauflink folgt nach redaktioneller Prüfung</span></p>

      <h3>2. FOXWELL NT301</h3>
      <p><strong>Beste Budget-Option</strong><br/>Dieses eigenständige Gerät ist robust, zuverlässig und sehr einfach zu bedienen. <br/><span class="text-slate-400 font-semibold">Kauflink folgt nach redaktioneller Prüfung</span></p>

      <h3>3. Innova 6100P</h3>
      <p><strong>Bester für ABS & SRS</strong><br/>Dieser Scanner kann auch Antiblockiersystem- (ABS) und Airbag- (SRS) Codes lesen. <br/><span class="text-slate-400 font-semibold">Kauflink folgt nach redaktioneller Prüfung</span></p>
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
  },
  {
    slug: 'p0300-symptome-zufallsfehlzuendung',
    title: 'P0300 Symptome: zufällige Fehlzündungen sicher diagnostizieren',
    description: 'P0300 erklärt: Symptome, sichere Weiterfahrt, Live-Daten und Tests vor dem Austausch von Zündspulen.',
    date: '2026-07-14',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `<p>P0300 bedeutet zufällige oder mehrere Zylinderfehlzündungen. Der Code ist kein direkter Auftrag zum Austausch aller Zündspulen; Luftleck, Kraftstoffdruck, Zündkerzen, Einspritzung, Kompression und Sensordaten müssen zuerst geprüft werden.</p><h2>Sicherheit</h2><p>Blinkt die Motorkontrollleuchte, sollte das Fahrzeug nicht weiter belastet werden. Ein aktiver Misfire kann den Katalysator beschädigen.</p><h2>Diagnose</h2><ol><li>Freeze-Frame speichern, bevor der Code gelöscht wird.</li><li>Fehlzündungszähler und betroffene Zylinder prüfen.</li><li>Zündung, Luftleck, Kraftstoffdruck und Kompression bestätigen.</li><li>Kraftstofftrims im Leerlauf und bei konstanter Fahrt vergleichen.</li><li>Nach der Reparatur den Fahrzyklus abschließen und prüfen, ob der Code zurückkehrt.</li></ol><p>Weiter mit <a href="/de/ford/focus/p0300" class="text-blue-400 font-bold hover:underline">Ford Focus P0300</a> und <a href="/de/toyota/camry/p0300" class="text-blue-400 font-bold hover:underline">Toyota Camry P0300</a>.</p>`
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

export function getBlogAlternates(locale: string, slug: string) {
  const currentIndex = getBlogPosts(locale).findIndex(post => post.slug === slug);
  const safeIndex = currentIndex >= 0 ? currentIndex : getBlogPosts('en').findIndex(post => post.slug === slug);

  if (safeIndex < 0) {
    return {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        en: `/en/blog/${slug}`,
        'x-default': `/en/blog/${slug}`,
      },
    };
  }

  const languages = {
    en: `/en/blog/${getBlogPosts('en')[safeIndex]?.slug || slug}`,
    de: `/de/blog/${getBlogPosts('de')[safeIndex]?.slug || slug}`,
    es: `/es/blog/${getBlogPosts('es')[safeIndex]?.slug || slug}`,
    tr: `/tr/blog/${getBlogPosts('tr')[safeIndex]?.slug || slug}`,
    fr: `/fr/blog/${getBlogPosts('fr')[safeIndex]?.slug || slug}`,
    'x-default': `/en/blog/${getBlogPosts('en')[safeIndex]?.slug || slug}`,
  };

  return {
    canonical: languages[locale as keyof typeof languages] || `/${locale}/blog/${slug}`,
    languages,
  };
}
