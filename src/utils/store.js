// store.js
const USERS_KEY = 'randomizer_users';
const TASKS_KEY = 'randomizer_tasks';
const HISTORY_KEY = 'randomizer_history';

export const getInitialData = () => {
  const defaultUsers = [
    { id: '1', name: 'Ana', role: 'asumidor', protectedTasks: [] },
    { id: '2', name: 'Luis', role: 'no-asumidor', protectedTasks: [] },
    { id: '3', name: 'Carlos (Cocina)', role: 'asumidor', protectedTasks: ['Cocina'] },
    { id: '4', name: 'María (Reserva)', role: 'asumidor', protectedTasks: ['Reserva'] },
    { id: '5', name: 'Pedro (Despertar)', role: 'no-asumidor', protectedTasks: ['Despertar'] },
  ];

  const defaultTasks = [
    { id: 't1', name: 'Cocina', type: 'cocina' },
    { id: 't2', name: 'Reserva', type: 'protected' },
    { id: 't3', name: 'Despertar', type: 'protected' },
    { id: 't4', name: 'Limpieza', type: 'regular' },
    { id: 't5', name: 'Compras', type: 'regular' },
  ];

  return {
    users: JSON.parse(localStorage.getItem(USERS_KEY)) || defaultUsers,
    tasks: JSON.parse(localStorage.getItem(TASKS_KEY)) || defaultTasks,
    history: JSON.parse(localStorage.getItem(HISTORY_KEY)) || [],
  };
};

export const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
export const saveTasks = (tasks) => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
export const saveHistory = (history) => localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
