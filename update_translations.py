import json

with open('messages/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

en['LightDetailPage'] = {
    'home': 'Home',
    'lights': 'Lights',
    'urgency': '{urgency} URGENCY',
    'whatItMeans': 'What does this mean on a {make} {model}?',
    'description': 'When you see the {lightName} illuminate on the dashboard of your {make} {model}, it is a direct warning from the vehicle\'s onboard computer. {description}',
    'commonCauses': 'Common Causes for {make} {model}',
    'whatToDo': 'What To Do Next'
}

with open('messages/en.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)

with open('messages/tr.json', 'r', encoding='utf-8') as f:
    tr = json.load(f)

tr['LightDetailPage'] = {
    'home': 'Anasayfa',
    'lights': 'İkaz Işıkları',
    'urgency': '{urgency} ACİLİYET',
    'whatItMeans': '{make} {model} aracında bu ne anlama geliyor?',
    'description': '{make} {model} aracınızın gösterge panelinde {lightName} ışığının yandığını gördüğünüzde, bu aracın bilgisayarından gelen doğrudan bir uyarıdır. {description}',
    'commonCauses': '{make} {model} İçin Yaygın Nedenler',
    'whatToDo': 'Ne Yapmalı'
}

with open('messages/tr.json', 'w', encoding='utf-8') as f:
    json.dump(tr, f, indent=2, ensure_ascii=False)
