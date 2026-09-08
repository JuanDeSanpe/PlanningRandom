import { Shield, ChefHat, Utensils, Sparkles, Shirt, PawPrint, Wrench, Car, ListTodo } from 'lucide-react';

// Mapeo de tonos predefinidos para tareas estándar (con saturación fija del 40%)
export const TASK_CONFIG = {
  'despertar': {
    hue: 42,       // Dorado / Ámbar cálido (40% sat)
    badge: 'PROTEGIDA VIP (Coordis)',
    icon: Shield,
  },
  'cocina': {
    hue: 18,       // Terracota suave (40% sat)
    badge: 'COCINA',
    icon: ChefHat,
  },
  'i. comida': {
    hue: 95,       // Verde Oliva / Salvia (40% sat)
    badge: 'REGULAR',
    icon: Utensils,
  },
  'i. limpieza': {
    hue: 175,      // Aqua / Turquesa suave (40% sat)
    badge: 'REGULAR',
    icon: Sparkles,
  },
  'lavandería': {
    hue: 228,      // Azul Índigo suave (40% sat)
    badge: 'REGULAR',
    icon: Shirt,
  },
  'lavanderia': {
    hue: 228,
    badge: 'REGULAR',
    icon: Shirt,
  },
  'animales': {
    hue: 280,      // Lavanda / Violeta suave (40% sat)
    badge: 'REGULAR',
    icon: PawPrint,
  },
  'taller': {
    hue: 30,       // Bronce / Ocre tierra (40% sat)
    badge: 'REGULAR',
    icon: Wrench,
  },
  'a. chófer': {
    hue: 145,      // Verde Esmeralda suave (40% sat)
    badge: 'REGULAR',
    icon: Car,
  },
  'a. chofer': {
    hue: 145,
    badge: 'REGULAR',
    icon: Car,
  },
};

// Generador determinista de tonalidad para cualquier tarea personalizada (siempre 40% sat)
export const getTaskHue = (taskName = '', taskType = 'regular') => {
  const normalized = (taskName || '').trim().toLowerCase();
  
  if (normalized.includes('despertar') || taskType === 'protected') {
    return 42;
  }
  if (normalized === 'cocina' || taskType === 'cocina') {
    return 18;
  }
  if (TASK_CONFIG[normalized]) {
    return TASK_CONFIG[normalized].hue;
  }
  
  // Hash consistente para tareas creadas manualmente
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
  }
  return Math.abs(hash) % 360;
};

export const getTaskBadgeText = (task) => {
  if (!task) return 'REGULAR';
  const normalized = (task.name || '').trim().toLowerCase();
  if (normalized.includes('despertar') || task.type === 'protected') {
    return 'PROTEGIDA VIP (Coordis)';
  }
  if (task.type === 'cocina' || normalized === 'cocina') {
    return 'COCINA';
  }
  return 'REGULAR';
};

export const TaskIcon = ({ name = '', type = 'regular', size = 18, className = '' }) => {
  const norm = (name || '').trim().toLowerCase();
  
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
