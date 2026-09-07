export const generateDailySchedule = (users, tasks, history) => {
  const schedule = [];
  const availableUsers = new Set(users.map(u => u.id));

  const getTaskCount = (userId, taskId) => {
    return history.reduce((count, day) => {
      const didTask = day.assignments.some(a => a.userId === userId && a.taskId === taskId);
      return count + (didTask ? 1 : 0);
    }, 0);
  };

  const getDaysSinceTask = (userId, taskId) => {
    for (let i = 0; i < history.length; i++) {
      // history[0] is the most recent day (we will unshift new days)
      const didTask = history[i].assignments.some(a => a.userId === userId && a.taskId === taskId);
      if (didTask) return i;
    }
    return Infinity;
  };

  const sortUsersForTask = (candidates, taskId) => {
    return candidates.sort((a, b) => {
      // 1. Prioritize users protected for this specific task
      const aProtected = a.protectedTasks.includes(tasks.find(t => t.id === taskId).name) ? 1 : 0;
      const bProtected = b.protectedTasks.includes(tasks.find(t => t.id === taskId).name) ? 1 : 0;
      if (aProtected !== bProtected) return bProtected - aProtected;

      // 2. Fewest total times doing this task
      const countA = getTaskCount(a.id, taskId);
      const countB = getTaskCount(b.id, taskId);
      if (countA !== countB) return countA - countB;

      // 3. Longest time since doing this task (largest index = longer ago)
      const daysA = getDaysSinceTask(a.id, taskId);
      const daysB = getDaysSinceTask(b.id, taskId);
      if (daysA !== daysB) return daysB - daysA;

      // 4. Random tiebreaker
      return Math.random() - 0.5;
    });
  };

  const getCandidate = (taskId, roleFilter = null, mustBeProtected = false) => {
    let candidates = users.filter(u => availableUsers.has(u.id) && u.active !== false);
    
    if (roleFilter) {
      candidates = candidates.filter(u => u.role === roleFilter);
    }
    
    if (mustBeProtected) {
      const taskName = tasks.find(t => t.id === taskId).name;
      candidates = candidates.filter(u => u.protectedTasks.includes(taskName));
    }

    if (candidates.length === 0) return null;

    candidates = sortUsersForTask(candidates, taskId);
    const selected = candidates[0];
    availableUsers.delete(selected.id);
    return selected;
  };

  // Order of task assignment: Protected tasks first, then Cocina, then Regular
  const protectedTasks = tasks.filter(t => t.type === 'protected');
  const cocinaTasks = tasks.filter(t => t.type === 'cocina');
  const regularTasks = tasks.filter(t => t.type === 'regular');

  const orderedTasks = [...protectedTasks, ...cocinaTasks, ...regularTasks];

  for (const task of orderedTasks) {
    if (task.type === 'protected') {
      // 1 person, must be protected for this task
      const assigned = getCandidate(task.id, null, true);
      if (assigned) {
        schedule.push({ taskId: task.id, users: [assigned] });
      }
    } else {
      // Cocina and Regular: 1 Asumidor + 1 No Asumidor
      const asumidor = getCandidate(task.id, 'asumidor', false);
      const noAsumidor = getCandidate(task.id, 'no-asumidor', false);
      
      const assignedUsers = [];
      if (asumidor) assignedUsers.push(asumidor);
      if (noAsumidor) assignedUsers.push(noAsumidor);

      if (assignedUsers.length > 0) {
        schedule.push({ taskId: task.id, users: assignedUsers });
      }
    }
  }

  return schedule;
};
