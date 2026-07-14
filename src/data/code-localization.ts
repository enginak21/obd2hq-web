import { getCodeSystem } from './seo';

const codeCopy = {
  tr: {
    misfireTitle: (code: string) => code === 'P0300' ? 'Rastgele / Çoklu Silindir Teklemesi Algılandı' : `${Number(code.slice(3))}. Silindirde Tekleme Algılandı`,
    misfireDescription: (code: string) => code === 'P0300'
      ? 'P0300 kodu, motor kontrol modülünün birden fazla silindirde rastgele tekleme algıladığını gösterir. Tek silindir teklemelerine göre teşhisi daha zor olabilir; çünkü kök neden çoğu zaman ateşleme, yakıt, hava kaçağı veya motor mekanik durumu gibi tüm motoru etkileyen bir sorundur.'
      : `${code} kodu, motor kontrol modülünün belirli bir silindirde tekleme algıladığını gösterir. Bu durumda buji, ateşleme bobini, enjektör, kompresyon ve ilgili kablo/soketler sırayla kontrol edilmelidir.`,
  },
  de: {
    misfireTitle: (code: string) => code === 'P0300' ? 'Zufällige / mehrere Zylinderfehlzündungen erkannt' : `Fehlzündung an Zylinder ${Number(code.slice(3))} erkannt`,
    misfireDescription: (code: string) => code === 'P0300'
      ? 'Der Code P0300 bedeutet, dass das Motorsteuergerät zufällige Fehlzündungen an mehreren Zylindern erkannt hat. Die Diagnose ist oft schwieriger als bei einem einzelnen Zylinder, weil die Ursache häufig das gesamte Motorsystem betrifft.'
      : `Der Code ${code} bedeutet, dass das Motorsteuergerät eine Fehlzündung an einem bestimmten Zylinder erkannt hat. Zündkerze, Zündspule, Einspritzventil, Kompression sowie Kabel und Stecker sollten gezielt geprüft werden.`,
  },
  es: {
    misfireTitle: (code: string) => code === 'P0300' ? 'Fallo de encendido aleatorio / en varios cilindros detectado' : `Fallo de encendido detectado en el cilindro ${Number(code.slice(3))}`,
    misfireDescription: (code: string) => code === 'P0300'
      ? 'El código P0300 indica que la computadora del motor detectó fallos de encendido aleatorios en varios cilindros. Suele ser más difícil de diagnosticar que un fallo en un solo cilindro porque la causa raíz puede afectar a todo el motor.'
      : `El código ${code} indica que la computadora del motor detectó un fallo de encendido en un cilindro específico. Deben revisarse bujía, bobina, inyector, compresión y el cableado o conector relacionado.`,
  },
  fr: {
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
  return fallback;
}

export function getLocalizedCodeDescription(code: string, locale: string, fallback: string) {
  const upperCode = code.toUpperCase();
  if (getCodeSystem(upperCode) === 'misfire' && isSupportedCopyLocale(locale)) {
    return codeCopy[locale].misfireDescription(upperCode);
  }
  return fallback;
}
