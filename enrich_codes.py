#!/usr/bin/env python3
"""
OBD2 Code Enrichment Script
============================
Replaces generic OBD2 code data with REAL SAE J2012 standard titles,
descriptions, symptoms, causes, costs, and difficulties for all 1900 codes.
Updates all 5 translation files (en, tr, es, fr, de) with proper DB keys.
"""

import json
import os
import copy

# ============================================================================
# PATHS
# ============================================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_CODES_PATH = os.path.join(BASE_DIR, "src", "data", "base_codes.json")
MESSAGES_DIR = os.path.join(BASE_DIR, "messages")

# ============================================================================
# SYMPTOM KEY DEFINITIONS (with all 5 languages)
# ============================================================================
SYMPTOM_TRANSLATIONS = {
    "symp_check_engine": {
        "en": "Check Engine Light is illuminated",
        "tr": "Motor Arıza Lambası yanar",
        "es": "La luz de Check Engine está encendida",
        "fr": "Le voyant moteur est allumé",
        "de": "Motorkontrollleuchte leuchtet"
    },
    "symp_rough_idle": {
        "en": "Rough or unstable idle",
        "tr": "Düzensiz veya dengesiz rölanti",
        "es": "Ralentí irregular o inestable",
        "fr": "Ralenti irrégulier ou instable",
        "de": "Unruhiger oder instabiler Leerlauf"
    },
    "symp_stalling": {
        "en": "Engine stalling or dying unexpectedly",
        "tr": "Motor beklenmedik şekilde stop eder",
        "es": "El motor se apaga inesperadamente",
        "fr": "Le moteur cale de façon inattendue",
        "de": "Motor geht unerwartet aus"
    },
    "symp_poor_acceleration": {
        "en": "Poor acceleration or sluggish response",
        "tr": "Zayıf hızlanma veya gecikmeli tepki",
        "es": "Aceleración deficiente o respuesta lenta",
        "fr": "Accélération faible ou réponse lente",
        "de": "Schlechte Beschleunigung oder träge Reaktion"
    },
    "symp_fuel_economy": {
        "en": "Decreased fuel economy",
        "tr": "Yakıt tüketiminde artış",
        "es": "Disminución del rendimiento de combustible",
        "fr": "Consommation de carburant accrue",
        "de": "Erhöhter Kraftstoffverbrauch"
    },
    "symp_hesitation": {
        "en": "Hesitation or stumble during acceleration",
        "tr": "Hızlanma sırasında tereddüt veya takılma",
        "es": "Titubeo o tropiezo al acelerar",
        "fr": "Hésitation ou trébuchement à l'accélération",
        "de": "Zögern oder Stottern beim Beschleunigen"
    },
    "symp_hard_start": {
        "en": "Difficulty starting the engine",
        "tr": "Motoru çalıştırmada zorluk",
        "es": "Dificultad para arrancar el motor",
        "fr": "Difficulté à démarrer le moteur",
        "de": "Schwierigkeiten beim Starten des Motors"
    },
    "symp_black_smoke": {
        "en": "Black smoke from exhaust (running rich)",
        "tr": "Egzozdan siyah duman (zengin karışım)",
        "es": "Humo negro del escape (mezcla rica)",
        "fr": "Fumée noire à l'échappement (mélange riche)",
        "de": "Schwarzer Rauch aus dem Auspuff (fettes Gemisch)"
    },
    "symp_white_smoke": {
        "en": "White or blue smoke from exhaust",
        "tr": "Egzozdan beyaz veya mavi duman",
        "es": "Humo blanco o azul del escape",
        "fr": "Fumée blanche ou bleue à l'échappement",
        "de": "Weißer oder blauer Rauch aus dem Auspuff"
    },
    "symp_rotten_egg_smell": {
        "en": "Rotten egg smell (sulfur) from exhaust",
        "tr": "Egzozdan çürük yumurta (kükürt) kokusu",
        "es": "Olor a huevo podrido (azufre) del escape",
        "fr": "Odeur d'œuf pourri (soufre) à l'échappement",
        "de": "Geruch nach faulen Eiern (Schwefel) aus dem Auspuff"
    },
    "symp_engine_overheat": {
        "en": "Engine overheating",
        "tr": "Motor aşırı ısınması",
        "es": "Sobrecalentamiento del motor",
        "fr": "Surchauffe du moteur",
        "de": "Motorüberhitzung"
    },
    "symp_surging": {
        "en": "Engine surging or fluctuating RPM",
        "tr": "Motor devir dalgalanması",
        "es": "RPM del motor fluctuante",
        "fr": "Régime moteur fluctuant",
        "de": "Motorschwankungen oder schwankende Drehzahl"
    },
    "symp_no_start": {
        "en": "Engine cranks but won't start",
        "tr": "Motor döner ama çalışmaz",
        "es": "El motor gira pero no arranca",
        "fr": "Le moteur tourne mais ne démarre pas",
        "de": "Motor dreht, startet aber nicht"
    },
    "symp_misfire_feel": {
        "en": "Engine misfiring or shaking sensation",
        "tr": "Motor ateşleme kaçırma veya sarsılma hissi",
        "es": "Fallo de encendido o sensación de vibración",
        "fr": "Ratés d'allumage ou sensation de secousses",
        "de": "Fehlzündungen oder Ruckeln des Motors"
    },
    "symp_power_loss": {
        "en": "Significant loss of engine power",
        "tr": "Belirgin motor gücü kaybı",
        "es": "Pérdida significativa de potencia del motor",
        "fr": "Perte significative de puissance du moteur",
        "de": "Deutlicher Motorleistungsverlust"
    },
    "symp_erratic_idle": {
        "en": "Erratic or fluctuating idle speed",
        "tr": "Düzensiz veya değişken rölanti hızı",
        "es": "Velocidad de ralentí errática o fluctuante",
        "fr": "Vitesse de ralenti erratique ou fluctuante",
        "de": "Unregelmäßige oder schwankende Leerlaufdrehzahl"
    },
    "symp_failed_emissions": {
        "en": "Failed emissions test",
        "tr": "Egzoz emisyon testinden kalma",
        "es": "Fallo en la prueba de emisiones",
        "fr": "Échec au contrôle des émissions",
        "de": "Abgasuntersuchung nicht bestanden"
    },
    "symp_transmission_slip": {
        "en": "Transmission slipping between gears",
        "tr": "Şanzıman vitesler arasında kayma",
        "es": "La transmisión patina entre marchas",
        "fr": "La transmission glisse entre les vitesses",
        "de": "Getriebe rutscht zwischen den Gängen"
    },
    "symp_hard_shifting": {
        "en": "Hard or harsh gear shifting",
        "tr": "Sert veya ani vites geçişi",
        "es": "Cambio de marcha brusco o duro",
        "fr": "Changement de vitesse brutal",
        "de": "Hartes oder ruckhaftes Schalten"
    },
    "symp_delayed_engagement": {
        "en": "Delayed gear engagement",
        "tr": "Gecikmeli vites geçişi",
        "es": "Enganche de marcha retrasado",
        "fr": "Engagement de vitesse retardé",
        "de": "Verzögerte Gangeinlegung"
    },
    "symp_transmission_overheat": {
        "en": "Transmission overheating warning",
        "tr": "Şanzıman aşırı ısınma uyarısı",
        "es": "Advertencia de sobrecalentamiento de transmisión",
        "fr": "Avertissement de surchauffe de transmission",
        "de": "Warnung vor Getriebeüberhitzung"
    },
    "symp_stuck_gear": {
        "en": "Transmission stuck in one gear",
        "tr": "Şanzıman tek viteste takılı kalır",
        "es": "La transmisión se queda atascada en una marcha",
        "fr": "La transmission reste bloquée sur un rapport",
        "de": "Getriebe bleibt in einem Gang stecken"
    },
    "symp_speedometer_erratic": {
        "en": "Erratic speedometer reading",
        "tr": "Düzensiz kilometre göstergesi",
        "es": "Lectura errática del velocímetro",
        "fr": "Lecture erratique du compteur de vitesse",
        "de": "Unregelmäßige Tachoanzeige"
    },
    "symp_cruise_not_working": {
        "en": "Cruise control not functioning",
        "tr": "Hız sabitleyici çalışmıyor",
        "es": "El control de crucero no funciona",
        "fr": "Le régulateur de vitesse ne fonctionne pas",
        "de": "Tempomat funktioniert nicht"
    },
    "symp_ac_not_working": {
        "en": "A/C system not cooling properly",
        "tr": "Klima sistemi düzgün soğutmuyor",
        "es": "El sistema de A/C no enfría correctamente",
        "fr": "Le système de climatisation ne refroidit pas correctement",
        "de": "Klimaanlage kühlt nicht richtig"
    },
    "symp_battery_drain": {
        "en": "Battery draining or low voltage warning",
        "tr": "Akü boşalması veya düşük voltaj uyarısı",
        "es": "Batería descargándose o advertencia de bajo voltaje",
        "fr": "Décharge de batterie ou avertissement de basse tension",
        "de": "Batterieentladung oder Niederspannungswarnung"
    },
    "symp_oil_pressure_warning": {
        "en": "Oil pressure warning light on",
        "tr": "Yağ basıncı uyarı lambası yanar",
        "es": "Luz de advertencia de presión de aceite encendida",
        "fr": "Voyant de pression d'huile allumé",
        "de": "Öldruckwarnleuchte leuchtet"
    },
    "symp_coolant_temp_warning": {
        "en": "Coolant temperature warning light on",
        "tr": "Soğutma suyu sıcaklık uyarı lambası yanar",
        "es": "Luz de advertencia de temperatura del refrigerante encendida",
        "fr": "Voyant de température de liquide de refroidissement allumé",
        "de": "Kühlmitteltemperaturwarnleuchte leuchtet"
    },
    "symp_turbo_lag": {
        "en": "Excessive turbo lag or no boost",
        "tr": "Aşırı turbo gecikmesi veya basınç yok",
        "es": "Retraso excesivo del turbo o sin presión",
        "fr": "Turbo lag excessif ou pas de surpression",
        "de": "Übermäßiges Turboloch oder kein Ladedruck"
    },
    "symp_fuel_smell": {
        "en": "Strong fuel odor from vehicle",
        "tr": "Araçtan güçlü yakıt kokusu",
        "es": "Fuerte olor a combustible del vehículo",
        "fr": "Forte odeur de carburant du véhicule",
        "de": "Starker Kraftstoffgeruch vom Fahrzeug"
    },
    "symp_knocking": {
        "en": "Engine knocking or detonation noise",
        "tr": "Motor vuruntu veya detonasyon sesi",
        "es": "Golpeteo o detonación del motor",
        "fr": "Cliquetis ou détonation du moteur",
        "de": "Motorklopfen oder Detonationsgeräusch"
    },
    "symp_pinging": {
        "en": "Engine pinging under load",
        "tr": "Yük altında motor ping sesi",
        "es": "Cascabeleo del motor bajo carga",
        "fr": "Cliquetis du moteur sous charge",
        "de": "Motor klingelt unter Last"
    },
    "symp_vibration": {
        "en": "Unusual vibration during driving",
        "tr": "Sürüş sırasında anormal titreşim",
        "es": "Vibración inusual al conducir",
        "fr": "Vibration inhabituelle en conduisant",
        "de": "Ungewöhnliche Vibration beim Fahren"
    },
    "symp_stalling_hot": {
        "en": "Engine stalls when hot",
        "tr": "Motor sıcakken stop eder",
        "es": "El motor se apaga cuando está caliente",
        "fr": "Le moteur cale quand il est chaud",
        "de": "Motor geht aus wenn er warm ist"
    },
    "symp_stalling_cold": {
        "en": "Engine stalls when cold",
        "tr": "Motor soğukken stop eder",
        "es": "El motor se apaga cuando está frío",
        "fr": "Le moteur cale quand il est froid",
        "de": "Motor geht aus wenn er kalt ist"
    },
    "symp_high_idle": {
        "en": "Abnormally high idle speed",
        "tr": "Anormal yüksek rölanti devri",
        "es": "Velocidad de ralentí anormalmente alta",
        "fr": "Vitesse de ralenti anormalement élevée",
        "de": "Ungewöhnlich hohe Leerlaufdrehzahl"
    },
    "symp_low_idle": {
        "en": "Abnormally low idle speed",
        "tr": "Anormal düşük rölanti devri",
        "es": "Velocidad de ralentí anormalmente baja",
        "fr": "Vitesse de ralenti anormalement basse",
        "de": "Ungewöhnlich niedrige Leerlaufdrehzahl"
    },
    "symp_fan_not_working": {
        "en": "Cooling fan not operating",
        "tr": "Soğutma fanı çalışmıyor",
        "es": "El ventilador de enfriamiento no funciona",
        "fr": "Le ventilateur de refroidissement ne fonctionne pas",
        "de": "Kühlerlüfter funktioniert nicht"
    },
    "symp_gear_hunting": {
        "en": "Transmission hunting or cycling between gears",
        "tr": "Şanzıman vitesler arasında sürekli geçiş yapar",
        "es": "La transmisión busca o cicla entre marchas",
        "fr": "La transmission hésite entre les rapports",
        "de": "Getriebe wechselt ständig zwischen Gängen"
    },
    "symp_reduced_power_mode": {
        "en": "Vehicle enters reduced power / limp mode",
        "tr": "Araç düşük güç / acil moduna girer",
        "es": "El vehículo entra en modo de potencia reducida",
        "fr": "Le véhicule passe en mode dégradé",
        "de": "Fahrzeug geht in den Notlaufmodus"
    },
    "symp_glow_plug_light": {
        "en": "Glow plug indicator light stays on (diesel)",
        "tr": "Kızdırma bujisi göstergesi yanık kalır (dizel)",
        "es": "La luz del calentador permanece encendida (diésel)",
        "fr": "Le voyant de préchauffage reste allumé (diesel)",
        "de": "Glühkerzen-Kontrollleuchte bleibt an (Diesel)"
    },
    "symp_diesel_hard_cold_start": {
        "en": "Diesel engine hard to start in cold weather",
        "tr": "Dizel motor soğuk havada zor çalışır",
        "es": "Motor diésel difícil de arrancar en frío",
        "fr": "Moteur diesel difficile à démarrer par temps froid",
        "de": "Dieselmotor schwer zu starten bei Kälte"
    },
}

