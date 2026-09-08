import { Shield, ChefHat, Utensils, Sparkles, Shirt, PawPrint, Wrench, Car, ListTodo, HeartHandshake } from 'lucide-react';

// Mapeo semántico de tonos por tipo de tarea (todos con saturación fija del 40%)
// Relacionados con la naturaleza y función de la tarea:
export const TASK_CONFIG = {
  // Despertar: Sol de la mañana / Amanecer dorado (cálido y luminoso)
  'despertar': {
    hue: 45,
    badge: 'PROTEGIDA VIP (Coordis)',
    icon: Shield,
    concept: 'Amanecer / Sol'
  },
  // Puesta en marcha PM / Mañana / Acompañamiento: Ámbar amanecer y apoyo
  'puesta en marcha pm': {
    hue: 38,
    badge: 'PROTEGIDA (Acompañamiento)',
    icon: HeartHandshake,
    concept: 'Acompañamiento / Tutoría / Ámbar dorado'
  },
  'puesta en marcha': {
    hue: 38,
    badge: 'PROTEGIDA (Acompañamiento)',
    icon: HeartHandshake,
    concept: 'Acompañamiento / Tutoría / Ámbar dorado'
  },
  'mañana': {
    hue: 38,
    badge: 'PROTEGIDA (Acompañamiento)',
    icon: HeartHandshake,
    concept: 'Acompañamiento / Tutoría / Ámbar dorado'
  },
  'acompañamiento': {
    hue: 38,
    badge: 'PROTEGIDA (Acompañamiento)',
    icon: HeartHandshake,
    concept: 'Acompañamiento / Tutoría / Ámbar dorado'
  },
  // Cocina: Fuego, fogón, pucheros, terracota cálido y acogedor
  'cocina': {
    hue: 18,
    badge: 'COCINA',
    icon: ChefHat,
    concept: 'Fuego / Fogón / Terracota'
  },
  // I. Comida: Huerta, verduras frescas, hojas, verde oliva / salvia
  'i. comida': {
    hue: 95,
    badge: 'REGULAR',
    icon: Utensils,
    concept: 'Alimentos / Huerta / Salvia'
  },
  // I. Limpieza: Agua limpia, jabón, frescura higiénica, cian / aguamarina
  'i. limpieza': {
    hue: 185,
    badge: 'REGULAR',
    icon: Sparkles,
    concept: 'Agua / Jabón / Aguamarina'
  },
  // Lavandería: Colada, suavizante, añil, índigo / azul perwinkle textil
  'lavandería': {
    hue: 220,
    badge: 'REGULAR',
    icon: Shirt,
    concept: 'Colada / Añil / Índigo textil'
  },
  'lavanderia': {
    hue: 220,
    badge: 'REGULAR',
    icon: Shirt,
    concept: 'Colada / Añil / Índigo textil'
  },
  // Animales: Campo abierto, flora silvestre, lavanda / púrpura natural
  'animales': {
    hue: 280,
    badge: 'REGULAR',
    icon: PawPrint,
    concept: 'Campo / Lavanda silvestre'
  },
  // Taller: Herramientas, mecánica, madera y bronce / óxido artesanal
  'taller': {
    hue: 32,
    badge: 'REGULAR',
    icon: Wrench,
    concept: 'Herramientas / Bronce / Cobre'
  },
  // A. Chófer: Carretera, asfalto, ruta verde abeto / transporte
  'a. chófer': {
    hue: 155,
    badge: 'REGULAR',
    icon: Car,
    concept: 'Ruta / Carretera / Abeto'
  },
  'a. chofer': {
    hue: 155,
    badge: 'REGULAR',
    icon: Car,
    concept: 'Ruta / Carretera / Abeto'
  },
};

// Generador de tonalidad (siempre con 40% de saturación)
export const getTaskHue = (taskName = '', taskType = 'regular') => {
  const normalized = (taskName || '').trim().toLowerCase();
  
  if (
    normalized.includes('puesta en marcha') || 
    normalized.includes('mañana') || 
    normalized.includes('acompañamiento') || 
    normalized === 'pm' ||
    normalized.startsWith('pm ') ||
    normalized.endsWith(' pm')
  ) {
    return 38; // Ámbar amanecer
  }

  if (normalized.includes('despertar')) {
    return 45; // Amanecer solar
  }

  if (normalized === 'cocina' || taskType === 'cocina') {
    return 18; // Terracota fuego
  }

  if (taskType === 'protected') {
    return 45;
  }

  if (TASK_CONFIG[normalized]) {
    return TASK_CONFIG[normalized].hue;
  }
  
  // Coincidencia parcial con palabras clave conocidas
  for (const [key, cfg] of Object.entries(TASK_CONFIG)) {
    if (normalized.includes(key)) return cfg.hue;
  }
  
  // Hash consistente para tareas añadidas dinámicamente
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
  }
  return Math.abs(hash) % 360;
};

export const getTaskBadgeText = (task) => {
  if (!task) return 'REGULAR';
  const normalized = (task.name || '').trim().toLowerCase();

  if (normalized.includes('despertar')) {
    return 'PROTEGIDA VIP (Coordis)';
  }

  if (
    normalized.includes('puesta en marcha') || 
    normalized.includes('mañana') || 
    normalized.includes('acompañamiento') || 
    normalized === 'pm' ||
    normalized.startsWith('pm ') ||
    normalized.endsWith(' pm')
  ) {
    return 'PROTEGIDA (Acompañamiento)';
  }

  if (task.type === 'protected') {
    return 'PROTEGIDA VIP';
  }

  if (task.type === 'cocina' || normalized === 'cocina') {
    return 'COCINA';
  }

  return 'REGULAR';
};

export const TaskIcon = ({ name = '', type = 'regular', size = 18, className = '' }) => {
  const norm = (name || '').trim().toLowerCase();
  
  if (
    norm.includes('puesta en marcha') || 
    norm.includes('mañana') || 
    norm.includes('acompañ') || 
    norm === 'pm' ||
    norm.startsWith('pm ') ||
    norm.endsWith(' pm')
  ) {
    return <HeartHandshake size={size} className={className} />;
  }
  if (norm.includes('despertar') || type === 'protected') return <Shield size={size} className={className} />;
  if (norm === 'cocina' || type === 'cocina') return <ChefHat size={size} className={className} />;
  if (norm.includes('comida')) return <Utensils size={size} className={className} />;
  if (norm.includes('limpieza')) return <Sparkles size={size} className={className} />;
  if (norm.includes('lavander')) return <Shirt size={size} className={className} />;
  if (norm.includes('anim')) return <PawPrint size={size} className={className} />;
  if (norm.includes('taller')) return <Wrench size={size} className={className} />;
  if (norm.includes('chófer') || norm.includes('chofer')) return <Car size={size} className={className} />;
  
  return <ListTodo size={size} className={className} />;
};
