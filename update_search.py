import json

with open('messages/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

en['SearchPage'] = {
    'title': 'Search Results for "{query}"',
    'codeFound': 'Diagnostic Code Found: {code}',
    'codeDesc': 'We found the standard definition for {code}: {title}. However, to give you accurate repair instructions, you must select your car manufacturer first.',
    'selectCar': 'Select your car manufacturer to view {code} details:',
    'matchingVehicles': 'Matching Vehicles',
    'noResults': 'No results found',
    'noResultsDesc': 'We couldn\'t find any OBD2 codes or car models matching "{query}". Try searching for a standard P-code like "P0420" or a car brand like "Ford".'
}

with open('messages/en.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)

with open('messages/tr.json', 'r', encoding='utf-8') as f:
    tr = json.load(f)

tr['SearchPage'] = {
    'title': '"{query}" İçin Arama Sonuçları',
    'codeFound': 'Arıza Kodu Bulundu: {code}',
    'codeDesc': '{code} için standart tanımı bulduk: {title}. Ancak, size doğru tamir talimatlarını verebilmemiz için önce araç üreticinizi seçmelisiniz.',
    'selectCar': '{code} ayrıntılarını görmek için araç üreticinizi seçin:',
    'matchingVehicles': 'Eşleşen Araçlar',
    'noResults': 'Sonuç bulunamadı',
    'noResultsDesc': '"{query}" ile eşleşen hiçbir OBD2 kodu veya araç modeli bulamadık. "P0420" gibi standart bir P-kodu veya "Ford" gibi bir araç markası aramayı deneyin.'
}

with open('messages/tr.json', 'w', encoding='utf-8') as f:
    json.dump(tr, f, indent=2, ensure_ascii=False)