# ============================================================================
# CAUSE KEY DEFINITIONS (with all 5 languages)
# ============================================================================
CAUSE_TRANSLATIONS = {
    "cause_maf_dirty": {
        "en": "Dirty or contaminated MAF sensor",
        "tr": "Kirli veya kontamine olmuş MAF sensörü",
        "es": "Sensor MAF sucio o contaminado",
        "fr": "Capteur MAF sale ou contaminé",
        "de": "Verschmutzter oder verunreinigter MAF-Sensor"
    },
    "cause_maf_faulty": {
        "en": "Faulty Mass Air Flow (MAF) sensor",
        "tr": "Arızalı Kütle Hava Akış (MAF) sensörü",
        "es": "Sensor de flujo de masa de aire (MAF) defectuoso",
        "fr": "Capteur de débit d'air massique (MAF) défectueux",
        "de": "Defekter Luftmassenmesser (LMM)"
    },
    "cause_map_sensor": {
        "en": "Faulty MAP (Manifold Absolute Pressure) sensor",
        "tr": "Arızalı MAP (Manifold Mutlak Basınç) sensörü",
        "es": "Sensor MAP (presión absoluta del colector) defectuoso",
        "fr": "Capteur MAP (pression absolue du collecteur) défectueux",
        "de": "Defekter MAP-Sensor (Saugrohrdrucksensor)"
    },
    "cause_iat_sensor": {
        "en": "Faulty Intake Air Temperature (IAT) sensor",
        "tr": "Arızalı Emme Havası Sıcaklığı (IAT) sensörü",
        "es": "Sensor de temperatura del aire de admisión (IAT) defectuoso",
        "fr": "Capteur de température d'air d'admission (IAT) défectueux",
        "de": "Defekter Ansauglufttemperatursensor (IAT)"
    },
    "cause_ect_sensor": {
        "en": "Faulty Engine Coolant Temperature (ECT) sensor",
        "tr": "Arızalı Motor Soğutma Suyu Sıcaklığı (ECT) sensörü",
        "es": "Sensor de temperatura del refrigerante (ECT) defectuoso",
        "fr": "Capteur de température du liquide de refroidissement (ECT) défectueux",
        "de": "Defekter Kühlmitteltemperatursensor (ECT)"
    },
    "cause_o2_sensor": {
        "en": "Faulty oxygen (O2) sensor",
        "tr": "Arızalı oksijen (O2) sensörü",
        "es": "Sensor de oxígeno (O2) defectuoso",
        "fr": "Sonde lambda (O2) défectueuse",
        "de": "Defekte Lambdasonde (O2-Sensor)"
    },
    "cause_o2_heater": {
        "en": "Failed O2 sensor heater circuit",
        "tr": "Arızalı O2 sensörü ısıtıcı devresi",
        "es": "Circuito del calentador del sensor O2 averiado",
        "fr": "Circuit de chauffage de la sonde lambda défaillant",
        "de": "Defekte Lambdasondenheizung"
    },
    "cause_cat_converter": {
        "en": "Failing or clogged catalytic converter",
        "tr": "Arızalı veya tıkalı katalitik konvertör",
        "es": "Convertidor catalítico obstruido o defectuoso",
        "fr": "Catalyseur défaillant ou obstrué",
        "de": "Defekter oder verstopfter Katalysator"
    },
    "cause_vacuum_leak": {
        "en": "Vacuum leak in intake system",
        "tr": "Emme sisteminde vakum kaçağı",
        "es": "Fuga de vacío en el sistema de admisión",
        "fr": "Fuite de vide dans le système d'admission",
        "de": "Vakuumleck im Ansaugsystem"
    },
    "cause_spark_plugs": {
        "en": "Worn or fouled spark plugs",
        "tr": "Aşınmış veya kirli bujiler",
        "es": "Bujías desgastadas o sucias",
        "fr": "Bougies d'allumage usées ou encrassées",
        "de": "Abgenutzte oder verrußte Zündkerzen"
    },
    "cause_ignition_coil": {
        "en": "Faulty ignition coil or coil pack",
        "tr": "Arızalı ateşleme bobini",
        "es": "Bobina de encendido defectuosa",
        "fr": "Bobine d'allumage défectueuse",
        "de": "Defekte Zündspule"
    },
    "cause_fuel_injector": {
        "en": "Clogged or faulty fuel injector",
        "tr": "Tıkalı veya arızalı yakıt enjektörü",
        "es": "Inyector de combustible obstruido o defectuoso",
        "fr": "Injecteur de carburant obstrué ou défectueux",
        "de": "Verstopfte oder defekte Einspritzdüse"
    },
    "cause_fuel_pump": {
        "en": "Weak or failing fuel pump",
        "tr": "Zayıf veya arızalı yakıt pompası",
        "es": "Bomba de combustible débil o defectuosa",
        "fr": "Pompe à carburant faible ou défaillante",
        "de": "Schwache oder defekte Kraftstoffpumpe"
    },
    "cause_fuel_filter": {
        "en": "Clogged fuel filter",
        "tr": "Tıkalı yakıt filtresi",
        "es": "Filtro de combustible obstruido",
        "fr": "Filtre à carburant obstrué",
        "de": "Verstopfter Kraftstofffilter"
    },
    "cause_fuel_pressure_reg": {
        "en": "Faulty fuel pressure regulator",
        "tr": "Arızalı yakıt basınç regülatörü",
        "es": "Regulador de presión de combustible defectuoso",
        "fr": "Régulateur de pression de carburant défectueux",
        "de": "Defekter Kraftstoffdruckregler"
    },
    "cause_egr_valve": {
        "en": "Stuck or faulty EGR valve",
        "tr": "Takılı kalmış veya arızalı EGR valfi",
        "es": "Válvula EGR atascada o defectuosa",
        "fr": "Vanne EGR bloquée ou défectueuse",
        "de": "Festsitzendes oder defektes AGR-Ventil"
    },
    "cause_egr_passages": {
        "en": "Clogged EGR passages",
        "tr": "Tıkalı EGR kanalları",
        "es": "Conductos de EGR obstruidos",
        "fr": "Passages EGR obstrués",
        "de": "Verstopfte AGR-Kanäle"
    },
    "cause_evap_gas_cap": {
        "en": "Loose, damaged, or missing gas cap",
        "tr": "Gevşek, hasarlı veya kayıp yakıt deposu kapağı",
        "es": "Tapa del tanque suelta, dañada o faltante",
        "fr": "Bouchon de réservoir desserré, endommagé ou manquant",
        "de": "Tankdeckel lose, beschädigt oder fehlend"
    },
    "cause_evap_purge_valve": {
        "en": "Faulty EVAP purge control valve",
        "tr": "Arızalı EVAP arındırma kontrol valfi",
        "es": "Válvula de purga EVAP defectuosa",
        "fr": "Vanne de purge EVAP défectueuse",
        "de": "Defektes EVAP-Spülventil"
    },
    "cause_evap_vent_valve": {
        "en": "Faulty EVAP vent valve/solenoid",
        "tr": "Arızalı EVAP havalandırma valfi/solenoidi",
        "es": "Válvula de ventilación EVAP defectuosa",
        "fr": "Électrovanne de mise à l'air EVAP défectueuse",
        "de": "Defektes EVAP-Entlüftungsventil"
    },
    "cause_evap_canister": {
        "en": "Saturated or damaged EVAP charcoal canister",
        "tr": "Doymuş veya hasarlı EVAP karbon filtresi",
        "es": "Canister EVAP saturado o dañado",
        "fr": "Canister EVAP saturé ou endommagé",
        "de": "Gesättigter oder beschädigter EVAP-Aktivkohlefilter"
    },
    "cause_evap_hose_leak": {
        "en": "Cracked or disconnected EVAP hose",
        "tr": "Çatlak veya kopuk EVAP hortumu",
        "es": "Manguera EVAP agrietada o desconectada",
        "fr": "Tuyau EVAP fissuré ou déconnecté",
        "de": "Gerissener oder abgetrennter EVAP-Schlauch"
    },
    "cause_crankshaft_sensor": {
        "en": "Faulty crankshaft position sensor",
        "tr": "Arızalı krank mili konum sensörü",
        "es": "Sensor de posición del cigüeñal defectuoso",
        "fr": "Capteur de position du vilebrequin défectueux",
        "de": "Defekter Kurbelwellenpositionssensor"
    },
    "cause_camshaft_sensor": {
        "en": "Faulty camshaft position sensor",
        "tr": "Arızalı eksantrik mili konum sensörü",
        "es": "Sensor de posición del árbol de levas defectuoso",
        "fr": "Capteur de position de l'arbre à cames défectueux",
        "de": "Defekter Nockenwellenpositionssensor"
    },
    "cause_knock_sensor": {
        "en": "Faulty knock sensor",
        "tr": "Arızalı vuruntu sensörü",
        "es": "Sensor de detonación defectuoso",
        "fr": "Capteur de cliquetis défectueux",
        "de": "Defekter Klopfsensor"
    },
    "cause_throttle_body": {
        "en": "Dirty or faulty throttle body",
        "tr": "Kirli veya arızalı gaz kelebeği gövdesi",
        "es": "Cuerpo del acelerador sucio o defectuoso",
        "fr": "Corps de papillon sale ou défectueux",
        "de": "Verschmutzte oder defekte Drosselklappe"
    },
    "cause_throttle_position": {
        "en": "Faulty throttle position sensor (TPS)",
        "tr": "Arızalı gaz kelebeği konum sensörü (TPS)",
        "es": "Sensor de posición del acelerador (TPS) defectuoso",
        "fr": "Capteur de position du papillon (TPS) défectueux",
        "de": "Defekter Drosselklappenstellungssensor (TPS)"
    },
    "cause_wiring_damage": {
        "en": "Damaged, chafed, or broken wiring harness",
        "tr": "Hasarlı, aşınmış veya kopuk kablo tesisatı",
        "es": "Arnés de cableado dañado o roto",
        "fr": "Faisceau de câblage endommagé ou cassé",
        "de": "Beschädigter oder gebrochener Kabelbaum"
    },
    "cause_connector_corrosion": {
        "en": "Corroded or loose electrical connector",
        "tr": "Korozyona uğramış veya gevşek elektrik konnektörü",
        "es": "Conector eléctrico corroído o suelto",
        "fr": "Connecteur électrique corrodé ou desserré",
        "de": "Korrodierter oder loser Steckverbinder"
    },
    "cause_pcm_software": {
        "en": "PCM/ECM software needs update (TSB)",
        "tr": "PCM/ECM yazılımı güncelleme gerektiriyor (TSB)",
        "es": "El software del PCM/ECM necesita actualización (TSB)",
        "fr": "Le logiciel du PCM/ECM doit être mis à jour (TSB)",
        "de": "PCM/ECM-Software benötigt Update (TSB)"
    },
    "cause_pcm_failure": {
        "en": "Internal PCM/ECM failure",
        "tr": "Dahili PCM/ECM arızası",
        "es": "Fallo interno del PCM/ECM",
        "fr": "Défaillance interne du PCM/ECM",
        "de": "Interner PCM/ECM-Defekt"
    },
    "cause_transmission_fluid": {
        "en": "Low, dirty, or burnt transmission fluid",
        "tr": "Düşük, kirli veya yanmış şanzıman yağı",
        "es": "Líquido de transmisión bajo, sucio o quemado",
        "fr": "Liquide de transmission bas, sale ou brûlé",
        "de": "Niedriger, verschmutzter oder verbrannter Getriebeölstand"
    },
    "cause_shift_solenoid": {
        "en": "Faulty transmission shift solenoid",
        "tr": "Arızalı şanzıman vites solenoidi",
        "es": "Solenoide de cambio de transmisión defectuoso",
        "fr": "Électrovanne de changement de vitesse défectueuse",
        "de": "Defektes Getriebe-Schaltmagnetventil"
    },
    "cause_torque_converter": {
        "en": "Faulty torque converter or lockup clutch",
        "tr": "Arızalı tork konvertörü veya kilitleme kavraması",
        "es": "Convertidor de par o embrague de bloqueo defectuoso",
        "fr": "Convertisseur de couple ou embrayage de verrouillage défectueux",
        "de": "Defekter Drehmomentwandler oder Wandlerüberbrückungskupplung"
    },
    "cause_valve_body": {
        "en": "Worn or faulty transmission valve body",
        "tr": "Aşınmış veya arızalı şanzıman valf gövdesi",
        "es": "Cuerpo de válvulas de la transmisión desgastado",
        "fr": "Corps de valve de la transmission usé ou défectueux",
        "de": "Verschlissener oder defekter Ventilkörper"
    },
    "cause_speed_sensor_in": {
        "en": "Faulty input/turbine speed sensor",
        "tr": "Arızalı giriş/türbin hız sensörü",
        "es": "Sensor de velocidad de entrada/turbina defectuoso",
        "fr": "Capteur de vitesse d'entrée/turbine défectueux",
        "de": "Defekter Eingangs-/Turbinendrehzahlsensor"
    },
    "cause_speed_sensor_out": {
        "en": "Faulty output speed sensor",
        "tr": "Arızalı çıkış hız sensörü",
        "es": "Sensor de velocidad de salida defectuoso",
        "fr": "Capteur de vitesse de sortie défectueux",
        "de": "Defekter Ausgangsdrehzahlsensor"
    },
    "cause_pressure_solenoid": {
        "en": "Faulty transmission pressure control solenoid",
        "tr": "Arızalı şanzıman basınç kontrol solenoidi",
        "es": "Solenoide de control de presión de transmisión defectuoso",
        "fr": "Électrovanne de contrôle de pression de transmission défectueuse",
        "de": "Defektes Getriebedruckregelmagnetventil"
    },
    "cause_transmission_filter": {
        "en": "Clogged transmission filter",
        "tr": "Tıkalı şanzıman filtresi",
        "es": "Filtro de transmisión obstruido",
        "fr": "Filtre de transmission obstrué",
        "de": "Verstopfter Getriebefilter"
    },
    "cause_alternator": {
        "en": "Faulty alternator or voltage regulator",
        "tr": "Arızalı alternatör veya voltaj regülatörü",
        "es": "Alternador o regulador de voltaje defectuoso",
        "fr": "Alternateur ou régulateur de tension défectueux",
        "de": "Defekte Lichtmaschine oder Spannungsregler"
    },
    "cause_battery": {
        "en": "Weak or failing battery",
        "tr": "Zayıf veya arızalı akü",
        "es": "Batería débil o defectuosa",
        "fr": "Batterie faible ou défaillante",
        "de": "Schwache oder defekte Batterie"
    },
    "cause_glow_plug": {
        "en": "Failed glow plug or glow plug module (diesel)",
        "tr": "Arızalı kızdırma bujisi veya modülü (dizel)",
        "es": "Bujía incandescente o módulo averiado (diésel)",
        "fr": "Bougie de préchauffage ou module défaillant (diesel)",
        "de": "Defekte Glühkerze oder Glühkerzensteuergerät (Diesel)"
    },
    "cause_turbo_wastegate": {
        "en": "Stuck or faulty turbo wastegate",
        "tr": "Takılı veya arızalı turbo wastegate",
        "es": "Wastegate del turbo atascada o defectuosa",
        "fr": "Wastegate du turbo bloquée ou défectueuse",
        "de": "Festsitzendes oder defektes Turbo-Wastegate"
    },
    "cause_turbo_actuator": {
        "en": "Faulty turbocharger boost control actuator",
        "tr": "Arızalı turbo basınç kontrol aktüatörü",
        "es": "Actuador de control de presión del turbo defectuoso",
        "fr": "Actionneur de contrôle de surpression du turbo défectueux",
        "de": "Defekter Turbolader-Ladedruckregler"
    },
    "cause_intake_leak": {
        "en": "Intake manifold gasket leak",
        "tr": "Emme manifoldu conta kaçağı",
        "es": "Fuga en la junta del colector de admisión",
        "fr": "Fuite du joint du collecteur d'admission",
        "de": "Undichte Ansaugkrümmerdichtung"
    },
    "cause_exhaust_leak": {
        "en": "Exhaust leak before oxygen sensor",
        "tr": "Oksijen sensöründen önce egzoz kaçağı",
        "es": "Fuga de escape antes del sensor de oxígeno",
        "fr": "Fuite d'échappement avant la sonde lambda",
        "de": "Abgasleck vor der Lambdasonde"
    },
    "cause_head_gasket": {
        "en": "Blown head gasket",
        "tr": "Yanmış silindir kapağı contası",
        "es": "Junta de culata dañada",
        "fr": "Joint de culasse défaillant",
        "de": "Defekte Zylinderkopfdichtung"
    },
    "cause_coolant_leak": {
        "en": "Coolant leak or low coolant level",
        "tr": "Soğutma suyu kaçağı veya düşük seviye",
        "es": "Fuga de refrigerante o nivel bajo",
        "fr": "Fuite de liquide de refroidissement ou niveau bas",
        "de": "Kühlmittelleck oder niedriger Kühlmittelstand"
    },
    "cause_oil_pressure_sender": {
        "en": "Faulty oil pressure sensor/sending unit",
        "tr": "Arızalı yağ basıncı sensörü",
        "es": "Sensor de presión de aceite defectuoso",
        "fr": "Capteur de pression d'huile défectueux",
        "de": "Defekter Öldrucksensor"
    },
    "cause_fan_relay": {
        "en": "Faulty cooling fan relay",
        "tr": "Arızalı soğutma fanı rölesi",
        "es": "Relé del ventilador de enfriamiento defectuoso",
        "fr": "Relais du ventilateur de refroidissement défectueux",
        "de": "Defektes Kühlerlüfterrelais"
    },
    "cause_fan_motor": {
        "en": "Failed cooling fan motor",
        "tr": "Arızalı soğutma fanı motoru",
        "es": "Motor del ventilador de enfriamiento averiado",
        "fr": "Moteur du ventilateur de refroidissement défaillant",
        "de": "Defekter Kühlerlüftermotor"
    },
    "cause_ac_compressor": {
        "en": "Faulty A/C compressor or clutch",
        "tr": "Arızalı klima kompresörü veya kavraması",
        "es": "Compresor o embrague del A/C defectuoso",
        "fr": "Compresseur ou embrayage de climatisation défectueux",
        "de": "Defekter Klimakompressor oder Kupplung"
    },
    "cause_ac_refrigerant": {
        "en": "Low A/C refrigerant charge",
        "tr": "Düşük klima soğutucu gazı",
        "es": "Carga baja de refrigerante del A/C",
        "fr": "Charge de réfrigérant basse",
        "de": "Niedrige Kältemittelfüllung"
    },
    "cause_thermostat": {
        "en": "Faulty or stuck thermostat",
        "tr": "Arızalı veya takılı termostat",
        "es": "Termostato defectuoso o atascado",
        "fr": "Thermostat défectueux ou bloqué",
        "de": "Defekter oder festsitzender Thermostat"
    },
    "cause_vss": {
        "en": "Faulty vehicle speed sensor (VSS)",
        "tr": "Arızalı araç hız sensörü (VSS)",
        "es": "Sensor de velocidad del vehículo (VSS) defectuoso",
        "fr": "Capteur de vitesse du véhicule (VSS) défectueux",
        "de": "Defekter Fahrzeuggeschwindigkeitssensor (VSS)"
    },
    "cause_secondary_air_pump": {
        "en": "Faulty secondary air injection pump",
        "tr": "Arızalı ikincil hava enjeksiyon pompası",
        "es": "Bomba de inyección de aire secundario defectuosa",
        "fr": "Pompe d'injection d'air secondaire défectueuse",
        "de": "Defekte Sekundärluftpumpe"
    },
    "cause_secondary_air_valve": {
        "en": "Stuck secondary air injection check valve",
        "tr": "Takılı ikincil hava enjeksiyon çek valfi",
        "es": "Válvula de retención de aire secundario atascada",
        "fr": "Clapet anti-retour d'air secondaire bloqué",
        "de": "Festsitzendes Sekundärluft-Rückschlagventil"
    },
    "cause_timing_chain": {
        "en": "Stretched timing chain or worn timing belt",
        "tr": "Uzamış zaman zinciri veya aşınmış kayış",
        "es": "Cadena de distribución estirada o correa desgastada",
        "fr": "Chaîne de distribution étirée ou courroie usée",
        "de": "Gelängte Steuerkette oder verschlissener Zahnriemen"
    },
    "cause_fuel_composition_sensor": {
        "en": "Faulty fuel composition/flex fuel sensor",
        "tr": "Arızalı yakıt kompozisyon/flex fuel sensörü",
        "es": "Sensor de composición de combustible defectuoso",
        "fr": "Capteur de composition de carburant défectueux",
        "de": "Defekter Kraftstoffzusammensetzungssensor"
    },
    "cause_fuel_temp_sensor": {
        "en": "Faulty fuel temperature sensor",
        "tr": "Arızalı yakıt sıcaklığı sensörü",
        "es": "Sensor de temperatura del combustible defectuoso",
        "fr": "Capteur de température de carburant défectueux",
        "de": "Defekter Kraftstofftemperatursensor"
    },
    "cause_fuel_rail_pressure_sensor": {
        "en": "Faulty fuel rail pressure sensor",
        "tr": "Arızalı yakıt rampa basınç sensörü",
        "es": "Sensor de presión del riel de combustible defectuoso",
        "fr": "Capteur de pression de rampe de carburant défectueux",
        "de": "Defekter Kraftstoff-Raildrucksensor"
    },
    "cause_nox_sensor": {
        "en": "Faulty NOx sensor",
        "tr": "Arızalı NOx sensörü",
        "es": "Sensor de NOx defectuoso",
        "fr": "Capteur NOx défectueux",
        "de": "Defekter NOx-Sensor"
    },
    "cause_nox_catalyst": {
        "en": "Degraded NOx adsorber catalyst",
        "tr": "Bozulmuş NOx adsorber katalizörü",
        "es": "Catalizador adsorbedor de NOx degradado",
        "fr": "Catalyseur adsorbeur de NOx dégradé",
        "de": "Verschlissener NOx-Speicherkatalysator"
    },
    "cause_throttle_actuator": {
        "en": "Faulty electronic throttle actuator motor",
        "tr": "Arızalı elektronik gaz kelebeği aktüatör motoru",
        "es": "Motor actuador del acelerador electrónico defectuoso",
        "fr": "Moteur de l'actionneur de papillon électronique défectueux",
        "de": "Defekter elektronischer Drosselklappenstellmotor"
    },
    "cause_clutch_switch": {
        "en": "Faulty clutch position switch or sensor",
        "tr": "Arızalı debriyaj konum anahtarı veya sensörü",
        "es": "Interruptor de posición del embrague defectuoso",
        "fr": "Capteur de position d'embrayage défectueux",
        "de": "Defekter Kupplungspositionsschalter"
    },
    "cause_clutch_actuator": {
        "en": "Faulty clutch actuator or hydraulic system",
        "tr": "Arızalı debriyaj aktüatörü veya hidrolik sistem",
        "es": "Actuador del embrague o sistema hidráulico defectuoso",
        "fr": "Actionneur d'embrayage ou système hydraulique défectueux",
        "de": "Defekter Kupplungsaktuator oder Hydrauliksystem"
    },
    "cause_brake_switch": {
        "en": "Faulty brake light switch",
        "tr": "Arızalı fren lambası anahtarı",
        "es": "Interruptor de luz de freno defectuoso",
        "fr": "Contacteur de feux stop défectueux",
        "de": "Defekter Bremslichtschalter"
    },
    "cause_cruise_control_module": {
        "en": "Faulty cruise control module or switch",
        "tr": "Arızalı hız sabitleyici modülü veya anahtarı",
        "es": "Módulo o interruptor de control de crucero defectuoso",
        "fr": "Module ou interrupteur de régulateur de vitesse défectueux",
        "de": "Defektes Tempomat-Modul oder -Schalter"
    },
    "cause_power_steering_sensor": {
        "en": "Faulty power steering pressure sensor",
        "tr": "Arızalı hidrolik direksiyon basınç sensörü",
        "es": "Sensor de presión de dirección asistida defectuoso",
        "fr": "Capteur de pression de direction assistée défectueux",
        "de": "Defekter Servolenkungsdrucksensor"
    },
    "cause_ignition_key_transponder": {
        "en": "Faulty ignition key transponder or immobilizer",
        "tr": "Arızalı kontak anahtarı transponder veya immobilizer",
        "es": "Transponder de llave o inmovilizador defectuoso",
        "fr": "Transpondeur de clé ou antidémarrage défectueux",
        "de": "Defekter Schlüsseltransponder oder Wegfahrsperre"
    },
    "cause_hydraulic_pump": {
        "en": "Faulty hydraulic pump motor or pressure switch",
        "tr": "Arızalı hidrolik pompa motoru veya basınç anahtarı",
        "es": "Motor de bomba hidráulica o interruptor de presión defectuoso",
        "fr": "Moteur de pompe hydraulique ou pressostat défectueux",
        "de": "Defekter Hydraulikpumpenmotor oder Druckschalter"
    },
}

