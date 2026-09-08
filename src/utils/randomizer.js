export const isPMTask = (task) => {
  if (!task) return false;
  const name = (task.name || '').trim().toLowerCase();
  return (
    name.includes('puesta en marcha') || 
    name.includes('mañana') || 
    name.includes('pm') || 
    name.includes('acompañ')
  );
};

export const isNewInPM = (user) => {
  if (!user) return false;
  return user.active !== false && (user.role === 'nuevo' || user.inPM === true);
};

// Contar cuántos días lleva un nuevo usuario en Puesta en Marcha (máximo 7)
export const getNewUserPMDays = (userId, history = [], pmTaskId = null, tasks = []) => {
  if (!userId || !Array.isArray(history)) return 0;
  return history.reduce((count, day) => {
    const didPM = (day.assignments || []).some(a => {
      if (String(a.userId) !== String(userId)) return false;
      if (pmTaskId && String(a.taskId) === String(pmTaskId)) return true;
      if (tasks.length > 0) {
        const t = tasks.find(item => String(item.id) === String(a.taskId));
        return isPMTask(t);
      }
      return false;
    });
    return count + (didPM ? 1 : 0);
  }, 0);
};

export const generateDailySchedule = (users, tasks, history) => {
  const schedule = [];
  const availableUsers = new Set(users.map(u => u.id));

  const getTaskCount = (userId, taskId) => {
    return history.reduce((count, day) => {
      const didTask = (day.assignments || []).some(a => a.userId === userId && a.taskId === taskId);
      return count + (didTask ? 1 : 0);
    }, 0);
  };

  const getDaysSinceTask = (userId, taskId) => {
    for (let i = 0; i < history.length; i++) {
      // history[0] es el día más reciente
      const didTask = (history[i].assignments || []).some(a => a.userId === userId && a.taskId === taskId);
      if (didTask) return i;
    }
    return Infinity;
  };

  const sortUsersForTask = (candidates, taskId) => {
    return candidates.sort((a, b) => {
      // 1. Priorizar usuarios con protección para esta tarea específica
      const aProtected = a.protectedTasks?.includes(tasks.find(t => t.id === taskId)?.name) ? 1 : 0;
      const bProtected = b.protectedTasks?.includes(tasks.find(t => t.id === taskId)?.name) ? 1 : 0;
      if (aProtected !== bProtected) return bProtected - aProtected;

      // 2. Menor número total de veces realizando la tarea
      const countA = getTaskCount(a.id, taskId);
      const countB = getTaskCount(b.id, taskId);
      if (countA !== countB) return countA - countB;

      // 3. Más tiempo transcurrido desde la última vez (mayor índice = más antiguo)
      const daysA = getDaysSinceTask(a.id, taskId);
      const daysB = getDaysSinceTask(b.id, taskId);
      if (daysA !== daysB) return daysB - daysA;

      // 4. Desempate aleatorio
      return Math.random() - 0.5;
    });
  };

  const sortAsumidoresForPM = (candidates, pmTaskId) => {
    return candidates.sort((a, b) => {
      // 1. Priorizar asumidores que más tiempo lleven sin ser PM (Infinity = nunca han sido PM)
      // Mantiene el ciclo en memoria para no repetir entre días y cuando entre un nuevo usuario
      const daysA = getDaysSinceTask(a.id, pmTaskId);
      const daysB = getDaysSinceTask(b.id, pmTaskId);
      if (daysA !== daysB) return daysB - daysA;

      // 2. Menor cantidad histórica acumulada de veces como PM
      const countA = getTaskCount(a.id, pmTaskId);
      const countB = getTaskCount(b.id, pmTaskId);
      if (countA !== countB) return countA - countB;

      return Math.random() - 0.5;
    });
  };

  const getCandidate = (taskId, roleFilter = null, mustBeProtected = false) => {
    // Los usuarios en estado "nuevo" (Puesta en Marcha) NUNCA se asignan a tareas ordinarias
    let candidates = users.filter(u => availableUsers.has(u.id) && u.active !== false && !isNewInPM(u));
    
    if (roleFilter) {
      candidates = candidates.filter(u => u.role === roleFilter);
    }
    
    if (mustBeProtected) {
      const taskName = tasks.find(t => t.id === taskId)?.name;
      candidates = candidates.filter(u => u.protectedTasks?.includes(taskName));
    }

    if (candidates.length === 0) return null;

    candidates = sortUsersForTask(candidates, taskId);
    const selected = candidates[0];
    availableUsers.delete(selected.id);
    return selected;
  };

  // 1. Tareas de Puesta en Marcha / Acompañamiento
  const pmTasks = tasks.filter(t => isPMTask(t));
  const otherProtectedTasks = tasks.filter(t => t.type === 'protected' && !isPMTask(t));
  const cocinaTasks = tasks.filter(t => t.type === 'cocina' && !isPMTask(t));
  const regularTasks = tasks.filter(t => t.type === 'regular' && !isPMTask(t));

  // Primero: Tareas protegidas VIP (como Despertar para coordinadores)
  for (const task of otherProtectedTasks) {
    const assigned = getCandidate(task.id, null, true);
    if (assigned) {
      schedule.push({ taskId: task.id, users: [assigned] });
    }
  }

  // Segundo: Asignar Puesta en Marcha PM si hay usuarios nuevos en adaptación que no hayan superado los 7 días
  // ("solamente ciclará un nuevo PM cuando aparezca un usuario nuevo", hasta 7 días límite)
  const pmTask = pmTasks[0];
  const activeNewUsers = users.filter(u => 
    availableUsers.has(u.id) && 
    isNewInPM(u) && 
    getNewUserPMDays(u.id, history, pmTask?.id, tasks) < 7
  );

  if (pmTask && activeNewUsers.length > 0) {
    const assignedUsers = [];

    let candidateAsumidores = users.filter(u => 
      availableUsers.has(u.id) && 
      u.active !== false && 
      u.role === 'asumidor'
    );
    candidateAsumidores = sortAsumidoresForPM(candidateAsumidores, pmTask.id);

    // Selección de PMs según disponibilidad:
    // Si hay suficientes asumidores: 1 PM distinto por cada nuevo usuario (ej. 2 nuevos = 2 PMs).
    // Si hay escasez: 1 solo asumidor puede ser PM de 2 usuarios nuevos.
    let selectedPMs = [];
    if (candidateAsumidores.length >= activeNewUsers.length) {
      selectedPMs = candidateAsumidores.slice(0, activeNewUsers.length);
    } else if (candidateAsumidores.length > 0) {
      selectedPMs = candidateAsumidores;
    }

    // Marcar los asumidores seleccionados como ocupados
    selectedPMs.forEach(pm => availableUsers.delete(pm.id));

    // Asignar los nuevos usuarios emparejándolos con los PMs
    activeNewUsers.forEach((newUser, idx) => {
      availableUsers.delete(newUser.id);
      const assignedPM = selectedPMs.length > 0 
        ? selectedPMs[idx % selectedPMs.length] 
        : null;

      if (assignedPM && !assignedUsers.some(u => String(u.id) === String(assignedPM.id))) {
        assignedUsers.push({ ...assignedPM, pmRole: 'pm' });
      }
      assignedUsers.push({ ...newUser, pmRole: 'nuevo' });
    });

    if (assignedUsers.length > 0) {
      schedule.push({ taskId: pmTask.id, users: assignedUsers });
    }
  }

  // Tercero: Cocina y Tareas Regulares (1 Asumidor + 1 No Asumidor)
  const remainingTasks = [...cocinaTasks, ...regularTasks];
  for (const task of remainingTasks) {
    const asumidor = getCandidate(task.id, 'asumidor', false);
    const noAsumidor = getCandidate(task.id, 'no-asumidor', false);
    
    const assignedUsers = [];
    if (asumidor) assignedUsers.push(asumidor);
    if (noAsumidor) assignedUsers.push(noAsumidor);

    if (assignedUsers.length > 0) {
      schedule.push({ taskId: task.id, users: assignedUsers });
    }
  }

  return schedule;
};
