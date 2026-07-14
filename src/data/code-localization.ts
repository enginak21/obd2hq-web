import { getCodeSystem } from './seo';

const codeCopy = {
  tr: {
    catalystTitle: (code: string) => code === 'P0430' ? 'Katalizör Sistemi Verimi Eşik Değerin Altında (Bank 2)' : 'Katalizör Sistemi Verimi Eşik Değerin Altında (Bank 1)',
    catalystDescription: (code: string) => `${code} kodu, motor kontrol modülünün katalizörün egzoz gazlarını beklenen verimle temizlemediğini düşündüğünü gösterir. Bu her zaman katalizörün bozuk olduğu anlamına gelmez; oksijen sensörü, egzoz kaçağı, yakıt karışımı veya tekleme geçmişi önce kontrol edilmelidir.`,
    genericTitle: (code: string) => `${code} OBD2 Arıza Kodu`,
    genericDescription: (code: string) => `${code} standart bir OBD2 arıza kodudur. Parça değiştirmeden önce freeze-frame verisi, canlı veri, kablo/soket durumu ve ilişkili kodlarla kök nedeni doğrulayın.`,
    misfireTitle: (code: string) => code === 'P0300' ? 'Rastgele / Çoklu Silindir Teklemesi Algılandı' : `${Number(code.slice(3))}. Silindirde Tekleme Algılandı`,
    misfireDescription: (code: string) => code === 'P0300'
      ? 'P0300 kodu, motor kontrol modülünün birden fazla silindirde rastgele tekleme algıladığını gösterir. Tek silindir teklemelerine göre teşhisi daha zor olabilir; çünkü kök neden çoğu zaman ateşleme, yakıt, hava kaçağı veya motor mekanik durumu gibi tüm motoru etkileyen bir sorundur.'
      : `${code} kodu, motor kontrol modülünün belirli bir silindirde tekleme algıladığını gösterir. Bu durumda buji, ateşleme bobini, enjektör, kompresyon ve ilgili kablo/soketler sırayla kontrol edilmelidir.`,
  },
  de: {
    catalystTitle: (code: string) => code === 'P0430' ? 'Katalysatorsystem Wirkungsgrad unter Schwellenwert (Bank 2)' : 'Katalysatorsystem Wirkungsgrad unter Schwellenwert (Bank 1)',
    catalystDescription: (code: string) => `${code} bedeutet, dass das Motorsteuergerät annimmt, dass der Katalysator die Abgase nicht mehr mit der erwarteten Effizienz reinigt. Das heißt nicht automatisch, dass der Katalysator defekt ist; Sauerstoffsensoren, Abgaslecks, Kraftstoffgemisch und Fehlzündungen sollten zuerst geprüft werden.`,
    genericTitle: (code: string) => `${code} OBD2-Fehlercode`,
    genericDescription: (code: string) => `${code} ist ein standardisierter OBD2-Fehlercode. Prüfen Sie Freeze-Frame-Daten, Live-Daten, Kabel, Stecker und verwandte Codes, bevor Sie Teile ersetzen.`,
    misfireTitle: (code: string) => code === 'P0300' ? 'Zufällige / mehrere Zylinderfehlzündungen erkannt' : `Fehlzündung an Zylinder ${Number(code.slice(3))} erkannt`,
    misfireDescription: (code: string) => code === 'P0300'
      ? 'Der Code P0300 bedeutet, dass das Motorsteuergerät zufällige Fehlzündungen an mehreren Zylindern erkannt hat. Die Diagnose ist oft schwieriger als bei einem einzelnen Zylinder, weil die Ursache häufig das gesamte Motorsystem betrifft.'
      : `Der Code ${code} bedeutet, dass das Motorsteuergerät eine Fehlzündung an einem bestimmten Zylinder erkannt hat. Zündkerze, Zündspule, Einspritzventil, Kompression sowie Kabel und Stecker sollten gezielt geprüft werden.`,
  },
  es: {
    catalystTitle: (code: string) => code === 'P0430' ? 'Eficiencia del sistema catalizador por debajo del umbral (Banco 2)' : 'Eficiencia del sistema catalizador por debajo del umbral (Banco 1)',
    catalystDescription: (code: string) => `${code} indica que la computadora del motor cree que el catalizador ya no limpia los gases de escape con la eficiencia esperada. No significa automáticamente que el catalizador esté dañado; primero deben revisarse sensores de oxígeno, fugas de escape, mezcla de combustible e historial de fallos de encendido.`,
    genericTitle: (code: string) => `Código OBD2 ${code}`,
    genericDescription: (code: string) => `${code} es un código de diagnóstico OBD2 estándar. Antes de reemplazar piezas, confirme la causa raíz con datos freeze-frame, datos en vivo, cableado, conectores y códigos relacionados.`,
    misfireTitle: (code: string) => code === 'P0300' ? 'Fallo de encendido aleatorio / en varios cilindros detectado' : `Fallo de encendido detectado en el cilindro ${Number(code.slice(3))}`,
    misfireDescription: (code: string) => code === 'P0300'
      ? 'El código P0300 indica que la computadora del motor detectó fallos de encendido aleatorios en varios cilindros. Suele ser más difícil de diagnosticar que un fallo en un solo cilindro porque la causa raíz puede afectar a todo el motor.'
      : `El código ${code} indica que la computadora del motor detectó un fallo de encendido en un cilindro específico. Deben revisarse bujía, bobina, inyector, compresión y el cableado o conector relacionado.`,
  },
  fr: {
    catalystTitle: (code: string) => code === 'P0430' ? 'Efficacité du système catalytique sous le seuil (Banc 2)' : 'Efficacité du système catalytique sous le seuil (Banc 1)',
    catalystDescription: (code: string) => `${code} indique que le calculateur moteur estime que le catalyseur ne nettoie plus les gaz d’échappement avec l’efficacité attendue. Cela ne signifie pas automatiquement que le catalyseur est défectueux ; les sondes oxygène, les fuites d’échappement, le mélange carburant et l’historique des ratés doivent être vérifiés d’abord.`,
    genericTitle: (code: string) => `Code OBD2 ${code}`,
    genericDescription: (code: string) => `${code} est un code de diagnostic OBD2 standard. Avant de remplacer des pièces, confirmez la cause avec les données freeze-frame, les données en direct, le câblage, les connecteurs et les codes associés.`,
    misfireTitle: (code: string) => code === 'P0300' ? 'Ratés d’allumage aléatoires / multiples cylindres détectés' : `Raté d’allumage détecté sur le cylindre ${Number(code.slice(3))}`,
    misfireDescription: (code: string) => code === 'P0300'
      ? 'Le code P0300 indique que le calculateur moteur a détecté des ratés d’allumage aléatoires sur plusieurs cylindres. Le diagnostic est souvent plus difficile qu’un raté sur un seul cylindre, car la cause peut toucher l’ensemble du moteur.'
      : `Le code ${code} indique que le calculateur moteur a détecté un raté d’allumage sur un cylindre précis. Bougie, bobine, injecteur, compression, câblage et connecteur doivent être contrôlés méthodiquement.`,
  },
} as const;