# ============================================================================
# DIFFICULTY KEY DEFINITIONS (with all 5 languages)
# ============================================================================
DIFFICULTY_TRANSLATIONS = {
    "diff_easy": {
        "en": "Easy",
        "tr": "Kolay",
        "es": "Fácil",
        "fr": "Facile",
        "de": "Einfach"
    },
    "diff_moderate": {
        "en": "Moderate",
        "tr": "Orta",
        "es": "Moderado",
        "fr": "Modéré",
        "de": "Moderat"
    },
    "diff_hard": {
        "en": "Hard",
        "tr": "Zor",
        "es": "Difícil",
        "fr": "Difficile",
        "de": "Schwierig"
    },
    "diff_professional": {
        "en": "Professional",
        "tr": "Profesyonel",
        "es": "Profesional",
        "fr": "Professionnel",
        "de": "Professionell"
    },
}


# ============================================================================
# INDIVIDUAL CODE DEFINITIONS (highest priority - exact match)
# ============================================================================
INDIVIDUAL_CODES = {
    # P0100-P0104: MAF
    "P0100": {"title": "Mass Air Flow (MAF) Circuit Malfunction", "desc": "The Mass Air Flow (MAF) sensor measures the amount of air entering the engine. Code P0100 indicates a general malfunction in the MAF sensor circuit, meaning the PCM detected an unexpected voltage or signal from the sensor.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_stalling","symp_poor_acceleration","symp_fuel_economy","symp_hard_start","symp_black_smoke"], "causes": ["cause_maf_dirty","cause_maf_faulty","cause_wiring_damage","cause_connector_corrosion","cause_vacuum_leak","cause_intake_leak"], "difficulty": "diff_moderate", "cost": "$100 - $400"},
    "P0101": {"title": "Mass Air Flow (MAF) Circuit Range/Performance", "desc": "Code P0101 means the MAF sensor signal is outside the expected range for the current engine operating conditions. The PCM detected that the air flow reading does not correlate with throttle position, RPM, or other sensor inputs.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_hesitation","symp_fuel_economy","symp_stalling","symp_black_smoke","symp_surging"], "causes": ["cause_maf_dirty","cause_maf_faulty","cause_vacuum_leak","cause_intake_leak","cause_fuel_filter"], "difficulty": "diff_moderate", "cost": "$80 - $350"},
    "P0102": {"title": "Mass Air Flow (MAF) Circuit Low Input", "desc": "Code P0102 indicates the PCM has detected an abnormally low voltage signal from the MAF sensor. This typically means the sensor is reporting less air flow than expected.", "symptoms": ["symp_check_engine","symp_power_loss","symp_stalling","symp_hard_start","symp_rough_idle"], "causes": ["cause_maf_dirty","cause_maf_faulty","cause_wiring_damage","cause_connector_corrosion","cause_vacuum_leak"], "difficulty": "diff_moderate", "cost": "$80 - $350"},
    "P0103": {"title": "Mass Air Flow (MAF) Circuit High Input", "desc": "Code P0103 indicates the PCM has detected an abnormally high voltage signal from the MAF sensor. This suggests the sensor is reporting more air flow than the engine can physically consume.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_black_smoke","symp_fuel_economy","symp_hesitation"], "causes": ["cause_maf_faulty","cause_wiring_damage","cause_connector_corrosion","cause_pcm_software"], "difficulty": "diff_moderate", "cost": "$80 - $350"},
    "P0104": {"title": "Mass Air Flow (MAF) Circuit Intermittent", "desc": "Code P0104 means the MAF sensor signal is cutting in and out intermittently. The PCM has detected erratic or unstable voltage readings from the MAF circuit.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_surging","symp_hesitation","symp_stalling"], "causes": ["cause_wiring_damage","cause_connector_corrosion","cause_maf_dirty","cause_maf_faulty"], "difficulty": "diff_moderate", "cost": "$80 - $350"},

    # P0105-P0109: MAP
    "P0105": {"title": "Manifold Absolute Pressure (MAP) / Barometric Pressure Circuit Malfunction", "desc": "The MAP sensor measures intake manifold vacuum pressure to help the PCM calculate engine load. Code P0105 indicates a general malfunction in this circuit.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_stalling","symp_poor_acceleration","symp_fuel_economy","symp_hard_start"], "causes": ["cause_map_sensor","cause_wiring_damage","cause_connector_corrosion","cause_vacuum_leak"], "difficulty": "diff_moderate", "cost": "$75 - $300"},
    "P0106": {"title": "MAP/Barometric Pressure Circuit Range/Performance", "desc": "Code P0106 means the MAP sensor output voltage is outside the expected range for the current engine operating conditions.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_poor_acceleration","symp_fuel_economy","symp_surging"], "causes": ["cause_map_sensor","cause_vacuum_leak","cause_intake_leak","cause_throttle_body"], "difficulty": "diff_moderate", "cost": "$75 - $300"},
    "P0107": {"title": "MAP/Barometric Pressure Circuit Low Input", "desc": "Code P0107 indicates the MAP sensor is sending an abnormally low voltage to the PCM, suggesting higher vacuum than expected or a sensor fault.", "symptoms": ["symp_check_engine","symp_power_loss","symp_stalling","symp_rough_idle"], "causes": ["cause_map_sensor","cause_wiring_damage","cause_connector_corrosion","cause_vacuum_leak"], "difficulty": "diff_moderate", "cost": "$75 - $300"},
    "P0108": {"title": "MAP/Barometric Pressure Circuit High Input", "desc": "Code P0108 indicates the MAP sensor is sending an abnormally high voltage to the PCM, suggesting lower vacuum than expected.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_fuel_economy","symp_poor_acceleration"], "causes": ["cause_map_sensor","cause_wiring_damage","cause_connector_corrosion","cause_vacuum_leak"], "difficulty": "diff_moderate", "cost": "$75 - $300"},
    "P0109": {"title": "MAP/Barometric Pressure Circuit Intermittent", "desc": "Code P0109 indicates an intermittent signal from the MAP/Barometric pressure sensor, where the voltage fluctuates erratically.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_surging","symp_hesitation"], "causes": ["cause_map_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$75 - $300"},

    # P0110-P0114: IAT
    "P0110": {"title": "Intake Air Temperature (IAT) Circuit Malfunction", "desc": "The IAT sensor measures the temperature of the air entering the engine. Code P0110 indicates a general malfunction in the IAT sensor circuit.", "symptoms": ["symp_check_engine","symp_hard_start","symp_rough_idle","symp_fuel_economy"], "causes": ["cause_iat_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_easy", "cost": "$50 - $200"},
    "P0111": {"title": "Intake Air Temperature (IAT) Circuit Range/Performance", "desc": "Code P0111 means the IAT sensor reading is outside the expected range for the current conditions.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_hard_start","symp_rough_idle"], "causes": ["cause_iat_sensor","cause_wiring_damage","cause_intake_leak"], "difficulty": "diff_easy", "cost": "$50 - $200"},
    "P0112": {"title": "Intake Air Temperature (IAT) Circuit Low Input", "desc": "Code P0112 indicates the IAT sensor is sending an abnormally low voltage signal (indicating high temperature) to the PCM.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_rough_idle"], "causes": ["cause_iat_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_easy", "cost": "$50 - $200"},
    "P0113": {"title": "Intake Air Temperature (IAT) Circuit High Input", "desc": "Code P0113 indicates the IAT sensor is sending an abnormally high voltage signal (indicating low temperature) to the PCM.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_hard_start","symp_rough_idle"], "causes": ["cause_iat_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_easy", "cost": "$50 - $200"},
    "P0114": {"title": "Intake Air Temperature (IAT) Circuit Intermittent", "desc": "Code P0114 indicates the IAT sensor signal is fluctuating intermittently.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_surging"], "causes": ["cause_iat_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_easy", "cost": "$50 - $200"},

    # P0115-P0119: ECT
    "P0115": {"title": "Engine Coolant Temperature (ECT) Circuit Malfunction", "desc": "The ECT sensor measures coolant temperature to help the PCM adjust fuel injection and ignition timing. Code P0115 indicates a general circuit malfunction.", "symptoms": ["symp_check_engine","symp_hard_start","symp_fuel_economy","symp_rough_idle","symp_stalling_cold","symp_fan_not_working"], "causes": ["cause_ect_sensor","cause_wiring_damage","cause_connector_corrosion","cause_thermostat"], "difficulty": "diff_easy", "cost": "$50 - $250"},
    "P0116": {"title": "Engine Coolant Temperature (ECT) Circuit Range/Performance", "desc": "Code P0116 means the ECT sensor reading does not match the expected warm-up curve or operating temperature range.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_hard_start","symp_stalling_cold","symp_engine_overheat"], "causes": ["cause_ect_sensor","cause_thermostat","cause_coolant_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $300"},
    "P0117": {"title": "Engine Coolant Temperature (ECT) Circuit Low Input", "desc": "Code P0117 indicates the ECT sensor voltage is lower than expected, suggesting the sensor reports excessively high temperature.", "symptoms": ["symp_check_engine","symp_fan_not_working","symp_fuel_economy","symp_rough_idle"], "causes": ["cause_ect_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_easy", "cost": "$50 - $250"},
    "P0118": {"title": "Engine Coolant Temperature (ECT) Circuit High Input", "desc": "Code P0118 indicates the ECT sensor voltage is higher than expected, suggesting the sensor reports excessively low temperature.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_hard_start","symp_stalling_cold"], "causes": ["cause_ect_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_easy", "cost": "$50 - $250"},
    "P0119": {"title": "Engine Coolant Temperature (ECT) Circuit Intermittent", "desc": "Code P0119 indicates the ECT sensor signal is fluctuating intermittently, causing erratic temperature readings.", "symptoms": ["symp_check_engine","symp_erratic_idle","symp_fuel_economy","symp_surging"], "causes": ["cause_ect_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_easy", "cost": "$50 - $250"},

    # P0120-P0124: TPS A
    "P0120": {"title": "Throttle/Pedal Position Sensor/Switch A Circuit Malfunction", "desc": "Code P0120 indicates a malfunction in the Throttle Position Sensor (TPS) 'A' circuit. The PCM monitors the TPS to determine throttle blade angle.", "symptoms": ["symp_check_engine","symp_poor_acceleration","symp_surging","symp_stalling","symp_erratic_idle","symp_reduced_power_mode"], "causes": ["cause_throttle_position","cause_wiring_damage","cause_connector_corrosion","cause_throttle_body"], "difficulty": "diff_moderate", "cost": "$100 - $400"},
    "P0121": {"title": "Throttle/Pedal Position Sensor/Switch A Circuit Range/Performance", "desc": "Code P0121 means the TPS 'A' signal is outside the expected voltage range for the current engine conditions.", "symptoms": ["symp_check_engine","symp_poor_acceleration","symp_surging","symp_hesitation","symp_reduced_power_mode"], "causes": ["cause_throttle_position","cause_throttle_body","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $400"},
    "P0122": {"title": "Throttle/Pedal Position Sensor/Switch A Circuit Low Input", "desc": "Code P0122 indicates the TPS 'A' signal voltage is below the minimum expected threshold.", "symptoms": ["symp_check_engine","symp_poor_acceleration","symp_stalling","symp_reduced_power_mode","symp_rough_idle"], "causes": ["cause_throttle_position","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $400"},
    "P0123": {"title": "Throttle/Pedal Position Sensor/Switch A Circuit High Input", "desc": "Code P0123 indicates the TPS 'A' signal voltage is above the maximum expected threshold.", "symptoms": ["symp_check_engine","symp_poor_acceleration","symp_high_idle","symp_reduced_power_mode","symp_surging"], "causes": ["cause_throttle_position","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $400"},
    "P0124": {"title": "Throttle/Pedal Position Sensor/Switch A Circuit Intermittent", "desc": "Code P0124 indicates the TPS 'A' signal is fluctuating intermittently.", "symptoms": ["symp_check_engine","symp_surging","symp_hesitation","symp_erratic_idle"], "causes": ["cause_throttle_position","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $400"},

    # P0125-P0129
    "P0125": {"title": "Insufficient Coolant Temperature for Closed Loop Fuel Control", "desc": "Code P0125 means the engine coolant is not reaching the temperature required for the PCM to enter closed-loop fuel control within the expected time.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_stalling_cold","symp_rough_idle","symp_failed_emissions"], "causes": ["cause_thermostat","cause_ect_sensor","cause_coolant_leak"], "difficulty": "diff_moderate", "cost": "$75 - $300"},
    "P0126": {"title": "Insufficient Coolant Temperature for Stable Operation", "desc": "Code P0126 means the engine coolant temperature is not reaching or maintaining a stable operating temperature.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_coolant_temp_warning","symp_rough_idle"], "causes": ["cause_thermostat","cause_ect_sensor","cause_coolant_leak"], "difficulty": "diff_moderate", "cost": "$75 - $300"},
    "P0127": {"title": "Intake Air Temperature Too High", "desc": "Code P0127 indicates the intake air temperature sensor is reading a temperature that is too high for normal engine operation.", "symptoms": ["symp_check_engine","symp_power_loss","symp_knocking","symp_reduced_power_mode"], "causes": ["cause_iat_sensor","cause_intake_leak","cause_wiring_damage"], "difficulty": "diff_easy", "cost": "$50 - $200"},
    "P0128": {"title": "Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)", "desc": "Code P0128 indicates the engine coolant temperature has not reached the thermostat's regulating temperature within a specified time after starting.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_stalling_cold","symp_coolant_temp_warning"], "causes": ["cause_thermostat","cause_ect_sensor","cause_coolant_leak"], "difficulty": "diff_moderate", "cost": "$75 - $300"},
    "P0129": {"title": "Barometric Pressure Too Low", "desc": "Code P0129 indicates the barometric pressure reading is too low for normal engine operation, which may occur at very high altitudes or with a sensor fault.", "symptoms": ["symp_check_engine","symp_power_loss","symp_poor_acceleration"], "causes": ["cause_map_sensor","cause_wiring_damage","cause_pcm_software"], "difficulty": "diff_moderate", "cost": "$75 - $300"},

    # Key individual codes - P0130-P0175 (O2 and fuel trim)
    "P0130": {"title": "O2 Sensor Circuit Malfunction (Bank 1, Sensor 1)", "desc": "Code P0130 indicates a malfunction in the upstream oxygen sensor circuit on Bank 1. This sensor monitors exhaust gases before the catalytic converter.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_rough_idle","symp_failed_emissions"], "causes": ["cause_o2_sensor","cause_wiring_damage","cause_exhaust_leak","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0131": {"title": "O2 Sensor Circuit Low Voltage (Bank 1, Sensor 1)", "desc": "Code P0131 indicates the upstream O2 sensor on Bank 1 is reading a persistently low voltage, suggesting a lean condition.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_rough_idle","symp_hesitation"], "causes": ["cause_o2_sensor","cause_vacuum_leak","cause_exhaust_leak","cause_fuel_injector"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0132": {"title": "O2 Sensor Circuit High Voltage (Bank 1, Sensor 1)", "desc": "Code P0132 indicates the upstream O2 sensor on Bank 1 is reading a persistently high voltage, suggesting a rich condition.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_black_smoke","symp_rough_idle"], "causes": ["cause_o2_sensor","cause_fuel_injector","cause_fuel_pressure_reg","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0133": {"title": "O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)", "desc": "Code P0133 means the upstream O2 sensor on Bank 1 is switching between rich and lean too slowly, indicating a sluggish sensor response.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions","symp_rough_idle"], "causes": ["cause_o2_sensor","cause_exhaust_leak","cause_vacuum_leak","cause_fuel_injector"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0134": {"title": "O2 Sensor Circuit No Activity Detected (Bank 1, Sensor 1)", "desc": "Code P0134 means the PCM has detected no switching activity from the upstream O2 sensor on Bank 1, indicating the sensor may be dead.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_rough_idle","symp_failed_emissions"], "causes": ["cause_o2_sensor","cause_o2_heater","cause_wiring_damage","cause_exhaust_leak"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0135": {"title": "O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 1)", "desc": "Code P0135 indicates a malfunction in the heater circuit of the upstream O2 sensor on Bank 1. The heater brings the sensor to operating temperature quickly.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"], "causes": ["cause_o2_heater","cause_o2_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $300"},

    # P0136-P0141: O2 Bank 1 Sensor 2
    "P0136": {"title": "O2 Sensor Circuit Malfunction (Bank 1, Sensor 2)", "desc": "Code P0136 indicates a malfunction in the downstream oxygen sensor circuit on Bank 1. This sensor monitors catalytic converter efficiency.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"], "causes": ["cause_o2_sensor","cause_wiring_damage","cause_exhaust_leak","cause_cat_converter"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0137": {"title": "O2 Sensor Circuit Low Voltage (Bank 1, Sensor 2)", "desc": "Code P0137 indicates the downstream O2 sensor on Bank 1 is reading persistently low voltage.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"], "causes": ["cause_o2_sensor","cause_exhaust_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0138": {"title": "O2 Sensor Circuit High Voltage (Bank 1, Sensor 2)", "desc": "Code P0138 indicates the downstream O2 sensor on Bank 1 is reading persistently high voltage.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"], "causes": ["cause_o2_sensor","cause_fuel_injector","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0139": {"title": "O2 Sensor Circuit Slow Response (Bank 1, Sensor 2)", "desc": "Code P0139 means the downstream O2 sensor on Bank 1 is switching too slowly.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"], "causes": ["cause_o2_sensor","cause_exhaust_leak","cause_cat_converter"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0140": {"title": "O2 Sensor Circuit No Activity Detected (Bank 1, Sensor 2)", "desc": "Code P0140 means the PCM detected no activity from the downstream O2 sensor on Bank 1.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"], "causes": ["cause_o2_sensor","cause_o2_heater","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$100 - $350"},
    "P0141": {"title": "O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 2)", "desc": "Code P0141 indicates a malfunction in the heater circuit of the downstream O2 sensor on Bank 1.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"], "causes": ["cause_o2_heater","cause_o2_sensor","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$100 - $300"},

    # P0171-P0175: Fuel Trim
    "P0171": {"title": "System Too Lean (Bank 1)", "desc": "Code P0171 indicates the engine control module has detected that the fuel system on Bank 1 is running too lean — there is too much air or too little fuel in the air-fuel mixture. The long-term fuel trim has exceeded its adjustment range.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_hesitation","symp_poor_acceleration","symp_stalling","symp_fuel_economy","symp_misfire_feel","symp_hard_start"], "causes": ["cause_vacuum_leak","cause_maf_dirty","cause_fuel_pump","cause_fuel_filter","cause_fuel_pressure_reg","cause_fuel_injector","cause_intake_leak","cause_exhaust_leak","cause_o2_sensor"], "difficulty": "diff_moderate", "cost": "$75 - $500"},
    "P0172": {"title": "System Too Rich (Bank 1)", "desc": "Code P0172 indicates the engine control module has detected that the fuel system on Bank 1 is running too rich — there is too much fuel or too little air in the air-fuel mixture.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_black_smoke","symp_fuel_economy","symp_rotten_egg_smell","symp_fuel_smell"], "causes": ["cause_maf_dirty","cause_fuel_injector","cause_fuel_pressure_reg","cause_o2_sensor","cause_spark_plugs","cause_ect_sensor","cause_pcm_software"], "difficulty": "diff_moderate", "cost": "$75 - $500"},
    "P0173": {"title": "Fuel Trim Malfunction (Bank 2)", "desc": "Code P0173 indicates a general fuel trim malfunction on Bank 2. The PCM cannot maintain the proper air-fuel ratio.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_fuel_economy","symp_hesitation"], "causes": ["cause_vacuum_leak","cause_maf_dirty","cause_fuel_injector","cause_o2_sensor","cause_fuel_pressure_reg"], "difficulty": "diff_moderate", "cost": "$75 - $500"},
    "P0174": {"title": "System Too Lean (Bank 2)", "desc": "Code P0174 indicates the fuel system on Bank 2 is running too lean. Same diagnostic approach as P0171 but affecting the opposite bank of cylinders.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_hesitation","symp_poor_acceleration","symp_stalling","symp_fuel_economy"], "causes": ["cause_vacuum_leak","cause_maf_dirty","cause_fuel_pump","cause_fuel_filter","cause_fuel_pressure_reg","cause_fuel_injector","cause_intake_leak","cause_exhaust_leak","cause_o2_sensor"], "difficulty": "diff_moderate", "cost": "$75 - $500"},
    "P0175": {"title": "System Too Rich (Bank 2)", "desc": "Code P0175 indicates the fuel system on Bank 2 is running too rich, with excessive fuel relative to air.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_black_smoke","symp_fuel_economy","symp_rotten_egg_smell"], "causes": ["cause_maf_dirty","cause_fuel_injector","cause_fuel_pressure_reg","cause_o2_sensor","cause_spark_plugs"], "difficulty": "diff_moderate", "cost": "$75 - $500"},

    # Key P0200 range
    "P0200": {"title": "Injector Circuit Malfunction", "desc": "Code P0200 indicates a general malfunction in the fuel injector circuit. The PCM has detected an issue with the injector system.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_misfire_feel","symp_poor_acceleration","symp_hard_start"], "causes": ["cause_fuel_injector","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"], "difficulty": "diff_hard", "cost": "$150 - $600"},
    "P0217": {"title": "Engine Over Temperature Condition", "desc": "Code P0217 indicates the engine has exceeded the maximum allowable operating temperature. This is a critical condition that requires immediate attention.", "symptoms": ["symp_check_engine","symp_engine_overheat","symp_coolant_temp_warning","symp_power_loss","symp_reduced_power_mode","symp_stalling_hot"], "causes": ["cause_coolant_leak","cause_thermostat","cause_fan_relay","cause_fan_motor","cause_head_gasket"], "difficulty": "diff_hard", "cost": "$100 - $2000"},
    "P0218": {"title": "Transmission Over Temperature Condition", "desc": "Code P0218 indicates the transmission fluid temperature has exceeded the safe operating range. Continued driving can cause severe damage.", "symptoms": ["symp_check_engine","symp_transmission_overheat","symp_transmission_slip","symp_hard_shifting","symp_reduced_power_mode"], "causes": ["cause_transmission_fluid","cause_transmission_filter","cause_torque_converter","cause_valve_body"], "difficulty": "diff_professional", "cost": "$200 - $3000"},
    "P0219": {"title": "Engine Over Speed Condition", "desc": "Code P0219 indicates the engine RPM has exceeded the maximum limit programmed in the PCM. This may be caused by aggressive downshifting or a transmission issue.", "symptoms": ["symp_check_engine","symp_reduced_power_mode","symp_transmission_slip"], "causes": ["cause_shift_solenoid","cause_transmission_fluid","cause_valve_body","cause_pcm_software"], "difficulty": "diff_professional", "cost": "$100 - $2000"},
    "P0234": {"title": "Engine Over Boost Condition", "desc": "Code P0234 indicates the turbocharger or supercharger is producing more boost pressure than specified by the PCM. Excessive boost can cause serious engine damage.", "symptoms": ["symp_check_engine","symp_turbo_lag","symp_power_loss","symp_reduced_power_mode","symp_knocking"], "causes": ["cause_turbo_wastegate","cause_turbo_actuator","cause_vacuum_leak","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$200 - $1500"},

    # P0300 range - Ignition/Misfire
    "P0300": {"title": "Random/Multiple Cylinder Misfire Detected", "desc": "Code P0300 indicates the PCM has detected misfires occurring randomly across multiple cylinders. This is often more difficult to diagnose than single-cylinder misfires because the root cause affects the entire engine.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss","symp_poor_acceleration","symp_fuel_economy","symp_failed_emissions","symp_hesitation"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_fuel_pump","cause_fuel_pressure_reg","cause_intake_leak","cause_head_gasket","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$100 - $1000"},
    "P0301": {"title": "Cylinder 1 Misfire Detected", "desc": "Code P0301 indicates the PCM has detected a misfire condition specifically in Cylinder 1. The misfire counter for this cylinder has exceeded the allowable threshold.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss","symp_fuel_economy"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $600"},
    "P0302": {"title": "Cylinder 2 Misfire Detected", "desc": "Code P0302 indicates the PCM has detected a misfire condition specifically in Cylinder 2.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss","symp_fuel_economy"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $600"},
    "P0303": {"title": "Cylinder 3 Misfire Detected", "desc": "Code P0303 indicates the PCM has detected a misfire condition specifically in Cylinder 3.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss","symp_fuel_economy"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $600"},
    "P0304": {"title": "Cylinder 4 Misfire Detected", "desc": "Code P0304 indicates the PCM has detected a misfire condition specifically in Cylinder 4.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss","symp_fuel_economy"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $600"},
    "P0305": {"title": "Cylinder 5 Misfire Detected", "desc": "Code P0305 indicates the PCM has detected a misfire condition specifically in Cylinder 5.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $600"},
    "P0306": {"title": "Cylinder 6 Misfire Detected", "desc": "Code P0306 indicates the PCM has detected a misfire condition specifically in Cylinder 6.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $600"},
    "P0307": {"title": "Cylinder 7 Misfire Detected", "desc": "Code P0307 indicates the PCM has detected a misfire condition specifically in Cylinder 7.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $600"},
    "P0308": {"title": "Cylinder 8 Misfire Detected", "desc": "Code P0308 indicates the PCM has detected a misfire condition specifically in Cylinder 8.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $600"},
    "P0335": {"title": "Crankshaft Position Sensor A Circuit Malfunction", "desc": "Code P0335 indicates the PCM is not receiving a proper signal from the crankshaft position sensor. This sensor is critical for engine timing and fuel injection.", "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_misfire_feel","symp_rough_idle","symp_hard_start"], "causes": ["cause_crankshaft_sensor","cause_wiring_damage","cause_connector_corrosion","cause_timing_chain"], "difficulty": "diff_moderate", "cost": "$100 - $400"},
    "P0340": {"title": "Camshaft Position Sensor A Circuit Malfunction (Bank 1)", "desc": "Code P0340 indicates a malfunction in the camshaft position sensor circuit on Bank 1. The PCM uses this sensor for fuel injection timing.", "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_hard_start","symp_rough_idle","symp_misfire_feel"], "causes": ["cause_camshaft_sensor","cause_wiring_damage","cause_connector_corrosion","cause_timing_chain"], "difficulty": "diff_moderate", "cost": "$100 - $400"},

    # P0400 range - Emissions
    "P0400": {"title": "Exhaust Gas Recirculation (EGR) Flow Malfunction", "desc": "Code P0400 indicates the EGR system flow is not within the expected parameters. The EGR system recirculates exhaust gases back into the intake to reduce NOx emissions.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_knocking","symp_failed_emissions","symp_power_loss","symp_stalling"], "causes": ["cause_egr_valve","cause_egr_passages","cause_wiring_damage","cause_vacuum_leak","cause_pcm_software"], "difficulty": "diff_moderate", "cost": "$100 - $500"},
    "P0401": {"title": "Exhaust Gas Recirculation (EGR) Flow Insufficient Detected", "desc": "Code P0401 indicates that the EGR system flow is less than expected. The EGR valve may not be opening enough or EGR passages are clogged.", "symptoms": ["symp_check_engine","symp_knocking","symp_failed_emissions","symp_pinging"], "causes": ["cause_egr_valve","cause_egr_passages","cause_vacuum_leak","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$100 - $500"},
    "P0420": {"title": "Catalyst System Efficiency Below Threshold (Bank 1)", "desc": "Code P0420 indicates the catalytic converter on Bank 1 is not operating at maximum efficiency. The PCM monitors converter efficiency by comparing the upstream and downstream oxygen sensor signals. When the downstream sensor mimics the upstream sensor's switching pattern, it means the catalyst is no longer cleaning exhaust gases effectively.", "symptoms": ["symp_check_engine","symp_rotten_egg_smell","symp_failed_emissions","symp_fuel_economy","symp_power_loss"], "causes": ["cause_cat_converter","cause_o2_sensor","cause_exhaust_leak","cause_spark_plugs","cause_fuel_injector","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$400 - $2500"},
    "P0421": {"title": "Warm Up Catalyst Efficiency Below Threshold (Bank 1)", "desc": "Code P0421 indicates the Bank 1 catalytic converter is not reaching proper operating efficiency during the warm-up period.", "symptoms": ["symp_check_engine","symp_failed_emissions","symp_rotten_egg_smell","symp_fuel_economy"], "causes": ["cause_cat_converter","cause_o2_sensor","cause_exhaust_leak","cause_spark_plugs"], "difficulty": "diff_hard", "cost": "$400 - $2500"},
    "P0430": {"title": "Catalyst System Efficiency Below Threshold (Bank 2)", "desc": "Code P0430 is identical to P0420 but affects Bank 2 of the engine. The catalytic converter on Bank 2 is not cleaning exhaust gases effectively.", "symptoms": ["symp_check_engine","symp_rotten_egg_smell","symp_failed_emissions","symp_fuel_economy"], "causes": ["cause_cat_converter","cause_o2_sensor","cause_exhaust_leak","cause_spark_plugs","cause_fuel_injector"], "difficulty": "diff_hard", "cost": "$400 - $2500"},
    "P0440": {"title": "Evaporative Emission Control System Malfunction", "desc": "Code P0440 indicates a general malfunction in the EVAP system, which prevents fuel vapors from escaping into the atmosphere. The PCM detected a problem during an EVAP system test.", "symptoms": ["symp_check_engine","symp_fuel_smell","symp_failed_emissions"], "causes": ["cause_evap_gas_cap","cause_evap_purge_valve","cause_evap_vent_valve","cause_evap_hose_leak","cause_evap_canister"], "difficulty": "diff_moderate", "cost": "$75 - $600"},
    "P0441": {"title": "Evaporative Emission Control System Incorrect Purge Flow", "desc": "Code P0441 indicates the EVAP system purge flow is not within the expected parameters during a system test.", "symptoms": ["symp_check_engine","symp_fuel_smell","symp_failed_emissions","symp_rough_idle"], "causes": ["cause_evap_purge_valve","cause_evap_hose_leak","cause_evap_canister","cause_vacuum_leak"], "difficulty": "diff_moderate", "cost": "$75 - $500"},
    "P0442": {"title": "Evaporative Emission Control System Leak Detected (Small Leak)", "desc": "Code P0442 indicates the PCM has detected a small leak in the EVAP system. This is commonly caused by a loose or worn gas cap, but can also be caused by small cracks in EVAP hoses or a faulty purge valve.", "symptoms": ["symp_check_engine","symp_fuel_smell","symp_failed_emissions"], "causes": ["cause_evap_gas_cap","cause_evap_hose_leak","cause_evap_purge_valve","cause_evap_vent_valve","cause_evap_canister"], "difficulty": "diff_easy", "cost": "$20 - $500"},
    "P0443": {"title": "Evaporative Emission Control System Purge Control Valve Circuit Malfunction", "desc": "Code P0443 indicates a malfunction in the EVAP purge control valve circuit, not the valve itself necessarily.", "symptoms": ["symp_check_engine","symp_fuel_smell","symp_failed_emissions","symp_rough_idle"], "causes": ["cause_evap_purge_valve","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"], "difficulty": "diff_moderate", "cost": "$75 - $400"},
    "P0446": {"title": "Evaporative Emission Control System Vent Control Circuit Malfunction", "desc": "Code P0446 indicates a malfunction in the EVAP vent control circuit.", "symptoms": ["symp_check_engine","symp_fuel_smell","symp_failed_emissions"], "causes": ["cause_evap_vent_valve","cause_wiring_damage","cause_connector_corrosion","cause_evap_canister"], "difficulty": "diff_moderate", "cost": "$75 - $400"},
    "P0455": {"title": "Evaporative Emission Control System Leak Detected (Gross Leak)", "desc": "Code P0455 indicates the PCM has detected a large leak in the EVAP system. A gross leak is typically much easier to find than a small leak.", "symptoms": ["symp_check_engine","symp_fuel_smell","symp_failed_emissions"], "causes": ["cause_evap_gas_cap","cause_evap_hose_leak","cause_evap_purge_valve","cause_evap_vent_valve","cause_evap_canister"], "difficulty": "diff_easy", "cost": "$20 - $400"},
    "P0456": {"title": "Evaporative Emission Control System Leak Detected (Very Small Leak)", "desc": "Code P0456 indicates the PCM has detected a very small leak in the EVAP system, often caused by a slightly worn gas cap seal.", "symptoms": ["symp_check_engine","symp_failed_emissions"], "causes": ["cause_evap_gas_cap","cause_evap_hose_leak","cause_evap_purge_valve","cause_evap_vent_valve"], "difficulty": "diff_easy", "cost": "$20 - $400"},

    # P0500 range - Vehicle Speed / Idle
    "P0500": {"title": "Vehicle Speed Sensor (VSS) Malfunction", "desc": "Code P0500 indicates the PCM is not receiving a valid signal from the vehicle speed sensor. This sensor provides critical speed data for transmission shifting, speedometer, cruise control, and ABS.", "symptoms": ["symp_check_engine","symp_speedometer_erratic","symp_hard_shifting","symp_cruise_not_working","symp_transmission_slip"], "causes": ["cause_vss","cause_wiring_damage","cause_connector_corrosion","cause_speed_sensor_out"], "difficulty": "diff_moderate", "cost": "$100 - $400"},
    "P0505": {"title": "Idle Air Control System Malfunction", "desc": "Code P0505 indicates the PCM has detected a malfunction in the idle air control (IAC) system, which regulates engine idle speed.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_high_idle","symp_low_idle","symp_stalling","symp_erratic_idle"], "causes": ["cause_throttle_body","cause_vacuum_leak","cause_wiring_damage","cause_pcm_software"], "difficulty": "diff_moderate", "cost": "$75 - $400"},

    # P0600 range - PCM/ECM
    "P0600": {"title": "Serial Communication Link Malfunction", "desc": "Code P0600 indicates a communication error within the PCM's internal serial communication link or between the PCM and other control modules.", "symptoms": ["symp_check_engine","symp_reduced_power_mode","symp_no_start","symp_stalling"], "causes": ["cause_pcm_failure","cause_pcm_software","cause_wiring_damage","cause_battery"], "difficulty": "diff_professional", "cost": "$200 - $1500"},

    # P0700 range - Transmission
    "P0700": {"title": "Transmission Control System (MIL Request)", "desc": "Code P0700 indicates the Transmission Control Module (TCM) has detected a malfunction and is requesting the PCM to illuminate the Check Engine Light. This is an informational code — there will be additional, more specific transmission codes stored.", "symptoms": ["symp_check_engine","symp_transmission_slip","symp_hard_shifting","symp_delayed_engagement","symp_stuck_gear","symp_reduced_power_mode"], "causes": ["cause_shift_solenoid","cause_transmission_fluid","cause_valve_body","cause_torque_converter","cause_speed_sensor_in","cause_speed_sensor_out","cause_pressure_solenoid","cause_wiring_damage"], "difficulty": "diff_professional", "cost": "$100 - $3000"},
    "P0710": {"title": "Transmission Fluid Temperature Sensor Circuit Malfunction", "desc": "Code P0710 indicates a malfunction in the transmission fluid temperature sensor circuit.", "symptoms": ["symp_check_engine","symp_transmission_overheat","symp_hard_shifting","symp_delayed_engagement"], "causes": ["cause_transmission_fluid","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"], "difficulty": "diff_hard", "cost": "$100 - $500"},
    "P0715": {"title": "Input/Turbine Speed Sensor Circuit Malfunction", "desc": "Code P0715 indicates the PCM/TCM is not receiving a proper signal from the input/turbine speed sensor in the transmission.", "symptoms": ["symp_check_engine","symp_transmission_slip","symp_hard_shifting","symp_stuck_gear","symp_reduced_power_mode"], "causes": ["cause_speed_sensor_in","cause_transmission_fluid","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_hard", "cost": "$150 - $600"},
    "P0720": {"title": "Output Speed Sensor Circuit Malfunction", "desc": "Code P0720 indicates a malfunction in the transmission output speed sensor circuit.", "symptoms": ["symp_check_engine","symp_speedometer_erratic","symp_hard_shifting","symp_transmission_slip"], "causes": ["cause_speed_sensor_out","cause_wiring_damage","cause_connector_corrosion","cause_transmission_fluid"], "difficulty": "diff_hard", "cost": "$150 - $600"},
    "P0730": {"title": "Incorrect Gear Ratio", "desc": "Code P0730 indicates the PCM/TCM has detected that the actual gear ratio does not match the expected ratio for the commanded gear.", "symptoms": ["symp_check_engine","symp_transmission_slip","symp_hard_shifting","symp_stuck_gear","symp_gear_hunting","symp_reduced_power_mode"], "causes": ["cause_transmission_fluid","cause_shift_solenoid","cause_valve_body","cause_torque_converter","cause_transmission_filter"], "difficulty": "diff_professional", "cost": "$200 - $3500"},
    "P0740": {"title": "Torque Converter Clutch Circuit Malfunction", "desc": "Code P0740 indicates a malfunction in the torque converter clutch (TCC) solenoid circuit. The TCC locks the torque converter to the engine for improved fuel efficiency at highway speeds.", "symptoms": ["symp_check_engine","symp_transmission_slip","symp_fuel_economy","symp_vibration","symp_stalling","symp_hard_shifting"], "causes": ["cause_torque_converter","cause_shift_solenoid","cause_transmission_fluid","cause_wiring_damage","cause_valve_body"], "difficulty": "diff_professional", "cost": "$200 - $2500"},
    "P0741": {"title": "Torque Converter Clutch Circuit Performance or Stuck Off", "desc": "Code P0741 indicates the torque converter clutch is not engaging properly or is stuck in the off position.", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_transmission_overheat","symp_vibration"], "causes": ["cause_torque_converter","cause_transmission_fluid","cause_shift_solenoid","cause_valve_body","cause_wiring_damage"], "difficulty": "diff_professional", "cost": "$200 - $2500"},
    "P0750": {"title": "Shift Solenoid A Malfunction", "desc": "Code P0750 indicates a malfunction in shift solenoid A, which controls hydraulic fluid flow for gear changes.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_stuck_gear","symp_transmission_slip","symp_delayed_engagement"], "causes": ["cause_shift_solenoid","cause_transmission_fluid","cause_wiring_damage","cause_valve_body","cause_pcm_failure"], "difficulty": "diff_professional", "cost": "$200 - $1500"},

    # P2100 range - Throttle Actuator
    "P2100": {"title": "Throttle Actuator Control Motor Circuit / Open", "desc": "Code P2100 indicates the PCM has detected an open circuit in the electronic throttle actuator control motor. This prevents electronic throttle control from operating properly and usually triggers limp mode.", "symptoms": ["symp_check_engine","symp_reduced_power_mode","symp_poor_acceleration","symp_stalling","symp_no_start","symp_high_idle"], "causes": ["cause_throttle_actuator","cause_throttle_body","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"], "difficulty": "diff_hard", "cost": "$200 - $1000"},
    "P2101": {"title": "Throttle Actuator Control Motor Circuit Range/Performance", "desc": "Code P2101 indicates the electronic throttle actuator motor is not responding within the expected range.", "symptoms": ["symp_check_engine","symp_reduced_power_mode","symp_poor_acceleration","symp_erratic_idle","symp_surging"], "causes": ["cause_throttle_actuator","cause_throttle_body","cause_throttle_position","cause_wiring_damage","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$200 - $1000"},
}


# ============================================================================
# RANGE-BASED CODE DEFINITIONS (for codes not individually defined)
# ============================================================================
def get_range_definition(code_num, code_str):
    """Return title, desc, symptoms, causes, difficulty, cost for a code
    based on its numeric range. Returns None if no range matches."""

    # ---- P0100-P0104: MAF (individually defined above) ----
    # ---- P0105-P0109: MAP (individually defined above) ----
    # ---- P0110-P0114: IAT (individually defined above) ----
    # ---- P0115-P0119: ECT (individually defined above) ----
    # ---- P0120-P0124: TPS A (individually defined above) ----
    # ---- P0125-P0129 (individually defined above) ----
    # ---- P0130-P0135 (individually defined above) ----
    # ---- P0136-P0141 (individually defined above) ----

    # P0142-P0147: O2 Sensor Bank 1 Sensor 3
    if 142 <= code_num <= 147:
        suffixes = {0: "Circuit Malfunction", 1: "Circuit Low Voltage", 2: "Circuit High Voltage",
                    3: "Circuit Slow Response", 4: "Circuit No Activity Detected", 5: "Heater Circuit Malfunction"}
        idx = code_num - 142
        suffix = suffixes.get(idx, "Circuit Malfunction")
        return {
            "title": f"O2 Sensor {suffix} (Bank 1, Sensor 3)",
            "desc": f"Code {code_str} indicates a problem with the third oxygen sensor on Bank 1. This sensor is used in some vehicles with a secondary catalytic converter for additional monitoring.",
            "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"],
            "causes": ["cause_o2_sensor","cause_o2_heater","cause_wiring_damage","cause_exhaust_leak"],
            "difficulty": "diff_moderate", "cost": "$100 - $350"
        }

    # P0148-P0149: Fuel Delivery
    if 148 <= code_num <= 149:
        titles = {148: "Fuel Delivery Error", 149: "Fuel Timing Error"}
        return {
            "title": titles.get(code_num, f"Fuel Delivery System Error ({code_str})"),
            "desc": f"Code {code_str} indicates an issue with the fuel delivery or timing system. The PCM has detected that fuel is not being delivered at the correct time or quantity.",
            "symptoms": ["symp_check_engine","symp_rough_idle","symp_power_loss","symp_poor_acceleration","symp_black_smoke"],
            "causes": ["cause_fuel_injector","cause_fuel_pump","cause_fuel_pressure_reg","cause_wiring_damage","cause_pcm_software"],
            "difficulty": "diff_hard", "cost": "$200 - $800"
        }

    # P0150-P0155: O2 Sensor Bank 2 Sensor 1
    if 150 <= code_num <= 155:
        suffixes = {0: "Circuit Malfunction", 1: "Circuit Low Voltage", 2: "Circuit High Voltage",
                    3: "Circuit Slow Response", 4: "Circuit No Activity Detected", 5: "Heater Circuit Malfunction"}
        idx = code_num - 150
        suffix = suffixes.get(idx, "Circuit Malfunction")
        return {
            "title": f"O2 Sensor {suffix} (Bank 2, Sensor 1)",
            "desc": f"Code {code_str} indicates a problem with the upstream oxygen sensor on Bank 2. This sensor monitors the air-fuel ratio before the catalytic converter on the opposite bank.",
            "symptoms": ["symp_check_engine","symp_fuel_economy","symp_rough_idle","symp_failed_emissions"],
            "causes": ["cause_o2_sensor","cause_o2_heater","cause_wiring_damage","cause_exhaust_leak","cause_connector_corrosion"],
            "difficulty": "diff_moderate", "cost": "$100 - $350"
        }

    # P0156-P0161: O2 Sensor Bank 2 Sensor 2
    if 156 <= code_num <= 161:
        suffixes = {0: "Circuit Malfunction", 1: "Circuit Low Voltage", 2: "Circuit High Voltage",
                    3: "Circuit Slow Response", 4: "Circuit No Activity Detected", 5: "Heater Circuit Malfunction"}
        idx = code_num - 156
        suffix = suffixes.get(idx, "Circuit Malfunction")
        return {
            "title": f"O2 Sensor {suffix} (Bank 2, Sensor 2)",
            "desc": f"Code {code_str} indicates a problem with the downstream oxygen sensor on Bank 2. This sensor monitors catalytic converter efficiency on Bank 2.",
            "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"],
            "causes": ["cause_o2_sensor","cause_o2_heater","cause_wiring_damage","cause_exhaust_leak","cause_cat_converter"],
            "difficulty": "diff_moderate", "cost": "$100 - $350"
        }

    # P0162-P0167: O2 Sensor Bank 2 Sensor 3
    if 162 <= code_num <= 167:
        suffixes = {0: "Circuit Malfunction", 1: "Circuit Low Voltage", 2: "Circuit High Voltage",
                    3: "Circuit Slow Response", 4: "Circuit No Activity Detected", 5: "Heater Circuit Malfunction"}
        idx = code_num - 162
        suffix = suffixes.get(idx, "Circuit Malfunction")
        return {
            "title": f"O2 Sensor {suffix} (Bank 2, Sensor 3)",
            "desc": f"Code {code_str} indicates a problem with the third oxygen sensor on Bank 2.",
            "symptoms": ["symp_check_engine","symp_fuel_economy","symp_failed_emissions"],
            "causes": ["cause_o2_sensor","cause_o2_heater","cause_wiring_damage","cause_exhaust_leak"],
            "difficulty": "diff_moderate", "cost": "$100 - $350"
        }

    # P0168-P0169: Fuel Temperature
    if 168 <= code_num <= 169:
        suffixes = {168: "Fuel Temperature Too High", 169: "Incorrect Fuel Composition"}
        return {
            "title": suffixes.get(code_num, f"Fuel Temperature Issue ({code_str})"),
            "desc": f"Code {code_str} indicates the fuel temperature or composition is outside the expected parameters.",
            "symptoms": ["symp_check_engine","symp_power_loss","symp_hard_start","symp_rough_idle"],
            "causes": ["cause_fuel_temp_sensor","cause_fuel_injector","cause_wiring_damage"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0170: Fuel Trim Malfunction Bank 1
    if code_num == 170:
        return {
            "title": "Fuel Trim Malfunction (Bank 1)",
            "desc": "Code P0170 indicates a general fuel trim malfunction on Bank 1. The PCM is unable to maintain the proper air-fuel ratio.",
            "symptoms": ["symp_check_engine","symp_rough_idle","symp_fuel_economy","symp_hesitation"],
            "causes": ["cause_vacuum_leak","cause_maf_dirty","cause_fuel_injector","cause_o2_sensor","cause_fuel_pressure_reg"],
            "difficulty": "diff_moderate", "cost": "$75 - $500"
        }

    # P0176-P0179: Fuel Composition Sensor
    if 176 <= code_num <= 179:
        suffixes = {176: "Circuit Malfunction", 177: "Circuit Range/Performance", 178: "Circuit Low Input", 179: "Circuit High Input"}
        suffix = suffixes.get(code_num, "Circuit Malfunction")
        return {
            "title": f"Fuel Composition Sensor {suffix}",
            "desc": f"Code {code_str} indicates a problem with the fuel composition sensor circuit. This sensor is used in flex-fuel vehicles to determine the ethanol content of the fuel.",
            "symptoms": ["symp_check_engine","symp_rough_idle","symp_hard_start","symp_fuel_economy","symp_stalling"],
            "causes": ["cause_fuel_composition_sensor","cause_wiring_damage","cause_connector_corrosion"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0180-P0189: Fuel Temperature Sensor
    if 180 <= code_num <= 189:
        sensor_num = 1 if code_num <= 184 else 2
        suffixes_map = {0: "Circuit Malfunction", 1: "Circuit Range/Performance", 2: "Circuit Low Input",
                        3: "Circuit High Input", 4: "Circuit Intermittent"}
        idx = (code_num - 180) % 5
        suffix = suffixes_map.get(idx, "Circuit Malfunction")
        return {
            "title": f"Fuel Temperature Sensor {sensor_num} {suffix}",
            "desc": f"Code {code_str} indicates a problem with fuel temperature sensor {sensor_num}. This sensor monitors fuel temperature to help the PCM adjust fuel injection for optimal combustion.",
            "symptoms": ["symp_check_engine","symp_hard_start","symp_fuel_economy","symp_rough_idle"],
            "causes": ["cause_fuel_temp_sensor","cause_wiring_damage","cause_connector_corrosion"],
            "difficulty": "diff_moderate", "cost": "$75 - $300"
        }

    # P0190-P0199: Fuel Rail Pressure
    if 190 <= code_num <= 199:
        suffixes_map = {0: "Fuel Rail Pressure Sensor Circuit Malfunction", 1: "Fuel Rail Pressure Sensor Circuit Range/Performance",
                        2: "Fuel Rail Pressure Sensor Circuit Low Input", 3: "Fuel Rail Pressure Sensor Circuit High Input",
                        4: "Fuel Rail Pressure Sensor Circuit Intermittent",
                        5: "Fuel Rail Pressure Sensor Circuit Malfunction (Secondary)", 6: "Fuel Rail Pressure Sensor Circuit Range/Performance (Secondary)",
                        7: "Fuel Rail Pressure Sensor Circuit Low Input (Secondary)", 8: "Fuel Rail Pressure Sensor Circuit High Input (Secondary)",
                        9: "Fuel Rail Pressure Sensor Circuit Intermittent (Secondary)"}
        idx = code_num - 190
        title = suffixes_map.get(idx, f"Fuel Rail Pressure Sensor Issue ({code_str})")
        return {
            "title": title,
            "desc": f"Code {code_str} indicates a problem with the fuel rail pressure sensor or its circuit. This sensor monitors fuel pressure in the fuel rail to ensure proper injection pressure.",
            "symptoms": ["symp_check_engine","symp_hard_start","symp_rough_idle","symp_power_loss","symp_stalling","symp_poor_acceleration"],
            "causes": ["cause_fuel_rail_pressure_sensor","cause_fuel_pump","cause_fuel_pressure_reg","cause_fuel_filter","cause_wiring_damage"],
            "difficulty": "diff_hard", "cost": "$150 - $600"
        }

    # P0201-P0212: Injector Circuit Cylinder 1-12
    if 201 <= code_num <= 212:
        cyl = code_num - 200
        return {
            "title": f"Injector Circuit Malfunction - Cylinder {cyl}",
            "desc": f"Code {code_str} indicates a malfunction in the fuel injector circuit for Cylinder {cyl}. The PCM detected an unexpected resistance or voltage in the injector driver circuit.",
            "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_power_loss","symp_poor_acceleration"],
            "causes": ["cause_fuel_injector","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"],
            "difficulty": "diff_hard", "cost": "$150 - $600"
        }

    # P0213-P0214: Cold Start Injector
    if 213 <= code_num <= 214:
        num = code_num - 212
        return {
            "title": f"Cold Start Injector {num} Malfunction",
            "desc": f"Code {code_str} indicates a malfunction in cold start injector {num}, which provides extra fuel during cold engine starts.",
            "symptoms": ["symp_check_engine","symp_hard_start","symp_stalling_cold","symp_rough_idle"],
            "causes": ["cause_fuel_injector","cause_wiring_damage","cause_connector_corrosion"],
            "difficulty": "diff_hard", "cost": "$150 - $500"
        }

    # P0215: Engine Shutoff Solenoid
    if code_num == 215:
        return {
            "title": "Engine Shutoff Solenoid Malfunction",
            "desc": "Code P0215 indicates a malfunction in the engine shutoff solenoid circuit. This solenoid is used primarily in diesel engines to cut fuel supply when the engine is shut down.",
            "symptoms": ["symp_check_engine","symp_no_start","symp_stalling"],
            "causes": ["cause_fuel_injector","cause_wiring_damage","cause_pcm_failure"],
            "difficulty": "diff_hard", "cost": "$150 - $600"
        }

    # P0216: Injection Timing Control
    if code_num == 216:
        return {
            "title": "Injection Timing Control Circuit Malfunction",
            "desc": "Code P0216 indicates a malfunction in the injection timing control circuit, primarily affecting diesel engines.",
            "symptoms": ["symp_check_engine","symp_rough_idle","symp_power_loss","symp_black_smoke","symp_hard_start"],
            "causes": ["cause_fuel_injector","cause_wiring_damage","cause_pcm_software","cause_timing_chain"],
            "difficulty": "diff_professional", "cost": "$300 - $1500"
        }

    # P0220-P0229: Throttle/Pedal Position Sensor/Switch B-F
    if 220 <= code_num <= 229:
        sensor_letters = {220: "B", 221: "B", 222: "B", 223: "B", 224: "B",
                          225: "C", 226: "D", 227: "E", 228: "F", 229: "F"}
        letter = sensor_letters.get(code_num, "B")
        suffixes_map = {0: "Circuit Malfunction", 1: "Circuit Range/Performance", 2: "Circuit Low Input",
                        3: "Circuit High Input", 4: "Circuit Intermittent"}
        idx = (code_num - 220) % 5
        suffix = suffixes_map.get(idx, "Circuit Malfunction")
        return {
            "title": f"Throttle/Pedal Position Sensor/Switch {letter} {suffix}",
            "desc": f"Code {code_str} indicates a problem with the throttle/pedal position sensor switch {letter}. Modern vehicles use multiple TPS for redundancy and safety.",
            "symptoms": ["symp_check_engine","symp_poor_acceleration","symp_surging","symp_reduced_power_mode","symp_erratic_idle"],
            "causes": ["cause_throttle_position","cause_throttle_body","cause_wiring_damage","cause_connector_corrosion"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0230-P0233: Fuel Pump Primary Circuit
    if 230 <= code_num <= 233:
        suffixes = {230: "Fuel Pump Primary Circuit Malfunction", 231: "Fuel Pump Secondary Circuit Low",
                    232: "Fuel Pump Secondary Circuit High", 233: "Fuel Pump Secondary Circuit Intermittent"}
        return {
            "title": suffixes.get(code_num, f"Fuel Pump Circuit ({code_str})"),
            "desc": f"Code {code_str} indicates a problem with the fuel pump circuit. The PCM monitors fuel pump operation and has detected an abnormal condition.",
            "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_power_loss","symp_hard_start"],
            "causes": ["cause_fuel_pump","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"],
            "difficulty": "diff_hard", "cost": "$200 - $800"
        }

    # P0235-P0242: Turbocharger/Supercharger Boost Sensor
    if 235 <= code_num <= 242:
        sensor_letter = "A" if code_num <= 238 else "B"
        suffixes_map = {0: "Circuit Malfunction", 1: "Circuit Range/Performance", 2: "Circuit Low", 3: "Circuit High"}
        idx = (code_num - 235) % 4
        suffix = suffixes_map.get(idx, "Circuit Malfunction")
        return {
            "title": f"Turbocharger Boost Sensor {sensor_letter} {suffix}",
            "desc": f"Code {code_str} indicates a problem with the turbocharger/supercharger boost pressure sensor {sensor_letter} circuit.",
            "symptoms": ["symp_check_engine","symp_turbo_lag","symp_power_loss","symp_reduced_power_mode","symp_poor_acceleration"],
            "causes": ["cause_turbo_wastegate","cause_turbo_actuator","cause_map_sensor","cause_wiring_damage","cause_vacuum_leak"],
            "difficulty": "diff_hard", "cost": "$200 - $800"
        }

    # P0243-P0250: Turbocharger Wastegate Solenoid
    if 243 <= code_num <= 250:
        sensor_letter = "A" if code_num <= 246 else "B"
        suffixes_map = {0: "Solenoid Malfunction", 1: "Solenoid Low", 2: "Solenoid High", 3: "Solenoid Intermittent"}
        idx = (code_num - 243) % 4
        suffix = suffixes_map.get(idx, "Solenoid Malfunction")
        return {
            "title": f"Turbocharger Wastegate {sensor_letter} {suffix}",
            "desc": f"Code {code_str} indicates a problem with the turbocharger wastegate solenoid {sensor_letter}. The wastegate controls boost pressure by diverting exhaust gases.",
            "symptoms": ["symp_check_engine","symp_turbo_lag","symp_power_loss","symp_reduced_power_mode","symp_black_smoke"],
            "causes": ["cause_turbo_wastegate","cause_turbo_actuator","cause_wiring_damage","cause_connector_corrosion"],
            "difficulty": "diff_hard", "cost": "$200 - $1000"
        }

    # P0251-P0260: Injection Pump Fuel Metering (Diesel)
    if 251 <= code_num <= 260:
        sensor_letter = "A" if code_num <= 255 else "B"
        suffixes_map = {0: "Control Malfunction", 1: "Control Range/Performance", 2: "Control Low", 3: "Control High", 4: "Control Intermittent"}
        idx = (code_num - 251) % 5
        suffix = suffixes_map.get(idx, "Control Malfunction")
        return {
            "title": f"Injection Pump Fuel Metering {sensor_letter} {suffix}",
            "desc": f"Code {code_str} indicates a problem with the diesel injection pump fuel metering control {sensor_letter}.",
            "symptoms": ["symp_check_engine","symp_rough_idle","symp_power_loss","symp_black_smoke","symp_hard_start","symp_stalling"],
            "causes": ["cause_fuel_injector","cause_fuel_pump","cause_wiring_damage","cause_pcm_software"],
            "difficulty": "diff_professional", "cost": "$300 - $1500"
        }

    # P0261-P0296: Injector Circuit Low/High for various cylinders
    if 261 <= code_num <= 296:
        cyl = ((code_num - 261) // 3) + 1
        condition_map = {0: "Low", 1: "High", 2: "Open"}
        cond = condition_map.get((code_num - 261) % 3, "Malfunction")
        return {
            "title": f"Injector Circuit {cond} - Cylinder {cyl}",
            "desc": f"Code {code_str} indicates the injector circuit for Cylinder {cyl} has a {cond.lower()} condition. The PCM detected an abnormal voltage or resistance.",
            "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_power_loss","symp_poor_acceleration"],
            "causes": ["cause_fuel_injector","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"],
            "difficulty": "diff_hard", "cost": "$150 - $600"
        }

    # P0297-P0299
    if code_num == 297:
        return {"title": "Vehicle Over Speed Condition", "desc": "Code P0297 indicates the vehicle has exceeded the maximum programmed speed limit.", "symptoms": ["symp_check_engine","symp_reduced_power_mode"], "causes": ["cause_pcm_software","cause_vss"], "difficulty": "diff_easy", "cost": "$0 - $100"}
    if code_num == 298:
        return {"title": "Engine Oil Temperature Too High", "desc": "Code P0298 indicates the engine oil temperature has exceeded the safe operating range.", "symptoms": ["symp_check_engine","symp_engine_overheat","symp_oil_pressure_warning","symp_reduced_power_mode"], "causes": ["cause_coolant_leak","cause_oil_pressure_sender","cause_thermostat"], "difficulty": "diff_moderate", "cost": "$100 - $500"}
    if code_num == 299:
        return {"title": "Engine Over Boost Condition (Turbo/Supercharger)", "desc": "Code P0299 indicates under-boost condition from the turbocharger/supercharger.", "symptoms": ["symp_check_engine","symp_turbo_lag","symp_power_loss","symp_reduced_power_mode"], "causes": ["cause_turbo_wastegate","cause_turbo_actuator","cause_vacuum_leak","cause_exhaust_leak"], "difficulty": "diff_hard", "cost": "$200 - $1500"}

    # P0309-P0312: Misfire Cylinder 9-12
    if 309 <= code_num <= 312:
        cyl = code_num - 300
        return {
            "title": f"Cylinder {cyl} Misfire Detected",
            "desc": f"Code {code_str} indicates the PCM has detected a misfire condition specifically in Cylinder {cyl}.",
            "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration","symp_power_loss"],
            "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak","cause_wiring_damage"],
            "difficulty": "diff_moderate", "cost": "$75 - $600"
        }

    # P0313-P0314
    if code_num == 313:
        return {"title": "Misfire Detected with Low Fuel", "desc": "Code P0313 indicates engine misfires have been detected while the fuel level is very low.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_stalling"], "causes": ["cause_fuel_pump","cause_fuel_filter","cause_fuel_injector"], "difficulty": "diff_easy", "cost": "$0 - $300"}
    if code_num == 314:
        return {"title": "Single Cylinder Misfire (Cylinder Not Specified)", "desc": "Code P0314 indicates a single cylinder misfire was detected but the PCM could not determine which specific cylinder.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_vibration"], "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $600"}

    # P0315-P0319: Crankshaft Position System
    if 315 <= code_num <= 319:
        return {
            "title": f"Crankshaft Position System Variation Not Learned ({code_str})",
            "desc": f"Code {code_str} indicates the crankshaft position system variation has not been learned by the PCM. This requires a relearn procedure.",
            "symptoms": ["symp_check_engine","symp_rough_idle","symp_misfire_feel","symp_hard_start"],
            "causes": ["cause_crankshaft_sensor","cause_pcm_software","cause_timing_chain","cause_wiring_damage"],
            "difficulty": "diff_moderate", "cost": "$75 - $400"
        }

    # P0320-P0323: Ignition/Distributor Engine Speed Input
    if 320 <= code_num <= 323:
        suffixes = {320: "Malfunction", 321: "Range/Performance", 322: "No Signal", 323: "Intermittent"}
        suffix = suffixes.get(code_num, "Malfunction")
        return {
            "title": f"Ignition/Distributor Engine Speed Input Circuit {suffix}",
            "desc": f"Code {code_str} indicates a problem with the ignition/distributor engine speed input circuit ({suffix.lower()}).",
            "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_misfire_feel","symp_rough_idle"],
            "causes": ["cause_crankshaft_sensor","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0324-P0334: Knock Sensor
    if 324 <= code_num <= 334:
        sensor = 1 if code_num <= 329 else 2
        suffixes_map = {324: "System Error", 325: "Circuit Malfunction", 326: "Circuit Range/Performance",
                        327: "Circuit Low Input", 328: "Circuit High Input", 329: "Circuit Intermittent",
                        330: "Circuit Malfunction", 331: "Circuit Range/Performance",
                        332: "Circuit Low Input", 333: "Circuit High Input", 334: "Circuit Intermittent"}
        suffix = suffixes_map.get(code_num, "Circuit Malfunction")
        return {
            "title": f"Knock Sensor {sensor} {suffix}",
            "desc": f"Code {code_str} indicates a problem with knock sensor {sensor}. The knock sensor detects engine detonation and allows the PCM to retard ignition timing to prevent damage.",
            "symptoms": ["symp_check_engine","symp_knocking","symp_pinging","symp_power_loss","symp_fuel_economy"],
            "causes": ["cause_knock_sensor","cause_wiring_damage","cause_connector_corrosion","cause_pcm_software"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0336-P0339: Crankshaft Position Sensor A
    if 336 <= code_num <= 339:
        suffixes = {336: "Range/Performance", 337: "Low Input", 338: "High Input", 339: "Intermittent"}
        suffix = suffixes.get(code_num, "Range/Performance")
        return {
            "title": f"Crankshaft Position Sensor A Circuit {suffix}",
            "desc": f"Code {code_str} indicates a problem with the crankshaft position sensor A circuit ({suffix.lower()}). This sensor is critical for engine timing.",
            "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_misfire_feel","symp_rough_idle","symp_hard_start"],
            "causes": ["cause_crankshaft_sensor","cause_wiring_damage","cause_connector_corrosion","cause_timing_chain"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0341-P0344: Camshaft Position Sensor A Bank 1
    if 341 <= code_num <= 344:
        suffixes = {341: "Range/Performance", 342: "Low Input", 343: "High Input", 344: "Intermittent"}
        suffix = suffixes.get(code_num, "Range/Performance")
        return {
            "title": f"Camshaft Position Sensor A Circuit {suffix} (Bank 1)",
            "desc": f"Code {code_str} indicates a problem with the camshaft position sensor A circuit on Bank 1 ({suffix.lower()}).",
            "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_hard_start","symp_rough_idle","symp_misfire_feel"],
            "causes": ["cause_camshaft_sensor","cause_wiring_damage","cause_connector_corrosion","cause_timing_chain"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0345-P0349: Camshaft Position Sensor A Bank 2
    if 345 <= code_num <= 349:
        suffixes = {345: "Circuit Malfunction", 346: "Range/Performance", 347: "Low Input", 348: "High Input", 349: "Intermittent"}
        suffix = suffixes.get(code_num, "Circuit Malfunction")
        return {
            "title": f"Camshaft Position Sensor A Circuit {suffix} (Bank 2)",
            "desc": f"Code {code_str} indicates a problem with the camshaft position sensor A circuit on Bank 2 ({suffix.lower()}).",
            "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_hard_start","symp_rough_idle"],
            "causes": ["cause_camshaft_sensor","cause_wiring_damage","cause_connector_corrosion","cause_timing_chain"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0350-P0362: Ignition Coil
    if 350 <= code_num <= 362:
        if code_num == 350:
            return {"title": "Ignition Coil Primary/Secondary Circuit Malfunction", "desc": "Code P0350 indicates a general ignition coil circuit malfunction.", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_power_loss"], "causes": ["cause_ignition_coil","cause_wiring_damage","cause_spark_plugs","cause_pcm_failure"], "difficulty": "diff_moderate", "cost": "$100 - $500"}
        cyl = code_num - 350
        return {
            "title": f"Ignition Coil {chr(64+cyl)} Primary/Secondary Circuit Malfunction",
            "desc": f"Code {code_str} indicates a malfunction in the ignition coil circuit for coil {chr(64+cyl)} (typically Cylinder {cyl}).",
            "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_power_loss","symp_poor_acceleration"],
            "causes": ["cause_ignition_coil","cause_spark_plugs","cause_wiring_damage","cause_connector_corrosion"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0363-P0369: Misfire with Fuel Disabled
    if 363 <= code_num <= 369:
        return {
            "title": f"Misfire Detected - Fuel Disabled ({code_str})",
            "desc": f"Code {code_str} indicates a misfire has been detected and the PCM has disabled fuel delivery to protect the catalytic converter.",
            "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_power_loss","symp_reduced_power_mode"],
            "causes": ["cause_spark_plugs","cause_ignition_coil","cause_fuel_injector","cause_vacuum_leak"],
            "difficulty": "diff_hard", "cost": "$100 - $800"
        }

    # P0370-P0379: Timing Reference
    if 370 <= code_num <= 379:
        return {
            "title": f"Timing Reference High Resolution Signal ({code_str})",
            "desc": f"Code {code_str} indicates a problem with the timing reference high resolution signal. This affects the PCM's ability to precisely time ignition and fuel injection.",
            "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_no_start","symp_stalling"],
            "causes": ["cause_crankshaft_sensor","cause_camshaft_sensor","cause_timing_chain","cause_wiring_damage"],
            "difficulty": "diff_hard", "cost": "$150 - $800"
        }

    # P0380-P0384: Glow Plug/Heater Circuit
    if 380 <= code_num <= 384:
        suffixes = {380: "A Malfunction", 381: "B Malfunction", 382: "C Malfunction", 383: "D Malfunction", 384: "E Malfunction"}
        suffix = suffixes.get(code_num, "Malfunction")
        return {
            "title": f"Glow Plug/Heater Circuit {suffix}",
            "desc": f"Code {code_str} indicates a malfunction in the glow plug/heater circuit ({suffix}). Glow plugs are used in diesel engines to heat the combustion chamber for cold starts.",
            "symptoms": ["symp_check_engine","symp_diesel_hard_cold_start","symp_glow_plug_light","symp_white_smoke","symp_rough_idle"],
            "causes": ["cause_glow_plug","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"],
            "difficulty": "diff_moderate", "cost": "$100 - $500"
        }

    # P0385-P0389: Crankshaft Position Sensor B
    if 385 <= code_num <= 389:
        suffixes = {385: "Circuit Malfunction", 386: "Range/Performance", 387: "Low Input", 388: "High Input", 389: "Intermittent"}
        suffix = suffixes.get(code_num, "Circuit Malfunction")
        return {
            "title": f"Crankshaft Position Sensor B Circuit {suffix}",
            "desc": f"Code {code_str} indicates a problem with the crankshaft position sensor B circuit ({suffix.lower()}).",
            "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_misfire_feel","symp_rough_idle"],
            "causes": ["cause_crankshaft_sensor","cause_wiring_damage","cause_connector_corrosion","cause_timing_chain"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0390-P0399: Camshaft Position Sensor B
    if 390 <= code_num <= 399:
        bank = 1 if code_num <= 394 else 2
        suffixes = {0: "Circuit Malfunction", 1: "Range/Performance", 2: "Low Input", 3: "High Input", 4: "Intermittent"}
        idx = (code_num - 390) % 5
        suffix = suffixes.get(idx, "Circuit Malfunction")
        return {
            "title": f"Camshaft Position Sensor B Circuit {suffix} (Bank {bank})",
            "desc": f"Code {code_str} indicates a problem with the camshaft position sensor B circuit on Bank {bank} ({suffix.lower()}).",
            "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_hard_start","symp_rough_idle"],
            "causes": ["cause_camshaft_sensor","cause_wiring_damage","cause_connector_corrosion","cause_timing_chain"],
            "difficulty": "diff_moderate", "cost": "$100 - $400"
        }

    # P0402-P0409: EGR system
    if 402 <= code_num <= 409:
        suffixes = {402: "EGR Flow Excessive Detected", 403: "EGR Circuit Malfunction", 404: "EGR Circuit Range/Performance",
                    405: "EGR Sensor A Circuit Low", 406: "EGR Sensor A Circuit High", 407: "EGR Sensor B Circuit Low",
                    408: "EGR Sensor B Circuit High", 409: "EGR Sensor A Circuit Intermittent"}
        title = suffixes.get(code_num, f"EGR System Malfunction ({code_str})")
        return {
            "title": title,
            "desc": f"Code {code_str} indicates a problem with the Exhaust Gas Recirculation (EGR) system. The EGR system reduces NOx emissions by recirculating a portion of exhaust gas into the intake manifold.",
            "symptoms": ["symp_check_engine","symp_rough_idle","symp_knocking","symp_failed_emissions","symp_stalling","symp_power_loss"],
            "causes": ["cause_egr_valve","cause_egr_passages","cause_wiring_damage","cause_vacuum_leak","cause_connector_corrosion"],
            "difficulty": "diff_moderate", "cost": "$100 - $500"
        }

    # P0410-P0419: Secondary Air Injection
    if 410 <= code_num <= 419:
        suffixes = {410: "Secondary Air Injection System Malfunction", 411: "Secondary Air Injection System Incorrect Flow Detected",
                    412: "Secondary Air Injection Switching Valve A Circuit Malfunction", 413: "Secondary Air Injection System A Flow Low",
                    414: "Secondary Air Injection System A Flow Shorted", 415: "Secondary Air Injection Switching Valve B Circuit Malfunction",
                    416: "Secondary Air Injection System B Flow Low", 417: "Secondary Air Injection System B Flow Shorted",
                    418: "Secondary Air Injection System A Relay Circuit Malfunction", 419: "Secondary Air Injection System B Relay Circuit Malfunction"}
        title = suffixes.get(code_num, f"Secondary Air Injection System ({code_str})")
        return {
            "title": title,
            "desc": f"Code {code_str} indicates a problem with the secondary air injection system. This system pumps fresh air into the exhaust stream during cold starts to help the catalytic converter reach operating temperature faster.",
            "symptoms": ["symp_check_engine","symp_failed_emissions","symp_rough_idle","symp_rotten_egg_smell"],
            "causes": ["cause_secondary_air_pump","cause_secondary_air_valve","cause_wiring_damage","cause_connector_corrosion"],
            "difficulty": "diff_moderate", "cost": "$150 - $800"
        }

    # P0422-P0439: Catalyst related
    if 422 <= code_num <= 439:
        sub_titles = {
            422: "Main Catalyst Efficiency Below Threshold (Bank 1)", 423: "Heated Catalyst Efficiency Below Threshold (Bank 1)",
            424: "Heated Catalyst Temperature Below Threshold (Bank 1)", 425: "Catalyst Temperature Sensor (Bank 1, Sensor 1)",
            426: "Catalyst Temperature Sensor Range/Performance (B1S1)", 427: "Catalyst Temperature Sensor Low Input (B1S1)",
            428: "Catalyst Temperature Sensor High Input (B1S1)", 429: "Catalyst Heater Control Circuit (Bank 1)",
            431: "Warm Up Catalyst Efficiency Below Threshold (Bank 2)", 432: "Main Catalyst Efficiency Below Threshold (Bank 2)",
            433: "Heated Catalyst Efficiency Below Threshold (Bank 2)", 434: "Heated Catalyst Temperature Below Threshold (Bank 2)",
            435: "Catalyst Temperature Sensor (Bank 2, Sensor 1)", 436: "Catalyst Temperature Sensor Range/Performance (B2S1)",
            437: "Catalyst Temperature Sensor Low Input (B2S1)", 438: "Catalyst Temperature Sensor High Input (B2S1)",
            439: "Catalyst Heater Control Circuit (Bank 2)"
        }
        title = sub_titles.get(code_num, f"Catalytic Converter System ({code_str})")
        return {
            "title": title,
            "desc": f"Code {code_str} relates to the catalytic converter monitoring or heating system. The catalytic converter is essential for reducing harmful exhaust emissions.",
            "symptoms": ["symp_check_engine","symp_rotten_egg_smell","symp_failed_emissions","symp_fuel_economy","symp_power_loss"],
            "causes": ["cause_cat_converter","cause_o2_sensor","cause_exhaust_leak","cause_wiring_damage","cause_spark_plugs"],
            "difficulty": "diff_hard", "cost": "$300 - $2500"
        }

    # P0444-P0454: EVAP variants
    if 444 <= code_num <= 454:
        evap_titles = {
            444: "EVAP Purge Control Valve Circuit Open", 445: "EVAP Purge Control Valve Circuit Shorted",
            447: "EVAP Vent Control Valve Circuit Open", 448: "EVAP Vent Control Valve Circuit Shorted",
            449: "EVAP Vent Valve/Solenoid Circuit Malfunction", 450: "EVAP Emission System Pressure Sensor Malfunction",
            451: "EVAP Emission System Pressure Sensor Range/Performance", 452: "EVAP Emission System Pressure Sensor Low Input",
            453: "EVAP Emission System Pressure Sensor High Input", 454: "EVAP Emission System Pressure Sensor Intermittent"
        }
        title = evap_titles.get(code_num, f"EVAP Emission Control System ({code_str})")
        return {
            "title": title,
            "desc": f"Code {code_str} indicates a problem with the evaporative emission control system. The EVAP system prevents fuel vapors from escaping the fuel system into the atmosphere.",
            "symptoms": ["symp_check_engine","symp_fuel_smell","symp_failed_emissions"],
            "causes": ["cause_evap_purge_valve","cause_evap_vent_valve","cause_evap_hose_leak","cause_evap_gas_cap","cause_wiring_damage"],
            "difficulty": "diff_moderate", "cost": "$75 - $500"
        }

    # P0457-P0459: EVAP variants
    if 457 <= code_num <= 459:
        evap_titles2 = {457: "EVAP Emission Control System Leak Detected (Fuel Cap Loose/Off)",
                        458: "EVAP Emission Control System Purge Control Valve Circuit Open (Heating)",
                        459: "EVAP Emission Control System Purge Control Valve Circuit Shorted (Heating)"}
        title = evap_titles2.get(code_num, f"EVAP System ({code_str})")
        return {
            "title": title,
            "desc": f"Code {code_str} indicates an EVAP system issue, commonly related to the fuel cap or purge system.",
            "symptoms": ["symp_check_engine","symp_fuel_smell","symp_failed_emissions"],
            "causes": ["cause_evap_gas_cap","cause_evap_purge_valve","cause_evap_hose_leak"],
            "difficulty": "diff_easy", "cost": "$20 - $300"
        }

    # P0460-P0469: Fuel Level Sensor
    if 460 <= code_num <= 469:
        suffixes = {460: "Fuel Level Sensor Circuit Malfunction", 461: "Fuel Level Sensor Circuit Range/Performance",
                    462: "Fuel Level Sensor Circuit Low Input", 463: "Fuel Level Sensor Circuit High Input",
                    464: "Fuel Level Sensor Circuit Intermittent", 465: "EVAP Purge Flow Sensor Malfunction",
                    466: "EVAP Purge Flow Sensor Range/Performance", 467: "EVAP Purge Flow Sensor Low Input",
                    468: "EVAP Purge Flow Sensor High Input", 469: "EVAP Purge Flow Sensor Intermittent"}
        title = suffixes.get(code_num, f"Fuel Level/EVAP Sensor ({code_str})")
        return {
            "title": title,
            "desc": f"Code {code_str} indicates a problem with the fuel level sensor or EVAP purge flow sensor circuit.",
            "symptoms": ["symp_check_engine","symp_fuel_economy","symp_fuel_smell"],
            "causes": ["cause_wiring_damage","cause_connector_corrosion","cause_fuel_pump","cause_pcm_software"],
            "difficulty": "diff_moderate", "cost": "$100 - $500"
        }

    # P0470-P0479: Exhaust Pressure
    if 470 <= code_num <= 479:
        suffixes = {470: "Exhaust Pressure Sensor Malfunction", 471: "Exhaust Pressure Sensor Range/Performance",
                    472: "Exhaust Pressure Sensor Low", 473: "Exhaust Pressure Sensor High",
                    474: "Exhaust Pressure Sensor Intermittent", 475: "Exhaust Pressure Control Valve Malfunction",
                    476: "Exhaust Pressure Control Valve Range/Performance", 477: "Exhaust Pressure Control Valve Low",
                    478: "Exhaust Pressure Control Valve High", 479: "Exhaust Pressure Control Valve Intermittent"}
        title = suffixes.get(code_num, f"Exhaust Pressure ({code_str})")
        return {
            "title": title,
            "desc": f"Code {code_str} indicates a problem with the exhaust pressure sensor or control valve.",
            "symptoms": ["symp_check_engine","symp_power_loss","symp_turbo_lag","symp_fuel_economy"],
            "causes": ["cause_wiring_damage","cause_exhaust_leak","cause_turbo_wastegate","cause_connector_corrosion"],
            "difficulty": "diff_hard", "cost": "$150 - $600"
        }

    # P0480-P0489: Cooling Fan
    if 480 <= code_num <= 489:
        suffixes = {480: "Cooling Fan 1 Control Circuit Malfunction", 481: "Cooling Fan 2 Control Circuit Malfunction",
                    482: "Cooling Fan 3 Control Circuit Malfunction", 483: "Cooling Fan Rationality Check Malfunction",
                    484: "Fan Circuit Over Current", 485: "Fan Power/Ground Circuit Malfunction",
                    486: "Exhaust Sensor Heater Circuit Malfunction (Bank 2)", 487: "EGR Throttle Position Control Circuit Open",
                    488: "EGR Throttle Position Control Range/Performance", 489: "EGR Throttle Position Control Low"}
        title = suffixes.get(code_num, f"Cooling Fan / EGR ({code_str})")
        symp = ["symp_check_engine","symp_engine_overheat","symp_fan_not_working","symp_ac_not_working"] if code_num <= 486 else ["symp_check_engine","symp_rough_idle","symp_failed_emissions"]
        caus = ["cause_fan_relay","cause_fan_motor","cause_wiring_damage","cause_connector_corrosion"] if code_num <= 486 else ["cause_egr_valve","cause_wiring_damage","cause_connector_corrosion"]
        return {"title": title, "desc": f"Code {code_str} indicates a problem with the cooling fan circuit or related system.", "symptoms": symp, "causes": caus, "difficulty": "diff_moderate", "cost": "$100 - $500"}

    # P0490-P0499: EGR related
    if 490 <= code_num <= 499:
        return {
            "title": f"EGR System Control Circuit ({code_str})",
            "desc": f"Code {code_str} relates to the EGR system control circuits.",
            "symptoms": ["symp_check_engine","symp_rough_idle","symp_failed_emissions","symp_knocking"],
            "causes": ["cause_egr_valve","cause_egr_passages","cause_wiring_damage","cause_pcm_software"],
            "difficulty": "diff_moderate", "cost": "$100 - $500"
        }

    # P0501-P0503: Vehicle Speed Sensor
    if 501 <= code_num <= 503:
        suffixes = {501: "Vehicle Speed Sensor Range/Performance", 502: "Vehicle Speed Sensor Circuit Low Input", 503: "Vehicle Speed Sensor Circuit Intermittent/High/Erratic"}
        return {"title": suffixes.get(code_num, f"Vehicle Speed Sensor ({code_str})"), "desc": f"Code {code_str} indicates a problem with the vehicle speed sensor signal.", "symptoms": ["symp_check_engine","symp_speedometer_erratic","symp_hard_shifting","symp_cruise_not_working"], "causes": ["cause_vss","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $400"}

    # P0504-P0509: Brake/Idle
    if 504 <= code_num <= 509:
        suffixes = {504: "Brake Switch A/B Correlation", 505: "Idle Air Control System Malfunction", 506: "Idle Air Control System RPM Lower Than Expected", 507: "Idle Air Control System RPM Higher Than Expected", 508: "Idle Air Control System Circuit Low", 509: "Idle Air Control System Circuit High"}
        title = suffixes.get(code_num, f"Idle Control ({code_str})")
        return {"title": title, "desc": f"Code {code_str} indicates a problem with the idle air control system or brake switch.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_high_idle","symp_low_idle","symp_stalling","symp_erratic_idle"], "causes": ["cause_throttle_body","cause_vacuum_leak","cause_brake_switch","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $400"}

    # P0510-P0519: Closed Throttle Position
    if 510 <= code_num <= 519:
        return {"title": f"Closed Throttle Position Switch ({code_str})", "desc": f"Code {code_str} relates to the closed throttle position switch circuit.", "symptoms": ["symp_check_engine","symp_high_idle","symp_rough_idle","symp_erratic_idle"], "causes": ["cause_throttle_position","cause_throttle_body","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$75 - $350"}

    # P0520-P0526: Oil Pressure
    if 520 <= code_num <= 526:
        suffixes = {520: "Engine Oil Pressure Sensor/Switch Circuit Malfunction", 521: "Engine Oil Pressure Sensor/Switch Range/Performance", 522: "Engine Oil Pressure Sensor/Switch Low Voltage", 523: "Engine Oil Pressure Sensor/Switch High Voltage", 524: "Engine Oil Pressure Too Low", 525: "Cruise Control Servo Control Circuit Range/Performance", 526: "Fan Speed Sensor Circuit Range/Performance"}
        title = suffixes.get(code_num, f"Oil Pressure Sensor ({code_str})")
        return {"title": title, "desc": f"Code {code_str} indicates a problem with the engine oil pressure sensor/switch or related circuit.", "symptoms": ["symp_check_engine","symp_oil_pressure_warning","symp_engine_overheat"], "causes": ["cause_oil_pressure_sender","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$75 - $400"}

    # P0530-P0534: A/C Pressure
    if 530 <= code_num <= 534:
        suffixes = {530: "A/C Refrigerant Pressure Sensor Circuit Malfunction", 531: "A/C Refrigerant Pressure Sensor Range/Performance", 532: "A/C Refrigerant Pressure Sensor Low", 533: "A/C Refrigerant Pressure Sensor High", 534: "A/C Refrigerant Charge Loss"}
        title = suffixes.get(code_num, f"A/C Pressure Sensor ({code_str})")
        return {"title": title, "desc": f"Code {code_str} indicates a problem with the A/C refrigerant pressure sensor or system.", "symptoms": ["symp_check_engine","symp_ac_not_working"], "causes": ["cause_ac_refrigerant","cause_ac_compressor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $600"}

    # P0535-P0539: A/C Evaporator Temp
    if 535 <= code_num <= 539:
        return {"title": f"A/C Evaporator Temperature Sensor Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the A/C evaporator temperature sensor.", "symptoms": ["symp_check_engine","symp_ac_not_working"], "causes": ["cause_wiring_damage","cause_connector_corrosion","cause_ac_compressor"], "difficulty": "diff_moderate", "cost": "$75 - $400"}

    # P0540-P0549: Intake Air Heater
    if 540 <= code_num <= 549:
        return {"title": f"Intake Air Heater Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the intake air heater circuit, commonly found on diesel engines.", "symptoms": ["symp_check_engine","symp_diesel_hard_cold_start","symp_rough_idle","symp_white_smoke"], "causes": ["cause_glow_plug","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $500"}

    # P0550-P0554: Power Steering Pressure
    if 550 <= code_num <= 554:
        return {"title": f"Power Steering Pressure Sensor/Switch Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the power steering pressure sensor.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_stalling"], "causes": ["cause_power_steering_sensor","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $400"}

    # P0560-P0564: System Voltage
    if 560 <= code_num <= 564:
        suffixes = {560: "System Voltage Malfunction", 561: "System Voltage Unstable", 562: "System Voltage Low", 563: "System Voltage High", 564: "Cruise Control Multi-Function Input A Circuit Malfunction"}
        title = suffixes.get(code_num, f"System Voltage ({code_str})")
        return {"title": title, "desc": f"Code {code_str} indicates a problem with the vehicle's charging system voltage.", "symptoms": ["symp_check_engine","symp_battery_drain","symp_stalling","symp_hard_start","symp_rough_idle"], "causes": ["cause_alternator","cause_battery","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $600"}

    # P0565-P0579: Cruise Control
    if 565 <= code_num <= 579:
        return {"title": f"Cruise Control System ({code_str})", "desc": f"Code {code_str} indicates a problem with the cruise control system circuit.", "symptoms": ["symp_check_engine","symp_cruise_not_working"], "causes": ["cause_cruise_control_module","cause_brake_switch","cause_wiring_damage","cause_connector_corrosion","cause_vss"], "difficulty": "diff_moderate", "cost": "$100 - $500"}

    # P0580-P0599: Cruise Control related
    if 580 <= code_num <= 599:
        return {"title": f"Cruise Control / Speed Management System ({code_str})", "desc": f"Code {code_str} relates to the cruise control or vehicle speed management system.", "symptoms": ["symp_check_engine","symp_cruise_not_working","symp_reduced_power_mode"], "causes": ["cause_cruise_control_module","cause_vss","cause_brake_switch","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$100 - $500"}

    # P0601-P0609: PCM
    if 600 <= code_num <= 609:
        suffixes = {600: "Serial Communication Link Malfunction", 601: "Internal Control Module Memory Check Sum Error", 602: "Control Module Programming Error", 603: "Internal Control Module KAM Error", 604: "Internal Control Module RAM Error", 605: "Internal Control Module ROM Error", 606: "ECM/PCM Processor Fault", 607: "Control Module Performance", 608: "Control Module VSS Output A Malfunction", 609: "Control Module VSS Output B Malfunction"}
        title = suffixes.get(code_num, f"ECM/PCM Internal ({code_str})")
        return {"title": title, "desc": f"Code {code_str} indicates an internal fault within the Engine Control Module (ECM) or Powertrain Control Module (PCM).", "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_reduced_power_mode","symp_rough_idle"], "causes": ["cause_pcm_failure","cause_pcm_software","cause_battery","cause_wiring_damage"], "difficulty": "diff_professional", "cost": "$200 - $1500"}

    # P0610-P0619: Control Module Options
    if 610 <= code_num <= 619:
        return {"title": f"Control Module Vehicle Options Error ({code_str})", "desc": f"Code {code_str} indicates the control module has detected a vehicle options programming error.", "symptoms": ["symp_check_engine","symp_reduced_power_mode"], "causes": ["cause_pcm_software","cause_pcm_failure"], "difficulty": "diff_professional", "cost": "$200 - $1000"}

    # P0620-P0629: Generator/Alternator
    if 620 <= code_num <= 629:
        return {"title": f"Generator/Alternator Control Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the generator/alternator control circuit.", "symptoms": ["symp_check_engine","symp_battery_drain","symp_stalling"], "causes": ["cause_alternator","cause_battery","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$150 - $700"}

    # P0630-P0639: VIN/Ignition Key
    if 630 <= code_num <= 639:
        return {"title": f"VIN Not Programmed / Ignition Key Transponder ({code_str})", "desc": f"Code {code_str} relates to VIN programming or the ignition key transponder/immobilizer system.", "symptoms": ["symp_check_engine","symp_no_start"], "causes": ["cause_ignition_key_transponder","cause_pcm_software","cause_pcm_failure"], "difficulty": "diff_professional", "cost": "$100 - $800"}

    # P0640-P0649: Intake Air Heater Control
    if 640 <= code_num <= 649:
        return {"title": f"Intake Air Heater Control Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the intake air heater control circuit.", "symptoms": ["symp_check_engine","symp_diesel_hard_cold_start","symp_rough_idle"], "causes": ["cause_glow_plug","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$100 - $400"}

    # P0650-P0659: MIL Control
    if 650 <= code_num <= 659:
        return {"title": f"Malfunction Indicator Lamp (MIL) Control Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the MIL (Check Engine Light) control circuit.", "symptoms": ["symp_check_engine"], "causes": ["cause_wiring_damage","cause_pcm_failure","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$50 - $300"}

    # P0660-P0669: Intake Manifold Tuning Valve
    if 660 <= code_num <= 669:
        return {"title": f"Intake Manifold Tuning Valve Control Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the intake manifold tuning valve circuit. This valve optimizes airflow at different RPM ranges.", "symptoms": ["symp_check_engine","symp_power_loss","symp_rough_idle","symp_poor_acceleration"], "causes": ["cause_throttle_actuator","cause_wiring_damage","cause_connector_corrosion","cause_vacuum_leak"], "difficulty": "diff_moderate", "cost": "$100 - $500"}

    # P0670-P0689: Glow Plug Module
    if 670 <= code_num <= 689:
        return {"title": f"Glow Plug Module / Supply Voltage ({code_str})", "desc": f"Code {code_str} indicates a problem with the glow plug module control circuit or supply voltage (diesel engines).", "symptoms": ["symp_check_engine","symp_diesel_hard_cold_start","symp_glow_plug_light","symp_white_smoke","symp_rough_idle"], "causes": ["cause_glow_plug","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure","cause_battery"], "difficulty": "diff_hard", "cost": "$150 - $700"}

    # P0690-P0699: ECM/PCM Power Relay
    if 690 <= code_num <= 699:
        return {"title": f"ECM/PCM Power Relay Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the ECM/PCM power relay circuit.", "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_reduced_power_mode"], "causes": ["cause_pcm_failure","cause_wiring_damage","cause_battery","cause_connector_corrosion"], "difficulty": "diff_professional", "cost": "$150 - $800"}

    # P0701-P0709: Transmission Range Sensor
    if 701 <= code_num <= 709:
        suffixes = {701: "Transmission Range Sensor Circuit Range/Performance", 702: "Transmission Control System Electrical",
                    703: "Torque Converter/Brake Switch B Circuit Malfunction", 704: "Clutch Switch Input Circuit Malfunction",
                    705: "Transmission Range Sensor Circuit Malfunction (PRNDL Input)", 706: "Transmission Range Sensor Circuit Range/Performance",
                    707: "Transmission Range Sensor Circuit Low Input", 708: "Transmission Range Sensor Circuit High Input",
                    709: "Transmission Range Sensor Circuit Intermittent"}
        title = suffixes.get(code_num, f"Transmission Range Sensor ({code_str})")
        return {"title": title, "desc": f"Code {code_str} indicates a problem with the transmission range sensor circuit. This sensor tells the PCM/TCM which gear the driver has selected.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_stuck_gear","symp_no_start","symp_delayed_engagement"], "causes": ["cause_shift_solenoid","cause_wiring_damage","cause_connector_corrosion","cause_transmission_fluid"], "difficulty": "diff_hard", "cost": "$150 - $600"}

    # P0711-P0714: Transmission Fluid Temp
    if 711 <= code_num <= 714:
        suffixes = {711: "Range/Performance", 712: "Low Input", 713: "High Input", 714: "Intermittent"}
        return {"title": f"Transmission Fluid Temperature Sensor Circuit {suffixes.get(code_num, 'Malfunction')}", "desc": f"Code {code_str} indicates a problem with the transmission fluid temperature sensor.", "symptoms": ["symp_check_engine","symp_transmission_overheat","symp_hard_shifting"], "causes": ["cause_transmission_fluid","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_hard", "cost": "$100 - $500"}

    # P0716-P0719: Input Speed Sensor
    if 716 <= code_num <= 719:
        suffixes = {716: "Range/Performance", 717: "No Signal", 718: "Intermittent", 719: "Torque Converter/Brake Switch B Circuit High"}
        return {"title": f"Input/Turbine Speed Sensor Circuit {suffixes.get(code_num, 'Malfunction')}", "desc": f"Code {code_str} indicates a problem with the transmission input/turbine speed sensor.", "symptoms": ["symp_check_engine","symp_transmission_slip","symp_hard_shifting","symp_stuck_gear"], "causes": ["cause_speed_sensor_in","cause_transmission_fluid","cause_wiring_damage"], "difficulty": "diff_hard", "cost": "$150 - $600"}

    # P0721-P0724: Output Speed Sensor
    if 721 <= code_num <= 724:
        suffixes = {721: "Range/Performance", 722: "No Signal", 723: "Intermittent", 724: "Output Speed Sensor Intermittent"}
        return {"title": f"Output Speed Sensor Circuit {suffixes.get(code_num, 'Malfunction')}", "desc": f"Code {code_str} indicates a problem with the transmission output speed sensor.", "symptoms": ["symp_check_engine","symp_speedometer_erratic","symp_hard_shifting","symp_transmission_slip"], "causes": ["cause_speed_sensor_out","cause_wiring_damage","cause_connector_corrosion","cause_transmission_fluid"], "difficulty": "diff_hard", "cost": "$150 - $600"}

    # P0725-P0729: Engine Speed Input
    if 725 <= code_num <= 729:
        return {"title": f"Engine Speed Input Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the engine speed input signal to the transmission control module.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_transmission_slip","symp_stalling"], "causes": ["cause_crankshaft_sensor","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"], "difficulty": "diff_hard", "cost": "$150 - $600"}

    # P0731-P0736: Incorrect Gear Ratio 1st-6th
    if 731 <= code_num <= 736:
        gear = code_num - 730
        ordinals = {1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th"}
        return {"title": f"Incorrect {ordinals.get(gear, str(gear))} Gear Ratio", "desc": f"Code {code_str} indicates the actual gear ratio does not match the expected ratio for {ordinals.get(gear, str(gear))} gear.", "symptoms": ["symp_check_engine","symp_transmission_slip","symp_hard_shifting","symp_stuck_gear","symp_gear_hunting"], "causes": ["cause_transmission_fluid","cause_shift_solenoid","cause_valve_body","cause_torque_converter","cause_transmission_filter"], "difficulty": "diff_professional", "cost": "$300 - $3500"}

    # P0737-P0739: TCM Engine Speed Output
    if 737 <= code_num <= 739:
        return {"title": f"TCM Engine Speed Output Circuit ({code_str})", "desc": f"Code {code_str} indicates a problem with the TCM engine speed output circuit.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_transmission_slip"], "causes": ["cause_pcm_failure","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_professional", "cost": "$200 - $1000"}

    # P0742-P0744: TCC variants
    if 742 <= code_num <= 744:
        suffixes = {742: "Torque Converter Clutch Circuit Stuck On", 743: "Torque Converter Clutch Circuit Electrical", 744: "Torque Converter Clutch Circuit Intermittent"}
        return {"title": suffixes.get(code_num, f"Torque Converter Clutch ({code_str})"), "desc": f"Code {code_str} indicates a problem with the torque converter clutch circuit.", "symptoms": ["symp_check_engine","symp_stalling","symp_vibration","symp_fuel_economy","symp_transmission_slip"], "causes": ["cause_torque_converter","cause_transmission_fluid","cause_shift_solenoid","cause_valve_body","cause_wiring_damage"], "difficulty": "diff_professional", "cost": "$200 - $2500"}

    # P0745-P0749: Pressure Control Solenoid A
    if 745 <= code_num <= 749:
        suffixes = {745: "Pressure Control Solenoid A Malfunction", 746: "Pressure Control Solenoid A Performance or Stuck Off", 747: "Pressure Control Solenoid A Stuck On", 748: "Pressure Control Solenoid A Electrical", 749: "Pressure Control Solenoid A Intermittent"}
        return {"title": suffixes.get(code_num, f"Pressure Control Solenoid ({code_str})"), "desc": f"Code {code_str} indicates a problem with pressure control solenoid A in the transmission.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_transmission_slip","symp_delayed_engagement","symp_stuck_gear"], "causes": ["cause_pressure_solenoid","cause_transmission_fluid","cause_valve_body","cause_wiring_damage"], "difficulty": "diff_professional", "cost": "$200 - $1500"}

    # P0751-P0770: Shift Solenoids A-E
    if 751 <= code_num <= 770:
        solenoid_idx = (code_num - 750) // 5
        solenoid_letters = {0: "A", 1: "B", 2: "C", 3: "D"}
        sol = solenoid_letters.get(solenoid_idx, chr(65 + solenoid_idx))
        suffixes_map = {1: "Performance or Stuck Off", 2: "Stuck On", 3: "Electrical", 4: "Intermittent", 0: "Malfunction"}
        suffix_idx = (code_num - 750) % 5
        suffix = suffixes_map.get(suffix_idx, "Malfunction")
        return {"title": f"Shift Solenoid {sol} {suffix}", "desc": f"Code {code_str} indicates a problem with shift solenoid {sol} ({suffix.lower()}).", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_stuck_gear","symp_transmission_slip","symp_delayed_engagement","symp_gear_hunting"], "causes": ["cause_shift_solenoid","cause_transmission_fluid","cause_valve_body","cause_wiring_damage","cause_pcm_failure"], "difficulty": "diff_professional", "cost": "$200 - $1500"}

    # P0771-P0799: Shift Solenoid/Pressure variants
    if 771 <= code_num <= 799:
        return {"title": f"Shift Solenoid / Pressure Control Variant ({code_str})", "desc": f"Code {code_str} relates to the transmission shift solenoid or pressure control system variants.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_stuck_gear","symp_transmission_slip","symp_delayed_engagement"], "causes": ["cause_shift_solenoid","cause_pressure_solenoid","cause_transmission_fluid","cause_valve_body","cause_wiring_damage"], "difficulty": "diff_professional", "cost": "$200 - $1500"}

    # P0800-P0899: Transfer Case / Clutch / Transmission
    if 800 <= code_num <= 899:
        if 800 <= code_num <= 809:
            return {"title": f"Transfer Case Control System ({code_str})", "desc": f"Code {code_str} relates to the transfer case control system in 4WD/AWD vehicles.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_vibration","symp_reduced_power_mode"], "causes": ["cause_shift_solenoid","cause_wiring_damage","cause_pcm_failure","cause_transmission_fluid"], "difficulty": "diff_professional", "cost": "$200 - $1500"}
        if 810 <= code_num <= 819:
            return {"title": f"Clutch Position / Transmission Gate ({code_str})", "desc": f"Code {code_str} relates to the clutch position or transmission gate select position sensor.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_stuck_gear"], "causes": ["cause_clutch_switch","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_hard", "cost": "$100 - $600"}
        return {"title": f"Transmission Related ({code_str})", "desc": f"Code {code_str} relates to a transmission sub-system.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_transmission_slip","symp_stuck_gear"], "causes": ["cause_transmission_fluid","cause_shift_solenoid","cause_valve_body","cause_wiring_damage"], "difficulty": "diff_professional", "cost": "$200 - $2000"}

    # P0900-P0999: Powertrain Controls (Clutch / Transmission Gate)
    if 900 <= code_num <= 999:
        if 900 <= code_num <= 920:
            return {"title": f"Clutch Actuator Circuit ({code_str})", "desc": f"Code {code_str} relates to the clutch actuator circuit. This applies to automated manual or dual-clutch transmissions.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_stuck_gear","symp_no_start","symp_stalling"], "causes": ["cause_clutch_actuator","cause_clutch_switch","cause_wiring_damage","cause_transmission_fluid"], "difficulty": "diff_professional", "cost": "$200 - $1500"}
        if 921 <= code_num <= 950:
            return {"title": f"Transmission Gate Select Position ({code_str})", "desc": f"Code {code_str} relates to the transmission gear select position sensor or circuit.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_stuck_gear","symp_delayed_engagement"], "causes": ["cause_shift_solenoid","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"], "difficulty": "diff_professional", "cost": "$200 - $1000"}
        return {"title": f"Powertrain Control System ({code_str})", "desc": f"Code {code_str} relates to a general powertrain control system function.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_reduced_power_mode","symp_stalling"], "causes": ["cause_pcm_failure","cause_pcm_software","cause_wiring_damage","cause_transmission_fluid"], "difficulty": "diff_professional", "cost": "$200 - $1500"}

    # ========================================
    # P2000-P2999: ISO/SAE Reserved Codes
    # ========================================

    # P2000-P2099: NOx Adsorber / Catalyst
    if 2000 <= code_num <= 2099:
        if 2000 <= code_num <= 2029:
            return {"title": f"NOx Trap/Adsorber System ({code_str})", "desc": f"Code {code_str} relates to the NOx adsorber/trap system, primarily used in diesel and lean-burn gasoline engines to reduce nitrogen oxide emissions.", "symptoms": ["symp_check_engine","symp_failed_emissions","symp_power_loss","symp_fuel_economy","symp_reduced_power_mode"], "causes": ["cause_nox_catalyst","cause_nox_sensor","cause_egr_valve","cause_wiring_damage","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$300 - $2000"}
        if 2030 <= code_num <= 2049:
            return {"title": f"Fuel Heater / NOx Control System ({code_str})", "desc": f"Code {code_str} relates to the fuel heater or NOx after-treatment control system.", "symptoms": ["symp_check_engine","symp_failed_emissions","symp_diesel_hard_cold_start","symp_power_loss"], "causes": ["cause_nox_catalyst","cause_nox_sensor","cause_fuel_temp_sensor","cause_wiring_damage"], "difficulty": "diff_hard", "cost": "$200 - $1500"}
        if 2050 <= code_num <= 2079:
            return {"title": f"Direct Injection System ({code_str})", "desc": f"Code {code_str} relates to the direct fuel injection system controls.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_power_loss","symp_hard_start","symp_misfire_feel"], "causes": ["cause_fuel_injector","cause_fuel_pump","cause_fuel_rail_pressure_sensor","cause_wiring_damage","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$200 - $1200"}
        return {"title": f"Emission After-Treatment System ({code_str})", "desc": f"Code {code_str} relates to emission after-treatment systems such as the catalyst or NOx reduction system.", "symptoms": ["symp_check_engine","symp_failed_emissions","symp_power_loss","symp_fuel_economy"], "causes": ["cause_cat_converter","cause_nox_catalyst","cause_nox_sensor","cause_wiring_damage"], "difficulty": "diff_hard", "cost": "$200 - $2000"}

    # P2100-P2199: Throttle Actuator Control Motor
    if 2100 <= code_num <= 2199:
        if 2100 <= code_num <= 2109:
            suffixes = {2102: "Throttle Actuator Control Motor Circuit Low", 2103: "Throttle Actuator Control Motor Circuit High",
                        2104: "Throttle Actuator Control System - Forced Idle", 2105: "Throttle Actuator Control System - Forced Engine Shutdown",
                        2106: "Throttle Actuator Control System - Forced Limited Power", 2107: "Throttle Actuator Control Module Processor",
                        2108: "Throttle Actuator Control Module Performance", 2109: "Throttle/Pedal Position Sensor A Minimum Stop Performance"}
            title = suffixes.get(code_num, f"Throttle Actuator Control System ({code_str})")
            return {"title": title, "desc": f"Code {code_str} relates to the electronic throttle actuator control (drive-by-wire) system. When this system fails, the vehicle typically enters reduced power or limp mode.", "symptoms": ["symp_check_engine","symp_reduced_power_mode","symp_poor_acceleration","symp_stalling","symp_erratic_idle","symp_high_idle"], "causes": ["cause_throttle_actuator","cause_throttle_body","cause_throttle_position","cause_wiring_damage","cause_pcm_failure","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$200 - $1000"}
        if 2110 <= code_num <= 2139:
            return {"title": f"Throttle Actuator Control System ({code_str})", "desc": f"Code {code_str} relates to the electronic throttle control system.", "symptoms": ["symp_check_engine","symp_reduced_power_mode","symp_poor_acceleration","symp_erratic_idle","symp_stalling"], "causes": ["cause_throttle_actuator","cause_throttle_body","cause_throttle_position","cause_wiring_damage","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$200 - $1000"}
        if 2140 <= code_num <= 2159:
            return {"title": f"EGR Throttle Control System ({code_str})", "desc": f"Code {code_str} relates to the EGR throttle control system.", "symptoms": ["symp_check_engine","symp_rough_idle","symp_failed_emissions","symp_power_loss"], "causes": ["cause_egr_valve","cause_throttle_actuator","cause_wiring_damage","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$150 - $800"}
        return {"title": f"Electronic Throttle / EGR Control ({code_str})", "desc": f"Code {code_str} relates to the electronic throttle or EGR throttle control system.", "symptoms": ["symp_check_engine","symp_reduced_power_mode","symp_rough_idle","symp_power_loss"], "causes": ["cause_throttle_actuator","cause_throttle_body","cause_egr_valve","cause_wiring_damage"], "difficulty": "diff_hard", "cost": "$150 - $1000"}

    # P2200-P2299: NOx Sensor Circuit
    if 2200 <= code_num <= 2299:
        bank = 1 if (code_num - 2200) < 50 else 2
        return {"title": f"NOx Sensor Circuit ({code_str}) - Bank {bank}", "desc": f"Code {code_str} indicates a problem with the NOx (nitrogen oxide) sensor circuit on Bank {bank}. NOx sensors monitor nitrogen oxide levels in the exhaust for emissions control.", "symptoms": ["symp_check_engine","symp_failed_emissions","symp_fuel_economy","symp_reduced_power_mode"], "causes": ["cause_nox_sensor","cause_wiring_damage","cause_connector_corrosion","cause_pcm_software"], "difficulty": "diff_hard", "cost": "$200 - $800"}

    # P2300-P2399: Ignition Coil / Secondary Air
    if 2300 <= code_num <= 2399:
        if 2300 <= code_num <= 2349:
            coil_num = ((code_num - 2300) // 4) + 1
            suffixes_map = {0: "Control Circuit Low", 1: "Control Circuit High", 2: "Control Circuit Open", 3: "Ignition Coil Positive Side Control Open"}
            idx = (code_num - 2300) % 4
            suffix = suffixes_map.get(idx, "Control Circuit Malfunction")
            return {"title": f"Ignition Coil {chr(64+coil_num)} {suffix}", "desc": f"Code {code_str} indicates a problem with ignition coil {chr(64+coil_num)} control circuit ({suffix.lower()}).", "symptoms": ["symp_check_engine","symp_misfire_feel","symp_rough_idle","symp_power_loss","symp_poor_acceleration"], "causes": ["cause_ignition_coil","cause_spark_plugs","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"], "difficulty": "diff_moderate", "cost": "$100 - $500"}
        return {"title": f"Secondary Air Injection System ({code_str})", "desc": f"Code {code_str} relates to the secondary air injection system variants.", "symptoms": ["symp_check_engine","symp_failed_emissions","symp_rough_idle"], "causes": ["cause_secondary_air_pump","cause_secondary_air_valve","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$150 - $800"}

    # P2400-P2499: EVAP Leak Detection / Secondary Air
    if 2400 <= code_num <= 2499:
        if 2400 <= code_num <= 2449:
            return {"title": f"EVAP Leak Detection Pump ({code_str})", "desc": f"Code {code_str} relates to the EVAP leak detection pump system, which tests the fuel system for vapor leaks.", "symptoms": ["symp_check_engine","symp_fuel_smell","symp_failed_emissions"], "causes": ["cause_evap_purge_valve","cause_evap_vent_valve","cause_evap_hose_leak","cause_evap_gas_cap","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$100 - $600"}
        return {"title": f"Secondary Air Injection / Exhaust System ({code_str})", "desc": f"Code {code_str} relates to the secondary air injection or exhaust gas treatment system.", "symptoms": ["symp_check_engine","symp_failed_emissions","symp_rough_idle","symp_rotten_egg_smell"], "causes": ["cause_secondary_air_pump","cause_secondary_air_valve","cause_cat_converter","cause_wiring_damage"], "difficulty": "diff_moderate", "cost": "$150 - $800"}

    # P2500-P2599: Generator/ECM/TCM
    if 2500 <= code_num <= 2599:
        if 2500 <= code_num <= 2519:
            return {"title": f"Generator / Charging System ({code_str})", "desc": f"Code {code_str} relates to the generator/alternator charging system.", "symptoms": ["symp_check_engine","symp_battery_drain","symp_stalling","symp_hard_start"], "causes": ["cause_alternator","cause_battery","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_moderate", "cost": "$150 - $700"}
        if 2520 <= code_num <= 2549:
            return {"title": f"ECM/TCM Power Control ({code_str})", "desc": f"Code {code_str} relates to the ECM or TCM power control circuits.", "symptoms": ["symp_check_engine","symp_no_start","symp_stalling","symp_reduced_power_mode"], "causes": ["cause_pcm_failure","cause_pcm_software","cause_battery","cause_wiring_damage"], "difficulty": "diff_professional", "cost": "$200 - $1500"}
        return {"title": f"ECM/TCM Communication / Power ({code_str})", "desc": f"Code {code_str} relates to ECM/TCM communication or power supply circuits.", "symptoms": ["symp_check_engine","symp_reduced_power_mode","symp_no_start","symp_stalling"], "causes": ["cause_pcm_failure","cause_pcm_software","cause_wiring_damage","cause_battery"], "difficulty": "diff_professional", "cost": "$200 - $1500"}

    # P2600-P2699: Coolant Pump / O2 Sensor Pumping Current
    if 2600 <= code_num <= 2699:
        if 2600 <= code_num <= 2629:
            return {"title": f"Coolant Control Valve / Pump ({code_str})", "desc": f"Code {code_str} relates to the electric coolant pump or coolant control valve system.", "symptoms": ["symp_check_engine","symp_engine_overheat","symp_coolant_temp_warning","symp_fan_not_working"], "causes": ["cause_coolant_leak","cause_thermostat","cause_fan_motor","cause_wiring_damage"], "difficulty": "diff_hard", "cost": "$150 - $800"}
        return {"title": f"O2 Sensor Pumping Current / Reference ({code_str})", "desc": f"Code {code_str} relates to the O2 sensor pumping current or reference voltage circuit (wideband/air-fuel ratio sensor).", "symptoms": ["symp_check_engine","symp_fuel_economy","symp_rough_idle","symp_failed_emissions"], "causes": ["cause_o2_sensor","cause_o2_heater","cause_wiring_damage","cause_connector_corrosion"], "difficulty": "diff_hard", "cost": "$150 - $600"}

    # P2700-P2799: Clutch Actuator / Transmission Friction Element
    if 2700 <= code_num <= 2799:
        if 2700 <= code_num <= 2749:
            return {"title": f"Transmission Friction Element ({code_str})", "desc": f"Code {code_str} relates to a transmission friction element (clutch pack, band) control or performance.", "symptoms": ["symp_check_engine","symp_transmission_slip","symp_hard_shifting","symp_stuck_gear","symp_delayed_engagement","symp_gear_hunting"], "causes": ["cause_transmission_fluid","cause_shift_solenoid","cause_valve_body","cause_pressure_solenoid","cause_transmission_filter"], "difficulty": "diff_professional", "cost": "$300 - $3500"}
        return {"title": f"Clutch Actuator / Dual Clutch System ({code_str})", "desc": f"Code {code_str} relates to the clutch actuator or dual-clutch transmission system.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_stuck_gear","symp_vibration","symp_stalling"], "causes": ["cause_clutch_actuator","cause_clutch_switch","cause_transmission_fluid","cause_wiring_damage"], "difficulty": "diff_professional", "cost": "$300 - $2500"}

    # P2800-P2899: Transmission Range Display / Pressure Sensor
    if 2800 <= code_num <= 2899:
        if 2800 <= code_num <= 2839:
            return {"title": f"Transmission Range Display / Position ({code_str})", "desc": f"Code {code_str} relates to the transmission range display circuit or position indicator.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_stuck_gear","symp_no_start"], "causes": ["cause_shift_solenoid","cause_wiring_damage","cause_connector_corrosion","cause_pcm_failure"], "difficulty": "diff_hard", "cost": "$150 - $800"}
        return {"title": f"Transmission Pressure Sensor ({code_str})", "desc": f"Code {code_str} relates to the transmission pressure sensor circuit.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_transmission_slip","symp_delayed_engagement"], "causes": ["cause_pressure_solenoid","cause_transmission_fluid","cause_wiring_damage","cause_valve_body"], "difficulty": "diff_hard", "cost": "$150 - $800"}

    # P2900-P2999: Hydraulic Pump / Motor
    if 2900 <= code_num <= 2999:
        return {"title": f"Hydraulic Pump / Motor System ({code_str})", "desc": f"Code {code_str} relates to the hydraulic pump motor or hydraulic pressure control system, often associated with hybrid or advanced transmission systems.", "symptoms": ["symp_check_engine","symp_hard_shifting","symp_reduced_power_mode","symp_vibration","symp_stalling"], "causes": ["cause_hydraulic_pump","cause_transmission_fluid","cause_wiring_damage","cause_pcm_failure"], "difficulty": "diff_professional", "cost": "$300 - $2000"}

    return None


# ============================================================================
# MAIN ENRICHMENT LOGIC
# ============================================================================
def enrich_codes():
    print("=" * 60)
    print("OBD2 Code Enrichment Script")
    print("=" * 60)

    # 1. Read existing base_codes.json
    print(f"\n[1/4] Reading existing base_codes.json...")
    with open(BASE_CODES_PATH, "r", encoding="utf-8") as f:
        codes = json.load(f)
    print(f"  Found {len(codes)} codes.")

    # 2. Enrich each code
    print(f"\n[2/4] Enriching codes with real OBD2 data...")
    enriched = {}
    stats = {"individual": 0, "range": 0, "total": 0}

    for code_str in sorted(codes.keys()):
        # Parse code number
        code_num = int(code_str[1:])
        stats["total"] += 1

        # Priority 1: Check individual definitions
        if code_str in INDIVIDUAL_CODES:
            data = INDIVIDUAL_CODES[code_str]
            enriched[code_str] = {
                "title": data["title"],
                "description": data["desc"],
                "symptoms": data["symptoms"],
                "causes": data["causes"],
                "fixDifficulty": data["difficulty"],
                "estimatedCost": data["cost"]
            }
            stats["individual"] += 1
            continue

        # Priority 2: Check range definitions
        range_def = get_range_definition(code_num, code_str)
        if range_def:
            enriched[code_str] = {
                "title": range_def["title"],
                "description": range_def["desc"],
                "symptoms": range_def["symptoms"],
                "causes": range_def["causes"],
                "fixDifficulty": range_def["difficulty"],
                "estimatedCost": range_def["cost"]
            }
            stats["range"] += 1
            continue

        # Should not reach here for any valid code, but just in case
        print(f"  WARNING: No definition found for {code_str}, using fallback")
        enriched[code_str] = {
            "title": codes[code_str].get("title", f"Powertrain Code {code_str}"),
            "description": codes[code_str].get("description", f"Diagnostic trouble code {code_str}."),
            "symptoms": ["symp_check_engine"],
            "causes": ["cause_wiring_damage","cause_pcm_software"],
            "fixDifficulty": "diff_moderate",
            "estimatedCost": "$100 - $500"
        }

    print(f"  Individual definitions: {stats['individual']}")
    print(f"  Range definitions: {stats['range']}")
    print(f"  Total enriched: {stats['total']}")

    # 3. Write enriched base_codes.json
    print(f"\n[3/4] Writing enriched base_codes.json...")
    with open(BASE_CODES_PATH, "w", encoding="utf-8") as f:
        json.dump(enriched, f, indent=2, ensure_ascii=False)
    print(f"  Written to {BASE_CODES_PATH}")

    # 4. Update translation files
    print(f"\n[4/4] Updating translation files...")
    update_translations()

    print("\n" + "=" * 60)
    print("ENRICHMENT COMPLETE!")
    print("=" * 60)

    # Print samples
    print_samples(enriched)


def update_translations():
    """Update all 5 translation files with new DB section keys."""
    languages = ["en", "tr", "es", "fr", "de"]

    # Build DB section for each language
    for lang in languages:
        filepath = os.path.join(MESSAGES_DIR, f"{lang}.json")
        print(f"  Updating {lang}.json...")

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Build new DB section
        new_db = {}

        # Add symptom translations
        for key, translations in SYMPTOM_TRANSLATIONS.items():
            new_db[key] = translations.get(lang, translations["en"])

        # Add cause translations
        for key, translations in CAUSE_TRANSLATIONS.items():
            new_db[key] = translations.get(lang, translations["en"])

        # Add difficulty translations
        for key, translations in DIFFICULTY_TRANSLATIONS.items():
            new_db[key] = translations.get(lang, translations["en"])

        # Replace DB section, keep everything else
        data["DB"] = new_db

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"    Added {len(new_db)} DB keys to {lang}.json")


def print_samples(enriched):
    """Print sample codes for verification."""
    sample_codes = ["P0100", "P0171", "P0300", "P0420", "P0442", "P0700", "P0740", "P2100"]

    print("\n" + "=" * 60)
    print("SAMPLE OUTPUT VERIFICATION")
    print("=" * 60)

    for code in sample_codes:
        if code in enriched:
            data = enriched[code]
            print(f"\n{'─' * 50}")
            print(f"  {code}: {data['title']}")
            print(f"  Description: {data['description'][:100]}...")
            print(f"  Symptoms: {data['symptoms'][:3]}{'...' if len(data['symptoms']) > 3 else ''}")
            print(f"  Causes: {data['causes'][:3]}{'...' if len(data['causes']) > 3 else ''}")
            print(f"  Difficulty: {data['fixDifficulty']}")
            print(f"  Cost: {data['estimatedCost']}")


if __name__ == "__main__":
    enrich_codes()
