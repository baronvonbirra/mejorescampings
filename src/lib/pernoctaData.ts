export interface PernoctaGuideData {
  slug: string;
  provinceName: string;
  metaTitle: string;
  metaDesc: string;
  headline: string;
  summaryText: string;
  goldenRule: string;
  introText: string;
  sanctionsRange: string;
  coastalRules: string;
  naturalParksRules: string;
  naturalParksList: string[];
  localTips: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const PERNOCTA_GUIDES: Record<string, PernoctaGuideData> = {
  almeria: {
    slug: 'almeria',
    provinceName: 'Almería',
    metaTitle: 'Guía Normativa de Pernocta y Acampada Libre en Almería 2026 | MejoresCampings',
    metaDesc: 'Regulación oficial para pernoctar en furgoneta camper y autocaravana en Almería. Normas en Parque Natural Cabo de Gata-Níjar y Ley de Costas.',
    headline: 'Guía de Normativa de Pernocta y Acampada Libre en Almería',
    summaryText: 'Todo lo que necesitas saber para viajar en camper o autocaravana por Almería. Normativa del Parque Natural Cabo de Gata-Níjar, Ley de Costas y áreas autorizadas.',
    goldenRule: 'Aparcar no es acampar: Puedes pernoctar dentro de tu furgoneta o autocaravana siempre que esté estacionada legalmente, sin sobresalir del perímetro del vehículo y sin desplegar elementos al exterior (toldos, sillas o calzos).',
    introText: 'En Almería, la acampada libre fuera de los establecimientos turísticos autorizados está prohibida por el Decreto 26/2018 de la Junta de Andalucía. Especialmente en el Parque Natural Cabo de Gata-Níjar y el Desierto de Tabernas, el SEPRONA y los agentes medioambientales aplican controles rigurosos.',
    sanctionsRange: '60 € hasta más de 1.500 €',
    coastalRules: 'En las calas vírgenes del Parque Natural Cabo de Gata-Níjar (como Mónsul, Los Genoveses y Cala Carbón), está estrictamente prohibido estacionar y pernoctar fuera de los aparcamientos regulados. La Ley de Costas prohíbe el estacionamiento a menos de 500 metros del Dominio Público Marítimo-Terrestre entre el ocaso y la salida del sol.',
    naturalParksRules: 'En el Parque Natural Cabo de Gata-Níjar y la Sierra de María-Los Vélez no se permite la pernocta en caminos, miradores ni pistas forestales. La estancia nocturna solo es legal en campings oficiales y áreas públicas o privadas de autocaravanas registradas.',
    naturalParksList: [
      'Parque Natural Cabo de Gata-Níjar',
      'Parque Natural Sierra de María-Los Vélez',
      'Paraje Natural Desierto de Tabernas',
      'Paraje Natural Karst en Yesos de Sorbas'
    ],
    localTips: [
      'Utiliza la red de campings de Níjar y Carboneras para vaciar aguas grises y negras respetando el entorno del parque.',
      'En San José y Las Negras existen estacionamientos habilitados de día, pero debes trasladarte a campings o áreas camper autorizadas por la noche.',
      'Evita estacionar en ramblas y cauces secos por riesgo de riadas repentinas durante lluvias torrenciales.'
    ],
    faqs: [
      {
        question: '¿Puedo pernoctar en las playas de Cabo de Gata con mi furgoneta?',
        answer: 'No. La normativa específica del Parque Natural Cabo de Gata-Níjar y la Ley de Costas prohíben la pernocta y el estacionamiento nocturno en todo el litoral del parque natural.'
      },
      {
        question: '¿Dónde se pueden vaciar los depósitos en la provincia de Almería?',
        answer: 'En las estaciones de servicio adaptadas de la A-7, áreas de autocaravanas en Níjar, Almería capital y en los campings oficiales de la provincia.'
      },
      {
        question: '¿Es legal poner calzos para nivelar el vehículo en Almería?',
        answer: 'No. El uso de calzos de nivelación se considera legalmente como despliegue de elementos de acampada y puede acarrear sanción administrativa.'
      }
    ]
  },
  cadiz: {
    slug: 'cadiz',
    provinceName: 'Cádiz',
    metaTitle: 'Guía Normativa de Pernocta y Acampada Libre en Cádiz 2026 | MejoresCampings',
    metaDesc: 'Regulación oficial para pernoctar en camper y autocaravana en Cádiz. Normas en Tarifa, Costa de la Luz y Sierra de Grazalema.',
    headline: 'Guía de Normativa de Pernocta y Acampada Libre en Cádiz',
    summaryText: 'Regulación actualizada para la pernocta en furgoneta camper y autocaravana en Tarifa, El Palmar, Conil y los Parques Naturales de Cádiz.',
    goldenRule: 'Respetar el litoral gaditano: Está permitido pernoctar en plazas de aparcamiento públicas autorizadas siempre que no despliegues elementos exteriores (toldos, mesas, calzos o patas niveladoras).',
    introText: 'La provincia de Cádiz aplica una estricta regulación de la acampada libre bajo el Decreto 26/2018 de la Junta de Andalucía. Municipios de la Costa de la Luz como Tarifa, Barbate y Vejer de la Frontera (El Palmar) cuentan con ordenanzas municipales específicas para proteger el litoral.',
    sanctionsRange: '100 € hasta 1.500 €',
    coastalRules: 'En Tarifa, Bolonia, Zahara de los Atunes y El Palmar, la Ley de Costas y la Policía Local sancionan duramente a los vehículos que ocupan la franja de protección del Dominio Público Marítimo-Terrestre o acampan en los pinares costeros.',
    naturalParksRules: 'En la Sierra de Grazalema y Los Alcornocales la acampada libre y la pernocta fuera de campings y áreas camper autorizadas está prohibida por la Consejería de Sostenibilidad y Medio Ambiente para evitar incendios y proteger la fauna.',
    naturalParksList: [
      'Parque Natural Sierra de Grazalema',
      'Parque Natural Los Alcornocales',
      'Parque Natural Del Estrecho',
      'Parque Natural Bahía de Cádiz'
    ],
    localTips: [
      'En Tarifa y El Palmar utiliza los campings oficiales y áreas camper de la N-340 para evitar multas de Costas y Policía Local.',
      'En la Sierra de Grazalema planifica tu estancia con reserva previa en campings de montaña.',
      'No viertas aguas bajo ningún concepto en pinares ni caminos de tierra.'
    ],
    faqs: [
      {
        question: '¿Se puede pernoctar a pie de playa en Tarifa o El Palmar?',
        answer: 'No. Las playas de Tarifa y El Palmar están altamente protegidas. La pernocta en primera línea está totalmente prohibida y muy vigilada.'
      },
      {
        question: '¿Qué diferencia hay entre aparcar y acampar en Cádiz?',
        answer: 'Aparcar permite dormir en el interior del vehículo estacionado correctamente sin ocupar más espacio de su perímetro. Acampar incluye abrir ventanas batientes hacia fuera, sacar sillas, abrir toldos o poner calzos.'
      },
      {
        question: '¿Hay campings abiertos todo el año en la provincia de Cádiz?',
        answer: 'Sí. Cádiz cuenta con campings excepcionales en Tarifa, Barbate y Conil abiertos durante todo el año para dar servicio a la comunidad camper.'
      }
    ]
  },
  cordoba: {
    slug: 'cordoba',
    provinceName: 'Córdoba',
    metaTitle: 'Guía Normativa de Pernocta y Acampada Libre en Córdoba 2026 | MejoresCampings',
    metaDesc: 'Normativa legal para pernoctar en furgoneta camper y autocaravana en Córdoba. Regulación en Sierra Morena, Subbética y embalses.',
    headline: 'Guía de Normativa de Pernocta y Acampada Libre en Córdoba',
    summaryText: 'Consulta las leyes de pernocta y acampada en la provincia de Córdoba, desde la Sierra Morena y Hornachuelos hasta el Parque Natural de las Sierras Subbéticas.',
    goldenRule: 'Mantiene el vehículo en modo aparcado: La pernocta en el interior de tu autocaravana o camper es legal en zonas urbanas y aparcamientos habilitados siempre que no instales calzos ni despliegues mobiliario.',
    introText: 'En Córdoba la acampada libre fuera de instalaciones turísticas oficiales no está permitida por la normativa andaluza. La vigilancia se centra en los Parques Naturales de Sierra Morena y en el litoral interior de embalses como Iznájar.',
    sanctionsRange: '60 € hasta 1.000 €',
    coastalRules: 'En el Embalse de Iznájar y las riberas del Guadalquivir, la Confederación Hidrográfica del Guadalquivir y los agentes de medio ambiente prohíben el estacionamiento nocturno y la acampada no autorizada en las márgenes de los embalses.',
    naturalParksRules: 'En los Parques Naturales de Hornachuelos, Cardeña-Montoro y Sierras Subbéticas se vigila especialmente el riesgo de incendios. Está prohibida la pernocta en caminos forestales, miradores y áreas recreativas sin autorización explícita.',
    naturalParksList: [
      'Parque Natural Sierras Subbéticas',
      'Parque Natural Sierra de Hornachuelos',
      'Parque Natural Sierra de Cardeña y Montoro'
    ],
    localTips: [
      'Para visitar la Mezquita-Catedral de Córdoba, utiliza los estacionamientos regulados del casco urbano o campings metropolitanos como Camping Albolafia.',
      'Respetar las señales de prohibición de la Confederación Hidrográfica en la zona de embalses.',
      'Aprovecha la red de campings rurales de Sierra Morena para disfrutar de cielos limpios y astroturismo.'
    ],
    faqs: [
      {
        question: '¿Puedo acampar junto al Embalse de Iznájar?',
        answer: 'No. La acampada en la ribera del embalse está prohibida. Debes pernoctar en el camping municipal o en las áreas camper autorizadas del municipio.'
      },
      {
        question: '¿Dónde vaciar aguas residuales en Córdoba?',
        answer: 'En los campings de la provincia y en las estaciones de servicio con punto limpio camper habilitado en las autovías A-4 y A-45.'
      },
      {
        question: '¿Es legal hacer fuego en las áreas recreativas de Sierra Morena?',
        answer: 'No durante la época de alto riesgo de incendios (1 de junio a 15 de octubre). En esa época está tajantemente prohibido todo uso del fuego en espacios naturales.'
      }
    ]
  },
  granada: {
    slug: 'granada',
    provinceName: 'Granada',
    metaTitle: 'Guía Normativa de Pernocta y Acampada Libre en Granada 2026 | MejoresCampings',
    metaDesc: 'Regulación oficial de pernocta en Granada. Normas en Sierra Nevada, La Alpujarra, Costa Tropical y Geoparque de Granada.',
    headline: 'Guía de Normativa de Pernocta y Acampada Libre en Granada',
    summaryText: 'Toda la información legal para pernoctar en camper o autocaravana en Granada: Sierra Nevada, la Alpujarra, Almuñécar y el Geoparque.',
    goldenRule: 'Diferencia estricta entre pernocta y acampada: Dormir en el interior de un vehículo correctamente estacionado es legal; abrir ventanas abatibles, sacar mesas o calzar la furgoneta se considera acampada y requiere instalaciones autorizadas.',
    introText: 'Granada combina la alta montaña de Sierra Nevada con la Costa Tropical y la Alpujarra. En toda la provincia se aplica el Decreto 26/2018 de Andalucía, con normativas muy estrictas en el Parque Nacional de Sierra Nevada.',
    sanctionsRange: '100 € hasta 2.000 €',
    coastalRules: 'En municipios costeros como Almuñécar, Salobreña y Motril, la Ley de Costas prohíbe el estacionamiento nocturno de furgonetas y autocaravanas a menos de 500 metros del Dominio Público Marítimo-Terrestre.',
    naturalParksRules: 'En el Parque Nacional y Natural de Sierra Nevada la pernocta libre en vehículos está restringida exclusivamente a aparcamientos asfaltados autorizados (como Pradollano / Hoya de la Mora con su normativa propia). La acampada en tienda requiere autorización previa del Parque para travesías a pie.',
    naturalParksList: [
      'Parque Nacional y Natural de Sierra Nevada',
      'Parque Natural Sierra de Baza',
      'Parque Natural Sierra de Castril',
      'Parque Natural Sierra de Huétor',
      'Geoparque de Granada'
    ],
    localTips: [
      'Para visitar Granada capital y la Alhambra, utiliza el camping Sierra Nevada o aparcamientos específicos para camper cerca del centro.',
      'En la Alpujarra, las carreteras de montaña son estrechas; aparca solo en zonas niveladas y autorizadas en Órgiva o Trevélez.',
      'En el Geoparque de Granada respeta las cárcavas y terrenos protegidos sin circular fuera de pistas principales.'
    ],
    faqs: [
      {
        question: '¿Se puede pernoctar con furgoneta en Sierra Nevada?',
        answer: 'Solo en los aparcamientos regulados en Pradollano y áreas habilitadas. Está prohibido estacionar o pernoctar en bordes de carretera o Pistas Forestales del Parque Nacional.'
      },
      {
        question: '¿Puedo hacer vivaque de montaña en Sierra Nevada?',
        answer: 'El vivaque y acampada nocturna para senderistas de alta montaña está regulado y requiere notificación o permiso previo al Parque Nacional según la altitud.'
      },
      {
        question: '¿Qué servicios ofrecen los campings de la Costa Tropical?',
        answer: 'Los campings de Almuñécar y Motril ofrecen parcelas con sombra, duchas calientes, piscina, vaciado de aguas y acceso cercano a la playa.'
      }
    ]
  },
  huelva: {
    slug: 'huelva',
    provinceName: 'Huelva',
    metaTitle: 'Guía Normativa de Pernocta y Acampada Libre en Huelva 2026 | MejoresCampings',
    metaDesc: 'Normativa legal de pernocta en Huelva. Regulación en Parque Nacional de Doñana, Mazagón, Matalascañas y Sierra de Aracena.',
    headline: 'Guía de Normativa de Pernocta y Acampada Libre en Huelva',
    summaryText: 'Regulación oficial para la pernocta en furgoneta camper y autocaravana en la provincia de Huelva: Doñana, Mazagón, Punta Umbría y Aracena.',
    goldenRule: 'Máxima protección ambiental en Doñana: La pernocta libre está prohibida en todo el espacio natural de Doñana y sus accesos costeros. Utiliza campings autorizados.',
    introText: 'La provincia de Huelva alberga la reserva de biodiversidad de Doñana y las playas de la Costa de la Luz occidental. El Decreto 26/2018 y las leyes medioambientales europeas imponen controles continuos.',
    sanctionsRange: '100 € hasta 3.000 € (en zona Doñana)',
    coastalRules: 'En las playas de Mazagón, Matalascañas, Cuesta Maneli, El Rompido e Isla Cristina, la Guardia Civil y Costas sancionan con severidad el estacionamiento nocturno en dunas y franja marina protegida.',
    naturalParksRules: 'En el Parque Nacional y Natural de Doñana y en el Parque Natural Sierra de Aracena y Picos de Aroche está prohibido pernoctar fuera de campings y áreas camper oficiales. Se prohíbe el uso de fuego y el vertido de cualquier residuo.',
    naturalParksList: [
      'Parque Nacional y Natural de Doñana',
      'Parque Natural Sierra de Aracena y Picos de Aroche',
      'Paraje Natural Marismas del Odiel',
      'Paraje Natural Los Enebrales de Punta Umbría'
    ],
    localTips: [
      'En Mazagón y Matalascañas utiliza campings como Camping Doñana Playa para pernoctar seguro y con acceso directo a las playas.',
      'En la Sierra de Aracena respeta los caminos de dehesas privadas y aprovecha la red de campings rurales de la comarca.',
      'En El Rocío aparca únicamente en los estacionamientos de autocaravanas señalizados por el Ayuntamiento de Almonte.'
    ],
    faqs: [
      {
        question: '¿Es legal pernoctar en las dunas de Mazagón o Matalascañas?',
        answer: 'No. El ecosistema dunar de Huelva tiene el máximo nivel de protección ambiental. Está prohibido circular y pernoctar en las dunas.'
      },
      {
        question: '¿Hay áreas camper reguladas en Huelva?',
        answer: 'Sí. Huelva cuenta con áreas de autocaravanas en Matalascañas, Ayamonte, Aracena y campings de alta calidad en toda su costa.'
      },
      {
        question: '¿Qué sanción hay por acampar ilegalmente en Doñana?',
        answer: 'Las sanciones en el espacio protegido de Doñana pueden superar los 3.000 € dada la figura de especial protección ambiental del parque.'
      }
    ]
  },
  jaen: {
    slug: 'jaen',
    provinceName: 'Jaén',
    metaTitle: 'Guía Normativa de Pernocta y Acampada Libre en Jaén 2026 | MejoresCampings',
    metaDesc: 'Guía oficial de pernocta y acampada en Jaén. Normas en Parque Natural Cazorla, Segura y Las Villas, Despeñaperros y Úbeda.',
    headline: 'Guía de Normativa de Pernocta y Acampada Libre en Jaén',
    summaryText: 'Consulta la normativa legal para pernoctar en furgoneta y autocaravana en Jaén: Parque Natural Sierras de Cazorla, Segura y Las Villas, y Despeñaperros.',
    goldenRule: 'Respeto al parque natural más grande de España: En Cazorla, Segura y Las Villas la pernocta solo es legal en campings oficiales y áreas autorizadas.',
    introText: 'Jaén posee el mayor espacio protegido de España y del segundo de Europa: el Parque Natural Sierras de Cazorla, Segura y Las Villas. Las patrullas del SEPRONA y agentes de medio ambiente velan por el cumplimiento del Decreto 26/2018.',
    sanctionsRange: '60 € hasta 1.500 €',
    coastalRules: 'En los embalses del Tranco de Beas, Guadalén y Giribaile, la normativa fluvial de la Confederación Hidrográfica prohíbe la acampada en márgenes y áreas de baño no acotadas.',
    naturalParksRules: 'En Cazorla, Segura y Las Villas, Despeñaperros y Sierra Mágina está terminantemente prohibido pernoctar en pistas forestales, miradores o márgenes de ríos. La pernocta nocturna fuera de campings o áreas de autocaravanas registradas es objeto de sanción.',
    naturalParksList: [
      'Parque Natural Sierras de Cazorla, Segura y Las Villas',
      'Parque Natural Sierra de Despeñaperros',
      'Parque Natural Sierra Mágina',
      'Parque Natural Sierra de Andújar'
    ],
    localTips: [
      'Reserva tu parcela en campings emblemáticos como Camping Puente de las Herrerías cerca del nacimiento del Guadalquivir.',
      'En Úbeda y Baeza utiliza los aparcamientos municipales para autocaravanas debidamente acondicionados.',
      'Durante los meses de verano respeta al máximo las restricciones de prevención de incendios forestales.'
    ],
    faqs: [
      {
        question: '¿Se puede pernoctar dentro del Parque Natural de Cazorla?',
        answer: 'Únicamente en los campings oficiales del parque y en las áreas autorizadas para autocaravanas. La pernocta en miradores o pistas de montaña está prohibida.'
      },
      {
        question: '¿Se permite encender barbacoas en los campings de Jaén?',
        answer: 'Los campings disponen de instalaciones homologadas o cocinas eléctricas en época de prevención de incendios para total seguridad.'
      },
      {
        question: '¿Cuáles son los campings mejor valorados en Jaén?',
        answer: 'Los campings de la zona del río Guadalquivir y Cazorla destacan por sus sombras, piscina y cercanía a rutas de senderismo.'
      }
    ]
  },
  malaga: {
    slug: 'malaga',
    provinceName: 'Málaga',
    metaTitle: 'Guía Normativa de Pernocta y Acampada Libre en Málaga 2026 | MejoresCampings',
    metaDesc: 'Descubre la regulación oficial para pernoctar en furgoneta camper, autocaravana y acampada libre en Málaga. Ley de Costas y Parques Naturales.',
    headline: 'Guía de Normativa de Pernocta y Acampada Libre en Málaga',
    summaryText: 'Todo lo que necesitas saber antes de iniciar tu ruta en furgoneta camper, autocaravana o tienda de campaña en Málaga, la Costa del Sol y la Serranía de Ronda.',
    goldenRule: 'Aparcar no es acampar: Puedes pernoctar dentro de tu furgoneta o autocaravana siempre que esté estacionada legalmente, no ocupe más espacio del perímetro del vehículo y no despliegues elementos exteriores.',
    introText: 'En Málaga la acampada libre fuera de establecimientos autorizados está prohibida por el Decreto 26/2018 de la Junta de Andalucía. Las policías locales de la Costa del Sol y los agentes de medio ambiente vigilan el cumplimiento de la normativa.',
    sanctionsRange: '60 € hasta más de 1.500 €',
    coastalRules: 'La Ley de Costas (artículo 33) prohíbe la circulación y el estacionamiento/pernocta en playas y zonas del Dominio Público Marítimo-Terrestre a menos de 500 metros en la Costa del Sol (Marbella, Nerja, Estepona, Vélez-Málaga).',
    naturalParksRules: 'En el Parque Nacional Sierra de las Nieves, el Torcal de Antequera y los Montes de Málaga está prohibida la pernocta libre fuera de campings oficiales y áreas camper autorizadas por la Junta de Andalucía.',
    naturalParksList: [
      'Parque Nacional Sierra de las Nieves',
      'Paraje Natural Torcal de Antequera',
      'Parque Natural Montes de Málaga',
      'Parque Natural Sierras de Tejeda, Almijara y Alhama'
    ],
    localTips: [
      'En la Serranía de Ronda pernocta en campings reconocidos como Camping El Sur con vistas a la sierra y servicios completos.',
      'En la Costa del Sol utiliza campings costeros con acceso directo a playa como Cabopino o El Templo del Sol.',
      'No utilices calzos de nivelación en aparcamientos públicos para evitar multas de tráfico.'
    ],
    faqs: [
      {
        question: '¿Es legal la acampada libre en Málaga y Andalucía?',
        answer: 'La acampada libre está prohibida con carácter general en toda Andalucía por el Decreto 26/2018. Únicamente se permite la pernocta en el interior del vehículo en plazas autorizadas sin desplegar elementos al exterior.'
      },
      {
        question: '¿Cuál es la diferencia entre aparcar/pernoctar y acampar?',
        answer: 'Pernoctar consiste en dormir dentro de un vehículo correctamente estacionado sin sobrepasar sus dimensiones. Acampar implica desplegar elementos al exterior y solo es legal en campings y áreas autorizadas.'
      },
      {
        question: '¿Se puede dormir en la playa con furgoneta o coche?',
        answer: 'No. La Ley de Costas prohíbe el estacionamiento y la pernocta en playas y franja marítimo-terrestre en todo el litoral español.'
      }
    ]
  },
  sevilla: {
    slug: 'sevilla',
    provinceName: 'Sevilla',
    metaTitle: 'Guía Normativa de Pernocta y Acampada Libre en Sevilla 2026 | MejoresCampings',
    metaDesc: 'Normativa legal de pernocta en Sevilla. Regulación en Sierra Norte de Sevilla, Pinares de Aznalcázar y Vega del Guadalquivir.',
    headline: 'Guía de Normativa de Pernocta y Acampada Libre en Sevilla',
    summaryText: 'Información oficial para viajar en camper o autocaravana por la provincia de Sevilla: Sierra Norte, Pinares de Aznalcázar y entorno metropolitano.',
    goldenRule: 'Respetar las zonas forestales y urbanas: Pernoctar en el interior del vehículo estacionado es legal; acampar en la dehesa o pinar está prohibido.',
    introText: 'La provincia de Sevilla cuenta con la Sierra Norte de Sevilla y extensas áreas de dehesa y Pinares de Aznalcázar. La acampada libre no está permitida según el Decreto 26/2018 de Andalucía.',
    sanctionsRange: '60 € hasta 1.200 €',
    coastalRules: 'En la cuenca navegable y márgenes del Río Guadalquivir y embalses sevillanos, la Confederación Hidrográfica del Guadalquivir vigila que no se produzca vertido de residuos ni acampada en riberas.',
    naturalParksRules: 'En el Parque Natural Sierra Norte de Sevilla (Cazalla, Constantina, San Nicolás del Puerto) y los Pinares de Aznalcázar se aplican estrictas medidas de prevención contra incendios y protección medioambiental.',
    naturalParksList: [
      'Parque Natural Sierra Norte de Sevilla',
      'Paisaje Protegido Corredor Verde del Guadiamar',
      'Pinares de Aznalcázar y Puebla del Río'
    ],
    localTips: [
      'Para visitar Sevilla capital, utiliza el área de autocaravanas del Puerto Gelves o el Camping Dehesa Nueva en Aznalcázar.',
      'En la Sierra Norte disfruta de las vías verdes y campings rodeados de encinas y alcornoques.',
      'Mantén siempre cerrados los grifos de depósitos de grises en la vía pública.'
    ],
    faqs: [
      {
        question: '¿Dónde aparcar y pernoctar para visitar Sevilla capital?',
        answer: 'Sevilla dispone de áreas para autocaravanas con vigilancia en la zona del puerto/isla de la Cartuja y campings bien comunicados por autobús o metro.'
      },
      {
        question: '¿Se puede acampar en el Parque Natural Sierra Norte de Sevilla?',
        answer: 'No libremente. La pernocta y acampada debe realizarse en campings registrados o áreas de pernocta autorizadas por la Junta de Andalucía.'
      },
      {
        question: '¿Qué servicios tienen los campings de la provincia de Sevilla?',
        answer: 'Piscina, parcelas con toma eléctrica, agua potable, vaciado de depósitos, restauración y actividades en la naturaleza.'
      }
    ]
  }
};
