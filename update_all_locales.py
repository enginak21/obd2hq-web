import json

en = json.load(open('messages/en.json', 'r', encoding='utf-8'))

fr = {
  "Navbar": {
    "searchPlaceholder": "Rechercher un code (ex: P0420) ou une marque...",
    "makes": "Marques",
    "aboutUs": "À propos",
    "contact": "Contact",
    "blog": "Blog & Avis"
  },
  "Footer": {
    "description": "La base de données ultime pour les codes de diagnostic (DTC) et les voyants d'avertissement. Trouvez les symptômes, les causes et les solutions.",
    "links": "Liens rapides",
    "legal": "Légal"
  },
  "CodePage": {
    "whatDoesItMean": "Qu'est-ce que cela signifie ?",
    "commonCauses": "Causes courantes",
    "symptomsToWatch": "Symptômes à surveiller",
    "repairEstimate": "Estimation de réparation",
    "diyDifficulty": "Difficulté de réparation (DIY)",
    "disclaimer": "Avertissement : Ce code de diagnostic fait partie du système OBD2 standard et peut s'appliquer aux modèles {make} {model} fabriqués de 1996 à 2026. Cependant, veuillez noter que la présence de ce code dépend de la configuration exacte du moteur, des options et de l'année de production.",
    "costIncludesParts": "Comprend les pièces et la main-d'œuvre. Peut varier selon l'emplacement.",
    "home": "Accueil",
    "years": "Années"
  },
  "DB": {
    "symp_check_engine": "Le voyant moteur est allumé",
    "symp_engine_perf": "Baisse des performances du moteur",
    "symp_fuel_econ": "Baisse notable de l'économie de carburant",
    "cause_sensor": "Capteur défectueux ou câblage endommagé",
    "cause_vacuum": "Fuite de vide ou d'échappement",
    "cause_wear": "Usure des composants internes",
    "diff_moderate": "Modéré"
  },
  "MakeModel": {
    "selectMake": "Sélectionnez une marque",
    "selectModel": "Sélectionnez un modèle",
    "commonCodes": "Codes OBD2 courants pour {make}",
    "viewCodes": "Voir les codes"
  },
  "HomePage": {
    "databaseUpdated": "Base de données mise à jour : 10 000+ codes et 48 marques",
    "title1": "Décoder votre moteur.",
    "title2": "Réparez-le plus vite.",
    "subtitle": "La base de données de diagnostic OBD2 la plus complète. Trouvez des symptômes, des causes directes et des coûts de réparation en quelques secondes.",
    "mechanicVerified": "Vérifié par des mécaniciens",
    "instantSearch": "Recherche instantanée",
    "diyGuides": "Guides de réparation",
    "browseByMake": "Parcourir par fabricant",
    "selectBrand": "Sélectionnez la marque pour voir les modèles"
  },
  "BlogPage": {
    "title1": "Guides & ",
    "title2": "Avis",
    "subtitle": "Conseils d'experts, tutoriels étape par étape et avis impartiaux sur les meilleurs outils de diagnostic.",
    "readArticle": "Lire l'article"
  },
  "BlogPostPage": {
    "home": "Accueil",
    "blog": "Blog",
    "affiliateDisclaimer": "Divulgation d'affiliation :",
    "affiliateText": "Certains liens sur cette page sont des liens d'affiliation. Cela signifie que sans coût supplémentaire pour vous, OBD2HQ gagnera une commission si vous achetez via ce lien. Nous ne recommandons que les produits que nous testons personnellement."
  },
  "LightsPage": {
    "home": "Accueil",
    "lights": "Voyants",
    "title": "Voyants d'avertissement du tableau de bord",
    "subtitle": "Sélectionnez un voyant ci-dessous pour voir ce qu'il signifie sur votre {make} {model}, les causes et comment le réparer."
  },
  "LightDetailPage": {
    "home": "Accueil",
    "lights": "Voyants",
    "urgency": "URGENCE {urgency}",
    "whatItMeans": "Qu'est-ce que cela signifie sur une {make} {model} ?",
    "description": "Lorsque vous voyez {lightName} s'allumer sur le tableau de bord de votre {make} {model}, c'est un avertissement direct de l'ordinateur de bord. {description}",
    "commonCauses": "Causes courantes pour {make} {model}",
    "whatToDo": "Que faire ensuite"
  },
  "AboutPage": {
    "title1": "Démocratiser la ",
    "title2": "réparation auto",
    "subtitle": "Nous avons créé OBD2HQ parce que nous pensons que chaque propriétaire de voiture mérite de savoir exactement ce qui ne va pas avant de payer un mécanicien.",
    "mission": "Notre mission",
    "missionDesc": "Fournir la base de données de codes OBD-II la plus précise, accessible et complète au monde.",
    "verified": "Données vérifiées",
    "verifiedDesc": "Nos données sont vérifiées par des techniciens certifiés ASE.",
    "everyone": "Pour tous",
    "everyoneDesc": "Que vous soyez un passionné dans votre garage ou un professionnel, notre plateforme est pour vous.",
    "story": "L'histoire",
    "storyP1": "L'industrie a toujours gardé ces informations secrètes. Nous avons créé OBD2HQ pour briser ce monopole.",
    "storyP2": "En compilant des données sur plus de 48 constructeurs, nous avons créé un moteur de recherche pour le cerveau de votre voiture."
  },
  "ContactPage": {
    "title": "Nous contacter",
    "subtitle": "Une question sur un code ou une erreur dans la base ? Dites-le nous.",
    "emailUs": "Envoyez-nous un e-mail",
    "name": "Nom",
    "email": "E-mail",
    "message": "Message",
    "send": "Envoyer"
  },
  "DisclaimerPage": {
    "title": "Avertissement technique et médical",
    "warning": "AVERTISSEMENT :",
    "warningText": "La réparation automobile peut être dangereuse. Consultez toujours un mécanicien certifié.",
    "noAdvice": "Pas de conseil professionnel",
    "noAdviceText": "Les informations sur OBD2HQ sont fournies à titre éducatif uniquement.",
    "risk": "Prise de risque",
    "riskText": "Toute confiance accordée à ces informations est à vos propres risques."
  },
  "PrivacyPage": {
    "title": "Politique de confidentialité",
    "lastUpdated": "Dernière mise à jour :",
    "h1": "1. Collecte d'informations",
    "p1": "OBD2HQ est une base publique. Nous ne demandons pas d'informations personnelles.",
    "h2": "2. Cookies et publicité",
    "p2": "Nous utilisons des partenaires publicitaires tiers qui peuvent utiliser des cookies.",
    "h3": "3. Sécurité des données",
    "p3": "Nous utilisons des mesures standard pour protéger l'intégrité de notre base de données."
  },
  "TermsPage": {
    "title": "Conditions d'utilisation",
    "lastUpdated": "Dernière mise à jour :",
    "h1": "1. Acceptation des conditions",
    "p1": "En utilisant OBD2HQ, vous acceptez ces conditions.",
    "h2": "2. Utilisation des informations",
    "p2": "Les informations sont éducatives uniquement. Nous ne garantissons pas l'exactitude absolue."
  },
  "SearchPage": {
    "title": "Résultats pour \"{query}\"",
    "codeFound": "Code de diagnostic trouvé : {code}",
    "codeDesc": "Nous avons trouvé la définition standard de {code} : {title}. Sélectionnez votre marque pour des détails précis.",
    "selectCar": "Sélectionnez votre marque pour voir les détails de {code} :",
    "matchingVehicles": "Véhicules correspondants",
    "noResults": "Aucun résultat",
    "noResultsDesc": "Nous n'avons trouvé aucun code ou modèle correspondant à \"{query}\"."
  },
  "MakePage": {
    "title": "Centre de diagnostic {make}",
    "desc": "Sélectionnez votre modèle {make} pour trouver des codes OBD2 et des guides de réparation.",
    "selectModel": "Sélectionnez le modèle {make}"
  },
  "ModelPage": {
    "years": "Années : 1996 - 2026",
    "title": "Diagnostic {make} {model}",
    "desc": "Base de données diagnostique complète pour les véhicules {make} {model}.",
    "dashboardLights": "Voyants d'avertissement",
    "powertrain": "Codes de transmission (P)",
    "showing": "Affichage de {start} à {end} sur {total} codes",
    "prev": "Précédent",
    "next": "Suivant",
    "page": "Page",
    "of": "sur"
  }
}

