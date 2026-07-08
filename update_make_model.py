import json

with open('messages/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

en['MakePage'] = {
    'title': '{make} Diagnostics Hub',
    'desc': 'Select your {make} model below to find specific OBD2 trouble codes, dashboard warning light meanings, and step-by-step repair guides for vehicles from 1996 to 2026.',
    'selectModel': 'Select {make} Model'
}

en['ModelPage'] = {
    'years': 'Years: 1996 - 2026',
    'title': '{make} {model} Diagnostics',
    'desc': 'Comprehensive diagnostic database for all {make} {model} vehicles manufactured between 1996 and 2026.',
    'dashboardLights': 'Dashboard Warning Lights',
    'powertrain': 'Powertrain (P) Codes',
    'showing': 'Showing {start} - {end} of {total} codes',
    'prev': 'Previous',
    'next': 'Next',
    'page': 'Page',
    'of': 'of'
}

with open('messages/en.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)

with open('messages/tr.json', 'r', encoding='utf-8') as f:
    tr = json.load(f)

tr['MakePage'] = {
    'title': '{make} Arıza Teşhis Merkezi',
    'desc': '1996\'dan 2026\'ya kadar olan araçlar için özel OBD2 arıza kodlarını, gösterge paneli uyarı ışığı anlamlarını ve adım adım onarım kılavuzlarını bulmak için aşağıdan {make} modelinizi seçin.',
    'selectModel': '{make} Modelini Seçin'
}

tr['ModelPage'] = {
    'years': 'Yıllar: 1996 - 2026',
    'title': '{make} {model} Arıza Teşhisi',
    'desc': '1996 ile 2026 yılları arasında üretilen tüm {make} {model} araçlar için kapsamlı arıza teşhis veritabanı.',
    'dashboardLights': 'Gösterge Paneli Uyarı Işıkları',
    'powertrain': 'Güç Aktarma Organı (P) Kodları',
    'showing': '{total} koddan {start} - {end} arası gösteriliyor',
    'prev': 'Önceki',
    'next': 'Sonraki',
    'page': 'Sayfa',
    'of': '/'
}

with open('messages/tr.json', 'w', encoding='utf-8') as f:
    json.dump(tr, f, indent=2, ensure_ascii=False)
