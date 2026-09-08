// store.js
const USERS_KEY = 'randomizer_users';
const TASKS_KEY = 'randomizer_tasks';
const HISTORY_KEY = 'randomizer_history';

export const getInitialData = () => {
  // Asumidores (Azules) y No Asumidores (Rojos) del Excel
  const defaultUsers = [
    // Asumidores
    { id: '1', name: 'BUENDIA', role: 'asumidor', protectedTasks: [], active: false },
    { id: '2', name: 'CORTES', role: 'asumidor', protectedTasks: [], active: false },
    { id: '3', name: 'LOLO 2', role: 'asumidor', protectedTasks: [], active: false },
    { id: '4', name: 'RAUL', role: 'asumidor', protectedTasks: [], active: true },
    { id: '5', name: 'SERGIO 1', role: 'asumidor', protectedTasks: [], active: true },
    { id: '6', name: 'MARC 2', role: 'asumidor', protectedTasks: [], active: true },
    { id: '7', name: 'PACO', role: 'asumidor', protectedTasks: [], active: true },
    { id: '8', name: 'DIDAC', role: 'asumidor', protectedTasks: [], active: true },
    { id: '9', name: 'JONATHAN', role: 'asumidor', protectedTasks: [], active: true },
    { id: '10', name: 'OSCAR', role: 'asumidor', protectedTasks: [], active: true },
    { id: '11', name: 'LUIS', role: 'asumidor', protectedTasks: [], active: true },
    { id: '12', name: 'MANEL', role: 'asumidor', protectedTasks: [], active: true },
    
    // No Asumidores
    { id: '13', name: 'SERGI', role: 'no-asumidor', protectedTasks: [], active: true },
    { id: '14', name: 'RICARDO', role: 'no-asumidor', protectedTasks: [], active: true },
    { id: '15', name: 'LUZON1', role: 'no-asumidor', protectedTasks: [], active: true },
    { id: '16', name: 'DAMIA', role: 'no-asumidor', protectedTasks: [], active: true },
    { id: '17', name: 'CRISTIAN 2', role: 'no-asumidor', protectedTasks: [], active: true },
    { id: '18', name: 'ANTON 1', role: 'no-asumidor', protectedTasks: [], active: true },
    { id: '19', name: 'JORDI', role: 'no-asumidor', protectedTasks: [], active: true },
    { id: '20', name: 'ARTIOM 2', role: 'no-asumidor', protectedTasks: [], active: true },
    { id: '21', name: 'PEDRO', role: 'no-asumidor', protectedTasks: [], active: true },
    { id: '22', name: 'VICTOR.A', role: 'no-asumidor', protectedTasks: [], active: true },
  ];

  // Tareas de la cabecera del Excel
  const defaultTasks = [
    { id: 't1', name: 'Despertar', type: 'protected' },
    { id: 't2', name: 'Cocina', type: 'cocina' },
    { id: 't3', name: 'I. Comida', type: 'regular' },
    { id: 't4', name: 'I. Limpieza', type: 'regular' },
    { id: 't5', name: 'Lavandería', type: 'regular' },
    { id: 't6', name: 'Animales', type: 'regular' },
    { id: 't7', name: 'Taller', type: 'regular' },
    { id: 't8', name: 'A. Chófer', type: 'regular' },
    { id: 't9', name: 'Puesta en marcha PM', type: 'protected' },
  ];

  // Compatibilidad hacia atrás: Asegurar que los usuarios antiguos tengan la propiedad active
  let storedUsers = JSON.parse(localStorage.getItem(USERS_KEY));
  if (storedUsers) {
    storedUsers = storedUsers.map(u => ({ ...u, active: u.active !== undefined ? u.active : true }));
  }

  return {
    users: storedUsers || defaultUsers,
    tasks: JSON.parse(localStorage.getItem(TASKS_KEY)) || defaultTasks,
    history: JSON.parse(localStorage.getItem(HISTORY_KEY)) || [],
  };
};

export const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
export const saveTasks = (tasks) => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
export const saveHistory = (history) => localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