es = {
  "Navbar": {
    "searchPlaceholder": "Buscar código (ej: P0420) o marca...",
    "makes": "Marcas",
    "aboutUs": "Sobre nosotros",
    "contact": "Contacto",
    "blog": "Blog y Reseñas"
  },
  "Footer": {
    "description": "La base de datos definitiva de códigos de diagnóstico (DTC) y luces de advertencia. Encuentra síntomas, causas y soluciones.",
    "links": "Enlaces rápidos",
    "legal": "Legal"
  },
  "CodePage": {
    "whatDoesItMean": "¿Qué significa esto?",
    "commonCauses": "Causas comunes",
    "symptomsToWatch": "Síntomas a tener en cuenta",
    "repairEstimate": "Estimación de reparación",
    "diyDifficulty": "Dificultad de reparación (DIY)",
    "disclaimer": "Aviso legal: Este código de diagnóstico forma parte del sistema OBD2 estándar y puede aplicarse a los modelos {make} {model} fabricados de 1996 a 2026. Sin embargo, tenga en cuenta que la presencia de este código específico depende de la configuración del motor de su vehículo, las opciones y el año de producción.",
    "costIncludesParts": "Incluye repuestos y mano de obra. Puede variar por ubicación.",
    "home": "Inicio",
    "years": "Años"
  },
  "DB": {
    "symp_check_engine": "La luz de Check Engine está encendida",
    "symp_engine_perf": "Disminución del rendimiento del motor",
    "symp_fuel_econ": "Caída notable en el ahorro de combustible",
    "cause_sensor": "Sensor defectuoso o cableado dañado",
    "cause_vacuum": "Fuga de vacío o de escape",
    "cause_wear": "Desgaste de componentes internos",
    "diff_moderate": "Moderado"
  },
  "MakeModel": {
    "selectMake": "Seleccione una marca",
    "selectModel": "Seleccione un modelo",
    "commonCodes": "Códigos OBD2 comunes para {make}",
    "viewCodes": "Ver Códigos"
  },
  "HomePage": {
    "databaseUpdated": "Base de datos actualizada: más de 10 000 códigos y 48 marcas",
    "title1": "Decodifica tu motor.",
    "title2": "Repáralo más rápido.",
    "subtitle": "La base de datos de diagnóstico OBD2 más completa. Encuentre síntomas, causas y costos de reparación en segundos.",
    "mechanicVerified": "Verificado por mecánicos",
    "instantSearch": "Búsqueda instantánea",
    "diyGuides": "Guías de reparación DIY",
    "browseByMake": "Navegar por fabricante",
    "selectBrand": "Selecciona la marca para ver los modelos"
  },
  "BlogPage": {
    "title1": "Guías y ",
    "title2": "Reseñas",
    "subtitle": "Información de expertos, tutoriales y reseñas imparciales sobre las mejores herramientas de diagnóstico.",
    "readArticle": "Leer Artículo"
  },
  "BlogPostPage": {
    "home": "Inicio",
    "blog": "Blog",
    "affiliateDisclaimer": "Divulgación de afiliados:",
    "affiliateText": "Algunos enlaces son de afiliados. Esto significa que sin costo para usted, OBD2HQ ganará una comisión si compra a través de ellos. Solo recomendamos lo que probamos personalmente."
  },
  "LightsPage": {
    "home": "Inicio",
    "lights": "Luces",
    "title": "Luces de advertencia del tablero",
    "subtitle": "Seleccione una luz para ver qué significa en su {make} {model}, causas comunes y cómo solucionarlo."
  },
  "LightDetailPage": {
    "home": "Inicio",
    "lights": "Luces",
    "urgency": "URGENCIA {urgency}",
    "whatItMeans": "¿Qué significa esto en un {make} {model}?",
    "description": "Cuando {lightName} se ilumina en su {make} {model}, es una advertencia directa de la computadora. {description}",
    "commonCauses": "Causas comunes para {make} {model}",
    "whatToDo": "Qué hacer a continuación"
  },
  "AboutPage": {
    "title1": "Democratizando la ",
    "title2": "reparación de autos",
    "subtitle": "Creamos OBD2HQ porque creemos que todo dueño de auto merece saber qué le pasa a su vehículo antes de pagarle a un mecánico.",
    "mission": "Nuestra misión",
    "missionDesc": "Proveer la base de datos de códigos OBD-II más precisa, accesible y completa del mundo.",
    "verified": "Datos verificados",
    "verifiedDesc": "Datos verificados por técnicos certificados ASE.",
    "everyone": "Para todos",
    "everyoneDesc": "Ya sea un entusiasta en su garaje o un mecánico profesional.",
    "story": "La Historia",
    "storyP1": "La industria automotriz siempre mantuvo en secreto esta información. Iniciamos OBD2HQ para romper este monopolio.",
    "storyP2": "Al recopilar datos de más de 48 fabricantes, creamos un motor de búsqueda para el cerebro de su automóvil."
  },
  "ContactPage": {
    "title": "Contáctenos",
    "subtitle": "¿Tiene una pregunta o encontró un error? Háganoslo saber.",
    "emailUs": "Envíenos un correo",
    "name": "Nombre",
    "email": "Correo",
    "message": "Mensaje",
    "send": "Enviar"
  },
  "DisclaimerPage": {
    "title": "Aviso legal médico y técnico",
    "warning": "ADVERTENCIA:",
    "warningText": "La reparación de automóviles puede ser peligrosa. Siempre consulte a un mecánico certificado.",
    "noAdvice": "Sin asesoramiento profesional",
    "noAdviceText": "La información en OBD2HQ es solo para fines educativos e informativos.",
    "risk": "Asunción de riesgos",
    "riskText": "Cualquier confianza que deposite en esta información es estrictamente bajo su propio riesgo."
  },
  "PrivacyPage": {
    "title": "Política de privacidad",
    "lastUpdated": "Última actualización:",
    "h1": "1. Recopilación de información",
    "p1": "OBD2HQ es público. No requerimos que cree una cuenta o proporcione información personal.",
    "h2": "2. Cookies y publicidad",
    "p2": "Usamos socios externos que pueden usar cookies para mostrar anuncios.",
    "h3": "3. Seguridad de los datos",
    "p3": "Empleamos medidas estándar para proteger nuestra base de datos."
  },
  "TermsPage": {
    "title": "Términos de servicio",
    "lastUpdated": "Última actualización:",
    "h1": "1. Aceptación de los términos",
    "p1": "Al usar OBD2HQ, usted acepta estos términos.",
    "h2": "2. Uso de la información",
    "p2": "La información es solo educativa. No garantizamos la exactitud absoluta de los datos."
  },
  "SearchPage": {
    "title": "Resultados de \"{query}\"",
    "codeFound": "Código encontrado: {code}",
    "codeDesc": "Encontramos la definición de {code}: {title}. Seleccione su marca para ver instrucciones precisas.",
    "selectCar": "Seleccione su fabricante para ver los detalles de {code}:",
    "matchingVehicles": "Vehículos coincidentes",
    "noResults": "No hay resultados",
    "noResultsDesc": "No pudimos encontrar códigos ni modelos que coincidan con \"{query}\"."
  },
  "MakePage": {
    "title": "Centro de Diagnóstico {make}",
    "desc": "Seleccione su modelo {make} a continuación para encontrar códigos y guías.",
    "selectModel": "Seleccione el modelo {make}"
  },
  "ModelPage": {
    "years": "Años: 1996 - 2026",
    "title": "Diagnóstico de {make} {model}",
    "desc": "Base de datos de diagnóstico completa para vehículos {make} {model}.",
    "dashboardLights": "Luces del tablero",
    "powertrain": "Códigos de tren motriz (P)",
    "showing": "Mostrando {start} - {end} de {total} códigos",
    "prev": "Anterior",
    "next": "Siguiente",
    "page": "Página",
    "of": "de"
  }
}