type SupportedCopyLocale = keyof typeof codeCopy;

function isSupportedCopyLocale(locale: string): locale is SupportedCopyLocale {
  return locale === 'tr' || locale === 'de' || locale === 'es' || locale === 'fr';
}

export function getLocalizedCodeTitle(code: string, locale: string, fallback: string) {
  const upperCode = code.toUpperCase();
  if (getCodeSystem(upperCode) === 'misfire' && isSupportedCopyLocale(locale)) {
    return codeCopy[locale].misfireTitle(upperCode);
  }
  if (getCodeSystem(upperCode) === 'catalyst' && isSupportedCopyLocale(locale)) {
    return codeCopy[locale].catalystTitle(upperCode);
  }
  if (locale !== 'en' && isSupportedCopyLocale(locale)) {
    return codeCopy[locale].genericTitle(upperCode);
  }
  return fallback;
}

export function getLocalizedCodeDescription(code: string, locale: string, fallback: string) {
  const upperCode = code.toUpperCase();
  if (getCodeSystem(upperCode) === 'misfire' && isSupportedCopyLocale(locale)) {
    return codeCopy[locale].misfireDescription(upperCode);
  }
  if (getCodeSystem(upperCode) === 'catalyst' && isSupportedCopyLocale(locale)) {
    return codeCopy[locale].catalystDescription(upperCode);
  }
  if (locale !== 'en' && isSupportedCopyLocale(locale)) {
    return codeCopy[locale].genericDescription(upperCode);
  }
  return fallback;
}
