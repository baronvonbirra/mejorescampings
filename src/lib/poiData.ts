export interface PoiItem {
  slug: string;
  name: string;
  fullName: string;
  province: string;
  provinceSlug: string;
  lat: number;
  lng: number;
  description: string;
  summaryText: string;
  heroImage: string;
  highlights: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const POI_LIST: PoiItem[] = [
  {
    slug: 'cabo-de-gata',
    name: 'Cabo de Gata',
    fullName: 'Parque Natural Cabo de Gata-Níjar',
    province: 'Almería',
    provinceSlug: 'almeria',
    lat: 36.782,
    lng: -2.235,
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryText: 'Encuentra los mejores campings y parcelas camper cerca del Parque Natural Cabo de Gata-Níjar. Playas vírgenes, calas volcánicas y clima cálido todo el año.',
    description: 'El Parque Natural Cabo de Gata-Níjar es uno de los espacios protegidos costeros más espectaculares de la Península Ibérica. Con sus playas volcánicas de aguas cristalinas como Genoveses y Mónsul, es el destino preferido para los amantes del camping, el senderismo y las rutas en furgoneta camper.',
    highlights: ['Playa de los Genoveses y Mónsul', 'Faro de Cabo de Gata y Arrecife de las Sirenas', 'Salinas y avistamiento de flamencos', 'Pueblos blancos de Níjar, San José y Las Negras'],
    faqs: [
      {
        question: '¿Puedo acampar libremente en las playas de Cabo de Gata?',
        answer: 'No. Al ser un Parque Natural altamente protegido, la acampada libre está estrictamente prohibida y sancionada con multas severas. Es obligatorio pernoctar en campings autorizados o áreas camper habilitadas.'
      },
      {
        question: '¿Qué campings están más cerca de las playas de San José y Mónsul?',
        answer: 'Camping Los Escullos y Camping Cabo de Gata disponen de acceso rápido a las principales rutas y calas del Parque Natural con parcelas sombreadas, piscina y bungalows.'
      }
    ]
  },
  {
    slug: 'caminito-del-rey',
    name: 'Caminito del Rey',
    fullName: 'Desfiladero de los Gaitanes y Caminito del Rey',
    province: 'Málaga',
    provinceSlug: 'malaga',
    lat: 36.915,
    lng: -4.772,
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    summaryText: 'Campings mejor valorados cerca del Caminito del Rey y el Chorro en Málaga. Naturaleza, escalada, embalses y rutas inolvidables.',
    description: 'El Caminito del Rey en la provincia de Málaga es una impresionante pasarela suspendida a más de 100 metros de altura sobre el desfiladero de los Gaitanes. Su entorno natural ofrece embalses turquesa, zonas de escalada mundialmente famosas y campings acogedores ideales para familias y aventureros.',
    highlights: ['Pasarelas del Desfiladero de los Gaitanes', 'Embalses del Guadalhorce y Ardales', 'Zonas de escalada en El Chorro', 'Ruinas de Bobastro y la Cueva de Ardales'],
    faqs: [
      {
        question: '¿Con cuánta antelación debo reservar la entrada al Caminito del Rey?',
        answer: 'Es altamente recomendable comprar las entradas con 1 a 2 meses de antelación en la web oficial, especialmente para visitas en fin de semana o temporada alta.'
      },
      {
        question: '¿Existen campings con piscina cerca del Caminito del Rey?',
        answer: 'Sí, establecimientos como Camping Ardales y Camping Parque Tropical en las proximidades ofrecen parcelas sombreadas, bungalows y piscina a pocos minutos del centro de visitantes.'
      }
    ]
  },
  {
    slug: 'parque-natural-donana',
    name: 'Parque Natural Doñana',
    fullName: 'Parque Nacional y Natural de Doñana',
    province: 'Huelva',
    provinceSlug: 'huelva',
    lat: 37.012,
    lng: -6.520,
    heroImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    summaryText: 'Campings rodeados de pinares y dunas en el entorno de Doñana, Mazagón y Matalascañas. Naturaleza virgen y acceso directo a la playa.',
    description: 'Doñana es un mosaico único de ecosistemas que albergan una biodiversidad sin igual en Europa: marismas, dunas móviles, pinares y kilómetros de playas vírgenes. Un destino idóneo para alojarse en campings integrados en la naturaleza entre Huelva y Sevilla.',
    highlights: ['Dunas fósiles y acantilado del Asperillo', 'Avistamiento de fauna en el Centro de Visitantes El Acebuche', 'Aldea de El Rocío y marismas', 'Playas vírgenes de Mazagón y Matalascañas'],
    faqs: [
      {
        question: '¿Se puede acceder en coche o camper a la reserva biológica de Doñana?',
        answer: 'El acceso al núcleo de la reserva protegida está restringido a visitas guiadas autorizadas en vehículos 4x4. Sin embargo, las zonas periféricas y los campings de Mazagón y Matalascañas disponen de libre acceso.'
      },
      {
        question: '¿Cuáles son los campings recomendados en Doñana?',
        answer: 'Camping Doñana Playa y Camping Dehesa Nueva ofrecen extensas instalaciones bajo pinares centenarios con piscinas, restauración y alojamiento en bungalows.'
      }
    ]
  },
  {
    slug: 'sierra-de-cazorla',
    name: 'Sierra de Cazorla',
    fullName: 'Parque Natural Sierra de Cazorla, Segura y Las Villas',
    province: 'Jaén',
    provinceSlug: 'jaen',
    lat: 37.913,
    lng: -2.983,
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    summaryText: 'Campings en la mayor masa forestal protegida de España. Nacimiento del Guadalquivir, senderismo y avistamiento de fauna en Jaén.',
    description: 'El Parque Natural Sierra de Cazorla, Segura y Las Villas es el espacio protegido más extenso de España. Sus ríos de agua cristalina, frondosos bosques de pino y rutas legendarias como la del Río Borosa lo convierten en el paraíso andaluz del camping de montaña.',
    highlights: ['Cerrada del Utrero y Ruta del Río Borosa', 'Nacimiento del Río Guadalquivir', 'Embalse de Tranco de Beas', 'Castillo de la Yedra en Cazorla'],
    faqs: [
      {
        question: '¿Cuál es la mejor época para ir de camping a la Sierra de Cazorla?',
        answer: 'Primavera y otoño son estaciones ideales por el caudal de sus cascadas y las temperaturas agradables. En verano, sus ríos y piscinas naturales ofrecen un refrescante refugio.'
      },
      {
        question: '¿Los campings de Cazorla disponen de cabañas de madera o bungalows?',
        answer: 'Sí, la mayoría de campings como Camping Puente de las Herrerías cuentan con bungalows totalmente equipados y parcelas junto a la orilla del río.'
      }
    ]
  },
  {
    slug: 'sierra-nevada',
    name: 'Sierra Nevada',
    fullName: 'Parque Nacional y Natural de Sierra Nevada',
    province: 'Granada',
    provinceSlug: 'granada',
    lat: 37.093,
    lng: -3.325,
    heroImage: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80',
    summaryText: 'Campings y alojamientos de montaña a los pies de Sierra Nevada y la Alpujarra Granadina. Vistas panóramicas y senderos de alta montaña.',
    description: 'Sierra Nevada alberga las cumbres más altas de la Península Ibérica, como el Mulhacén y el Veleta. Sus campings en la Alpujarra y el entorno de Granada combinan aire puro de montaña, gastronomía tradicional y proximidad a la estación de esquí y a la Alhambra.',
    highlights: ['Pueblos pintorescos de la Alpujarra (Órgiva, Capileira, Pampaneira)', 'Ruta de los Cahorros de Monachil', 'Cumbres del Mulhacén y Veleta', 'Proximidad a Granada ciudad y la Alhambra'],
    faqs: [
      {
        question: '¿Hay campings abiertos todo el año cerca de Sierra Nevada?',
        answer: 'Sí, varios campings en el entorno de Monachil, Güéjar Sierra y la Alpujarra abren los 365 días del año con bungalows calefactados para la temporada invernal.'
      }
    ]
  },
  {
    slug: 'sierra-de-grazalema',
    name: 'Sierra de Grazalema',
    fullName: 'Parque Natural Sierra de Grazalema',
    province: 'Cádiz',
    provinceSlug: 'cadiz',
    lat: 36.758,
    lng: -5.367,
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    summaryText: 'Campings y áreas de acampada en los Pueblos Blancos de Cádiz. Pinsapares únicos, la Garganta del Verde y paisajes kársticos.',
    description: 'Reserva de la Biosfera por la UNESCO, la Sierra de Grazalema destaca por sus frondosos bosques de pinsapos, sus espectaculares gargantas kársticas y la ruta de los Pueblos Blancos gaditanos como Grazalema, Zahara de la Sierra y Benamahoma.',
    highlights: ['Bosque de Pinsapos de Grazalema', 'Garganta del Verde y Cueva del Gato', 'Zahara de la Sierra y su embalse', 'Ruta de senderismo del Río Majaceite'],
    faqs: [
      {
        question: '¿Necesito permiso para visitar el Sendero del Pinsapar?',
        answer: 'Sí, debido a su alto valor ecológico, la Consejería de Medio Ambiente exige previa autorización gratuita para recorrer el sendero del Pinsapar entre Grazalema y Benamahoma.'
      }
    ]
  },
  {
    slug: 'torcal-de-antequera',
    name: 'Torcal de Antequera',
    fullName: 'Paraje Natural El Torcal de Antequera',
    province: 'Málaga',
    provinceSlug: 'malaga',
    lat: 36.953,
    lng: -4.545,
    heroImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
    summaryText: 'Campings ubicados cerca del laberinto kárstico del Torcal de Antequera y los Dólmenes Patrimonio de la Humanidad.',
    description: 'El Torcal de Antequera es uno de los ejemplos de paisaje kárstico más impresionantes de Europa. Sus esculturas de piedra caliza formadas durante millones de años ofrecen senderos mágicos y una experiencia astronómica fascinante desde sus campings limítrofes.',
    highlights: ['Ruta Verde y Ruta Amarilla del Torcal', 'Centro de Visitantes Torcal Alto', 'Sitio de los Dólmenes de Antequera', 'Peñón de los Enamorados'],
    faqs: [
      {
        question: '¿Qué campings están más próximos a Antequera y El Torcal?',
        answer: 'En Antequera y sus alrededores se encuentran campings con vistas a la montaña, equipados con piscina y conectados por autovía con Málaga capital.'
      }
    ]
  }
];