de = {
  "Navbar": {
    "searchPlaceholder": "Code suchen (z. B. P0420) oder Automarke...",
    "makes": "Marken",
    "aboutUs": "Über uns",
    "contact": "Kontakt",
    "blog": "Blog & Bewertungen"
  },
  "Footer": {
    "description": "Die ultimative Datenbank für Kfz-Fehlercodes (DTC) und Warnleuchten im Armaturenbrett. Finden Sie Symptome, Ursachen und Lösungen.",
    "links": "Schnelllinks",
    "legal": "Rechtliches"
  },
  "CodePage": {
    "whatDoesItMean": "Was bedeutet das?",
    "commonCauses": "Häufige Ursachen",
    "symptomsToWatch": "Zu beachtende Symptome",
    "repairEstimate": "Reparaturkosten",
    "diyDifficulty": "DIY-Schwierigkeitsgrad",
    "disclaimer": "Haftungsausschluss: Dieser Diagnosecode ist Teil des OBD2-Standards und gilt für {make} {model} Modelle von 1996 bis 2026. Bitte beachten Sie jedoch, dass dies von der genauen Motorkonfiguration abhängt.",
    "costIncludesParts": "Beinhaltet Teile und Arbeit. Kann je nach Standort variieren.",
    "home": "Startseite",
    "years": "Jahre"
  },
  "DB": {
    "symp_check_engine": "Motorkontrollleuchte leuchtet",
    "symp_engine_perf": "Verringerte Motorleistung",
    "symp_fuel_econ": "Spürbarer Rückgang des Kraftstoffverbrauchs",
    "cause_sensor": "Defekter Sensor oder beschädigte Verkabelung",
    "cause_vacuum": "Vakuum- oder Auspuffleck",
    "cause_wear": "Verschleiß interner Komponenten",
    "diff_moderate": "Moderat"
  },
  "MakeModel": {
    "selectMake": "Wählen Sie eine Marke",
    "selectModel": "Wählen Sie ein Modell",
    "commonCodes": "Häufige OBD2-Codes für {make}",
    "viewCodes": "Codes anzeigen"
  },
  "HomePage": {
    "databaseUpdated": "Datenbank aktualisiert: 10.000+ Codes & 48 Marken",
    "title1": "Entschlüssele deinen Motor.",
    "title2": "Repariere ihn schneller.",
    "subtitle": "Die umfassendste und genaueste OBD2-Diagnosedatenbank. Finden Sie Symptome, Ursachen und Reparaturkosten in Sekunden.",
    "mechanicVerified": "Vom Mechaniker verifiziert",
    "instantSearch": "Sofortsuche",
    "diyGuides": "DIY-Reparaturanleitungen",
    "browseByMake": "Nach Hersteller durchsuchen",
    "selectBrand": "Wählen Sie Ihre Automarke"
  },
  "BlogPage": {
    "title1": "Ratgeber & ",
    "title2": "Bewertungen",
    "subtitle": "Experteneinblicke, Schritt-für-Schritt-Anleitungen und unvoreingenommene Bewertungen.",
    "readArticle": "Artikel lesen"
  },
  "BlogPostPage": {
    "home": "Startseite",
    "blog": "Blog",
    "affiliateDisclaimer": "Affiliate-Offenlegung:",
    "affiliateText": "Einige Links sind Affiliate-Links. Das bedeutet, dass OBD2HQ eine Provision verdient, wenn Sie kaufen, ohne zusätzliche Kosten für Sie."
  },
  "LightsPage": {
    "home": "Startseite",
    "lights": "Warnleuchten",
    "title": "Warnleuchten im Armaturenbrett",
    "subtitle": "Wählen Sie unten eine Warnleuchte aus, um zu sehen, was sie in Ihrem {make} {model} bedeutet."
  },
  "LightDetailPage": {
    "home": "Startseite",
    "lights": "Warnleuchten",
    "urgency": "{urgency} DRINGLICHKEIT",
    "whatItMeans": "Was bedeutet das bei einem {make} {model}?",
    "description": "Wenn {lightName} auf dem Armaturenbrett Ihres {make} {model} aufleuchtet, ist das eine Warnung. {description}",
    "commonCauses": "Häufige Ursachen für {make} {model}",
    "whatToDo": "Was als nächstes zu tun ist"
  },
  "AboutPage": {
    "title1": "Demokratisierung der ",
    "title2": "Autoreparatur",
    "subtitle": "Wir haben OBD2HQ entwickelt, weil jeder Autobesitzer wissen sollte, was los ist, bevor er bezahlt.",
    "mission": "Unsere Mission",
    "missionDesc": "Die genaueste OBD-II-Datenbank der Welt bereitzustellen.",
    "verified": "Verifizierte Daten",
    "verifiedDesc": "Unsere Daten werden von zertifizierten Technikern verifiziert.",
    "everyone": "Für jeden",
    "everyoneDesc": "Egal ob DIY-Enthusiast oder professioneller Mechaniker.",
    "story": "Die Geschichte",
    "storyP1": "Mechaniker verlangen Hunderte von Dollar, nur um den Scanner anzuschließen. Wir brechen dieses Monopol.",
    "storyP2": "Wir haben Daten von über 48 Herstellern zusammengestellt."
  },
  "ContactPage": {
    "title": "Kontaktiere uns",
    "subtitle": "Haben Sie eine Frage oder einen Fehler gefunden? Lass es uns wissen.",
    "emailUs": "Schreiben Sie uns",
    "name": "Name",
    "email": "E-Mail",
    "message": "Nachricht",
    "send": "Senden"
  },
  "DisclaimerPage": {
    "title": "Medizinischer und technischer Haftungsausschluss",
    "warning": "WARNUNG:",
    "warningText": "Autoreparaturen können gefährlich sein. Konsultieren Sie immer einen Mechaniker.",
    "noAdvice": "Keine professionelle Beratung",
    "noAdviceText": "Informationen dienen nur zu Bildungszwecken.",
    "risk": "Risikoübernahme",
    "riskText": "Jedes Vertrauen in diese Informationen erfolgt auf eigenes Risiko."
  },
  "PrivacyPage": {
    "title": "Datenschutzrichtlinie",
    "lastUpdated": "Zuletzt aktualisiert:",
    "h1": "1. Informationssammlung",
    "p1": "Wir verlangen nicht, dass Sie persönliche Daten angeben.",
    "h2": "2. Cookies und Werbung",
    "p2": "Wir verwenden Werbepartner, die Cookies verwenden können.",
    "h3": "3. Datensicherheit",
    "p3": "Wir verwenden Standardmaßnahmen zum Schutz unserer Datenbank."
  },
  "TermsPage": {
    "title": "Nutzungsbedingungen",
    "lastUpdated": "Zuletzt aktualisiert:",
    "h1": "1. Annahme der Bedingungen",
    "p1": "Durch die Nutzung von OBD2HQ akzeptieren Sie diese Bedingungen.",
    "h2": "2. Nutzung von Informationen",
    "p2": "Die Informationen dienen nur zu Bildungszwecken."
  },
  "SearchPage": {
    "title": "Suchergebnisse für \"{query}\"",
    "codeFound": "Diagnosecode gefunden: {code}",
    "codeDesc": "Wir haben die Definition für {code} gefunden: {title}. Wählen Sie Ihre Marke aus.",
    "selectCar": "Wählen Sie Ihren Hersteller aus, um Details zu {code} anzuzeigen:",
    "matchingVehicles": "Passende Fahrzeuge",
    "noResults": "Keine Ergebnisse",
    "noResultsDesc": "Wir konnten keine passenden OBD2-Codes für \"{query}\" finden."
  },
  "MakePage": {
    "title": "{make} Diagnosezentrum",
    "desc": "Wählen Sie Ihr {make} Modell aus, um Codes und Anleitungen zu finden.",
    "selectModel": "Wählen Sie das {make} Modell"
  },
  "ModelPage": {
    "years": "Jahre: 1996 - 2026",
    "title": "{make} {model} Diagnose",
    "desc": "Umfassende Diagnosedatenbank für alle {make} {model} Fahrzeuge.",
    "dashboardLights": "Warnleuchten im Armaturenbrett",
    "powertrain": "Antriebsstrang (P) Codes",
    "showing": "Zeige {start} - {end} von {total} Codes",
    "prev": "Vorherige",
    "next": "Nächste",
    "page": "Seite",
    "of": "von"
  }
}

json.dump(fr, open('messages/fr.json', 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
json.dump(es, open('messages/es.json', 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
json.dump(de, open('messages/de.json', 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
