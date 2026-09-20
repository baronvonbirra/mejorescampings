export interface AreaAc {
  id: string;
  name: string;
  province: string;
  provinceSlug: string;
  municipality: string;
  address: string;
  lat: number;
  lng: number;
  priceInfo: string;
  isFree: boolean;
  capacity: number;
  services: {
    water: boolean;
    dumpGrey: boolean;
    dumpBlack: boolean;
    electricity: boolean;
    wifi: boolean;
    security: boolean;
  };
  description: string;
}

export const AREAS_AC: AreaAc[] = [
  // Málaga
  {
    id: 'ac-malaga-01',
    name: 'Área Camper Málaga Beach',
    province: 'Málaga',
    provinceSlug: 'malaga',
    municipality: 'Málaga',
    address: 'Carretera de Almería, 321, 29018 Málaga',
    lat: 36.712,
    lng: -4.335,
    priceInfo: '15€ / 24 horas',
    isFree: false,
    capacity: 45,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: true, wifi: true, security: true },
    description: 'Área camper privada a solo 50 metros de la playa de El Candado. Cuenta con videovigilancia, tomas eléctricas individuales, ducha y conexión fluida con el centro de Málaga en autobús.'
  },
  {
    id: 'ac-malaga-02',
    name: 'Área de Autocaravanas de Antequera',
    province: 'Málaga',
    provinceSlug: 'malaga',
    municipality: 'Antequera',
    address: 'Calle Miguel de Unamuno, 29200 Antequera',
    lat: 37.025,
    lng: -4.561,
    priceInfo: 'Gratuito (Máx 48h)',
    isFree: true,
    capacity: 25,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: false, wifi: false, security: false },
    description: 'Área de servicio pública gratuita junto al centro histórico de Antequera. Excelente ubicación para visitar El Torcal de Antequera y el sitio de los Dólmenes.'
  },

  // Cádiz
  {
    id: 'ac-cadiz-01',
    name: 'Área Camper Tarifa - Bolonia',
    province: 'Cádiz',
    provinceSlug: 'cadiz',
    municipality: 'Tarifa',
    address: 'Lugar Bolonia s/n, 11380 Tarifa',
    lat: 36.091,
    lng: -5.768,
    priceInfo: '14€ / día',
    isFree: false,
    capacity: 60,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: true, wifi: true, security: true },
    description: 'Área camper vigilada situada junto a la duna y la ensenada de Bolonia y las ruinas romanas de Baelo Claudia. Entorno idóneo para deportes de viento y playa.'
  },
  {
    id: 'ac-cadiz-02',
    name: 'Área de Autocaravanas de Conil de la Frontera',
    province: 'Cádiz',
    provinceSlug: 'cadiz',
    municipality: 'Conil de la Frontera',
    address: 'Avenida de la Música s/n, 11140 Conil',
    lat: 36.279,
    lng: -6.082,
    priceInfo: '12€ / día',
    isFree: false,
    capacity: 40,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: true, wifi: false, security: true },
    description: 'Ubicada a un paseo del centro urbano de Conil y sus calas. Ofrece vaciado de aguas residuales, recarga de agua potable y cercanía a comercios.'
  },

  // Almería
  {
    id: 'ac-almeria-01',
    name: 'Área Camper Cabo de Gata (San José)',
    province: 'Almería',
    provinceSlug: 'almeria',
    municipality: 'Níjar',
    address: 'Paraje los Albaricoques, 04118 Níjar',
    lat: 36.785,
    lng: -2.210,
    priceInfo: '12€ / 24h',
    isFree: false,
    capacity: 50,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: true, wifi: true, security: true },
    description: 'Recinto cerrado y tranquilo ideal para explorar el Parque Natural de Cabo de Gata, las playas de Genoveses y Mónsul sin arriesgarse a sanciones de pernocta libre.'
  },

  // Granada
  {
    id: 'ac-granada-01',
    name: 'Área de Autocaravanas Sierra Nevada (Los Peñones)',
    province: 'Granada',
    provinceSlug: 'granada',
    municipality: 'Monachil',
    address: 'Estación de Esquí Pradollano, 18196 Monachil',
    lat: 37.098,
    lng: -3.395,
    priceInfo: '10€ / día',
    isFree: false,
    capacity: 90,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: true, wifi: false, security: true },
    description: 'Situada en la zona alta de Pradollano a 2.100 metros de altitud. Vistas espectaculares de la alta montaña y acceso directo al telesilla en invierno.'
  },

  // Huelva
  {
    id: 'ac-huelva-01',
    name: 'Área Camper Mazagón - Doñana',
    province: 'Huelva',
    provinceSlug: 'huelva',
    municipality: 'Moguer',
    address: 'Carretera Huelva-Matalascañas km 22, 21820 Mazagón',
    lat: 37.135,
    lng: -6.820,
    priceInfo: '11€ / día',
    isFree: false,
    capacity: 35,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: true, wifi: true, security: true },
    description: 'Bajo el pinar de Mazagón y en la entrada al Parque Natural de Doñana. A 5 minutos a pie de la playa del Asperillo.'
  },

  // Jaén
  {
    id: 'ac-jaen-01',
    name: 'Área de Autocaravanas de Cazorla',
    province: 'Jaén',
    provinceSlug: 'jaen',
    municipality: 'Cazorla',
    address: 'Carretera del Tranco A-319 km 17, 23470 Cazorla',
    lat: 37.915,
    lng: -3.002,
    priceInfo: 'Gratuito',
    isFree: true,
    capacity: 20,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: false, wifi: false, security: false },
    description: 'Punto de servicio y pernocta municipal a las puertas del Parque Natural Sierra de Cazorla, Segura y Las Villas.'
  },

  // Córdoba
  {
    id: 'ac-cordoba-01',
    name: 'Área de Autocaravanas de Córdoba Centro',
    province: 'Córdoba',
    provinceSlug: 'cordoba',
    municipality: 'Córdoba',
    address: 'Avenida del Custodio s/n, 14004 Córdoba',
    lat: 37.872,
    lng: -4.782,
    priceInfo: '18€ / 24h',
    isFree: false,
    capacity: 30,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: true, wifi: true, security: true },
    description: 'Ubicada a solo 10 minutos a pie de la Mezquita-Catedral y el Alcázar de los Reyes Cristianos. Recinto vigilado de alta demanda.'
  },

  // Sevilla
  {
    id: 'ac-sevilla-01',
    name: 'Área Camper Puerto de Sevilla',
    province: 'Sevilla',
    provinceSlug: 'sevilla',
    municipality: 'Sevilla',
    address: 'Avenida de las Razas, 41012 Sevilla',
    lat: 37.362,
    lng: -5.988,
    priceInfo: '15€ / 24h',
    isFree: false,
    capacity: 50,
    services: { water: true, dumpGrey: true, dumpBlack: true, electricity: true, wifi: true, security: true },
    description: 'Área privada junto al río Guadalquivir con parada de autobús a la Catedral y Plaza de España. Servicios completos y seguridad 24h.'
  }
];
