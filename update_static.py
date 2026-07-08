import json

with open('messages/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

en['AboutPage'] = {
    'title1': 'Democratizing ',
    'title2': 'Auto Repair',
    'subtitle': 'We built OBD2HQ because we believe every car owner deserves to know exactly what\'s wrong with their vehicle before paying a mechanic.',
    'mission': 'Our Mission',
    'missionDesc': 'To provide the world\'s most accurate, easily accessible, and comprehensive database of OBD-II diagnostic trouble codes.',
    'verified': 'Verified Data',
    'verifiedDesc': 'Our data is aggregated from OEM repair manuals and verified by ASE-certified master technicians.',
    'everyone': 'For Everyone',
    'everyoneDesc': 'Whether you\'re a DIY enthusiast in your garage or a professional mechanic, our platform is built for you.',
    'story': 'The Story',
    'storyP1': 'The automotive industry has traditionally kept diagnostic information locked behind expensive proprietary software subscriptions. Mechanics charge hundreds of dollars just to "plug in the scanner." We started OBD2HQ to break this monopoly.',
    'storyP2': 'By compiling data on over 48 global car manufacturers and analyzing over 10,000 specific Diagnostic Trouble Codes (DTCs), we\'ve created a search engine specifically for your car\'s brain. From a simple loose gas cap (P0456) to a catastrophic hybrid battery failure (P0A80), you now have the knowledge to fix it faster.'
}

en['ContactPage'] = {
    'title': 'Contact Us',
    'subtitle': 'Have a question about a specific diagnostic code, or found an inaccuracy in our database? Let us know.',
    'emailUs': 'Email Us',
    'name': 'Name',
    'email': 'Email',
    'message': 'Message',
    'send': 'Send Message'
}

en['DisclaimerPage'] = {
    'title': 'Medical & Technical Disclaimer',
    'warning': 'WARNING:',
    'warningText': 'Automotive repair can be dangerous and potentially fatal if performed incorrectly. Always consult a certified mechanic if you are unsure of your abilities.',
    'noAdvice': 'No Professional Advice',
    'noAdviceText': 'The information contained on OBD2HQ is provided for informational and educational purposes only. It should not be construed as professional mechanical or engineering advice. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or suitability of the diagnostic information provided.',
    'risk': 'Assumption of Risk',
    'riskText': 'Any reliance you place on such information is therefore strictly at your own risk. Working on vehicles, especially high-voltage electrical systems (Hybrid/EV) or fuel systems, carries immense risk of injury, death, or catastrophic property damage. OBD2HQ and its creators are not liable for any damages, injuries, or financial losses incurred from using our database.'
}

en['PrivacyPage'] = {
    'title': 'Privacy Policy',
    'lastUpdated': 'Last updated:',
    'h1': '1. Information Collection',
    'p1': 'OBD2HQ is a public diagnostic database. We do not require users to create an account or provide personal information to search for OBD2 codes. We may collect anonymous analytics data (such as pages visited or search queries) to improve our database accuracy.',
    'h2': '2. Cookies and Advertising',
    'p2': 'We use third-party advertising partners (such as Google AdSense) to serve ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to our website or other websites.',
    'h3': '3. Data Security',
    'p3': 'While we do not store sensitive personal information, we employ industry-standard security measures to protect the integrity of our diagnostic database and ensure a safe browsing experience.'
}

en['TermsPage'] = {
    'title': 'Terms of Service',
    'lastUpdated': 'Last updated:',
    'h1': '1. Acceptance of Terms',
    'p1': 'By accessing and using OBD2HQ, you accept and agree to be bound by the terms and provision of this agreement.',
    'h2': '2. Use of Information',
    'p2': 'The information provided on OBD2HQ is for educational and informational purposes only. We do not guarantee the absolute accuracy of the diagnostic data. Automotive repair involves inherent risks.'
}

with open('messages/en.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)


with open('messages/tr.json', 'r', encoding='utf-8') as f:
    tr = json.load(f)

tr['AboutPage'] = {
    'title1': 'Oto Tamiri ',
    'title2': 'Herkes İçin',
    'subtitle': 'OBD2HQ\'yu kurduk çünkü her araç sahibinin tamirciye para ödemeden önce aracında neyin yanlış olduğunu tam olarak bilmeyi hak ettiğine inanıyoruz.',
    'mission': 'Misyonumuz',
    'missionDesc': 'Dünyanın en doğru, kolay erişilebilir ve kapsamlı OBD-II arıza kodları veritabanını sunmak.',
    'verified': 'Doğrulanmış Veri',
    'verifiedDesc': 'Verilerimiz OEM tamir kılavuzlarından toplanmakta ve ASE sertifikalı uzman teknisyenler tarafından doğrulanmaktadır.',
    'everyone': 'Herkes İçin',
    'everyoneDesc': 'İster garajınızda kendi işini kendi yapan (DIY) bir meraklı olun, ister profesyonel bir tamirci, platformumuz sizin için tasarlandı.',
    'story': 'Hikayemiz',
    'storyP1': 'Otomotiv endüstrisi, arıza teşhis bilgilerini geleneksel olarak pahalı ve tescilli yazılım aboneliklerinin arkasında kilitli tuttu. Tamirciler sırf "tarayıcıyı bağlamak" için yüzlerce dolar talep ediyor. Bu tekeli yıkmak için OBD2HQ\'yu kurduk.',
    'storyP2': '48\'den fazla küresel otomobil üreticisinden veri derleyerek ve 10.000\'den fazla özel Arıza Teşhis Kodunu (DTC) analiz ederek, aracınızın beynine özel bir arama motoru oluşturduk. Gevşek bir gaz kapağından (P0456) feci bir hibrit batarya arızasına (P0A80) kadar, artık daha hızlı tamir etmek için gerekli bilgiye sahipsiniz.'
}

tr['ContactPage'] = {
    'title': 'İletişim',
    'subtitle': 'Belirli bir arıza koduyla ilgili sorunuz mu var veya veritabanımızda bir yanlışlık mı buldunuz? Bize bildirin.',
    'emailUs': 'Bize E-Posta Gönderin',
    'name': 'İsim',
    'email': 'E-Posta',
    'message': 'Mesajınız',
    'send': 'Mesaj Gönder'
}

tr['DisclaimerPage'] = {
    'title': 'Tıbbi ve Teknik Sorumluluk Reddi',
    'warning': 'UYARI:',
    'warningText': 'Oto tamiri yanlış yapıldığında tehlikeli ve potansiyel olarak ölümcül olabilir. Yeteneklerinizden emin değilseniz daima sertifikalı bir tamirciye danışın.',
    'noAdvice': 'Profesyonel Tavsiye Değildir',
    'noAdviceText': 'OBD2HQ\'da yer alan bilgiler yalnızca bilgilendirme ve eğitim amaçlı sunulmaktadır. Profesyonel mekanik veya mühendislik tavsiyesi olarak yorumlanmamalıdır. Bilgileri güncel ve doğru tutmaya çalışsak da, sağlanan arıza teşhis bilgilerinin eksiksizliği, doğruluğu, güvenilirliği veya uygunluğu hakkında hiçbir türden beyan veya garanti vermiyoruz.',
    'risk': 'Riskin Üstlenilmesi',
    'riskText': 'Bu tür bilgilere güvenmeniz bu nedenle kesinlikle kendi riskinizdedir. Araçlar üzerinde, özellikle yüksek voltajlı elektrik sistemlerinde (Hibrit/EV) veya yakıt sistemlerinde çalışmak muazzam yaralanma, ölüm veya felaket niteliğinde maddi hasar riski taşır. OBD2HQ ve yaratıcıları, veritabanımızı kullanmaktan kaynaklanan herhangi bir hasar, yaralanma veya finansal kayıptan sorumlu değildir.'
}

tr['PrivacyPage'] = {
    'title': 'Gizlilik Politikası',
    'lastUpdated': 'Son güncelleme:',
    'h1': '1. Bilgi Toplama',
    'p1': 'OBD2HQ halka açık bir arıza teşhis veritabanıdır. Kullanıcıların OBD2 kodlarını aramak için hesap oluşturmasını veya kişisel bilgilerini vermesini istemiyoruz. Veritabanı doğruluğumuzu artırmak için anonim analiz verileri (ziyaret edilen sayfalar veya arama sorguları gibi) toplayabiliriz.',
    'h2': '2. Çerezler ve Reklamlar',
    'p2': 'Web sitemizi ziyaret ettiğinizde reklam sunmak için üçüncü taraf reklam ortaklarını (Google AdSense gibi) kullanıyoruz. Bu şirketler, web sitemize veya diğer web sitelerine yaptığınız önceki ziyaretlere dayalı olarak reklam sunmak için çerezler kullanabilir.',
    'h3': '3. Veri Güvenliği',
    'p3': 'Hassas kişisel bilgileri saklamasak da, arıza teşhis veritabanımızın bütünlüğünü korumak ve güvenli bir gezinme deneyimi sağlamak için endüstri standardı güvenlik önlemleri uyguluyoruz.'
}

tr['TermsPage'] = {
    'title': 'Kullanım Şartları',
    'lastUpdated': 'Son güncelleme:',
    'h1': '1. Şartların Kabulü',
    'p1': 'OBD2HQ\'ya erişerek ve kullanarak, bu anlaşmanın şartlarını ve hükümlerini kabul etmiş sayılırsınız.',
    'h2': '2. Bilginin Kullanımı',
    'p2': 'OBD2HQ\'da sağlanan bilgiler yalnızca eğitim ve bilgilendirme amaçlıdır. Arıza teşhis verilerinin mutlak doğruluğunu garanti etmiyoruz. Otomotiv tamiri doğal riskler içerir.'
}

with open('messages/tr.json', 'w', encoding='utf-8') as f:
    json.dump(tr, f, indent=2, ensure_ascii=False)
