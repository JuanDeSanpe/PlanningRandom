import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users, Calendar, Settings, Sparkles, ListTodo, Droplet } from 'lucide-react';
import { getInitialData, saveUsers, saveTasks, saveHistory } from './utils/store';
import { generateDailySchedule } from './utils/randomizer';
import UserList from './components/UserList';
import DailySchedule from './components/DailySchedule';
import TaskList from './components/TaskList';

function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'boutique');
  const [pmSharedMode, setPmSharedMode] = useState(() => localStorage.getItem('app-pm-shared-mode') === 'true');

  const handleTogglePmSharedMode = (isShared) => {
    setPmSharedMode(isShared);
    localStorage.setItem('app-pm-shared-mode', isShared ? 'true' : 'false');
  };

  useEffect(() => {
    document.documentElement.lang = 'es';
    document.documentElement.setAttribute('translate', 'no');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'boutique' ? 'nature' : 'boutique');
  };

  useEffect(() => {
    const data = getInitialData();
    setUsers(data.users);
    setTasks(data.tasks);
    setHistory(data.history);
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const existingToday = data.history.find(h => h.date === todayStr);
    if (existingToday) {
      const userMap = new Map(data.users.map(u => [String(u.id), u]));
      const normalizedToday = {
        ...existingToday,
        displaySchedule: (existingToday.displaySchedule || []).map(item => ({
          ...item,
          users: item.users.map(u => userMap.get(String(u.id)) || u)
        }))
      };
      setTodaySchedule(normalizedToday);
    }
  }, []);

  const handleGenerate = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newSchedule = generateDailySchedule(users, tasks, history, { pmSharedMode });
    
    const flatAssignments = newSchedule.flatMap(s => 
      s.users.map(u => ({ taskId: s.taskId, userId: u.id }))
    );

    const historyRecord = {
      date: todayStr,
      assignments: flatAssignments,
      displaySchedule: newSchedule,
    };

    const newHistory = [historyRecord, ...history];
    setHistory(newHistory);
    saveHistory(newHistory);
    setTodaySchedule(historyRecord);
  };

  const updateUserList = (newUsers) => {
    setUsers(newUsers);
    saveUsers(newUsers);

    // Actualizar nombres en el sorteo actual y en el historial persistido
    const userMap = new Map(newUsers.map(u => [String(u.id), u]));

    if (todaySchedule && todaySchedule.displaySchedule) {
      const updatedTodaySchedule = {
        ...todaySchedule,
        displaySchedule: todaySchedule.displaySchedule.map(item => ({
          ...item,
          users: item.users.map(u => userMap.get(String(u.id)) || u)
        }))
      };
      setTodaySchedule(updatedTodaySchedule);
    }

    if (history && history.length > 0) {
      const updatedHistory = history.map(rec => ({
        ...rec,
        displaySchedule: (rec.displaySchedule || []).map(item => ({
          ...item,
          users: (item.users || []).map(u => userMap.get(String(u.id)) || u)
        }))
      }));
      setHistory(updatedHistory);
      saveHistory(updatedHistory);
    }
  };

  const updateTaskList = (newTasks) => {
    // Sincronizar nombres si alguna tarea/categoría ha cambiado de nombre
    const renamedMap = {};
    tasks.forEach(oldTask => {
      const match = newTasks.find(nt => nt.id === oldTask.id);
      if (match && match.name !== oldTask.name) {
        renamedMap[oldTask.name] = match.name;
      }
    });

    if (Object.keys(renamedMap).length > 0) {
      const updatedUsers = users.map(u => ({
        ...u,
        protectedTasks: (u.protectedTasks || []).map(tName => renamedMap[tName] || tName)
      }));
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    }

    setTasks(newTasks);
    saveTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-background text-textMain pb-20 font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="bg-surface/90 border-b border-primary/10 sticky top-0 z-10 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary">
              <Sparkles size={24} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-serif font-semibold tracking-wide text-primary">RandomTasks</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-textMuted bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 hidden sm:block">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
            </div>
            <button 
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              title={`Cambiar a estilo ${theme === 'boutique' ? 'Nature 3D' : 'Boutique'}`}
            >
              {theme === 'boutique' ? <Droplet size={20} /> : <Sparkles size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-8">
        {activeTab === 'schedule' && (
          <DailySchedule 
            schedule={todaySchedule} 
            onGenerate={handleGenerate} 
            tasks={tasks}
            users={users}
            pmSharedMode={pmSharedMode}
            onTogglePmSharedMode={handleTogglePmSharedMode}
          />
        )}
        {activeTab === 'users' && (
          <UserList 
            users={users} 
            onUpdate={updateUserList} 
            tasks={tasks}
            history={history}
          />
        )}
        {activeTab === 'tasks' && (
          <TaskList 
            tasks={tasks} 
            onUpdate={updateTaskList} 
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-surface/95 backdrop-blur-md border-t border-primary/10 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === 'schedule' ? 'text-primary' : 'text-textMuted hover:text-textMain'
            }`}
          >
            <Calendar size={24} className={activeTab === 'schedule' ? 'scale-110' : ''} />
            <span className="text-[10px] mt-1 font-medium">Sorteo</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === 'users' ? 'text-primary' : 'text-textMuted hover:text-textMain'
            }`}
          >
            <Users size={24} className={activeTab === 'users' ? 'scale-110' : ''} />
            <span className="text-[10px] mt-1 font-medium">Usuarios</span>
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              activeTab === 'tasks' ? 'text-primary' : 'text-textMuted hover:text-textMain'
            }`}
          >
            <ListTodo size={24} className={activeTab === 'tasks' ? 'scale-110' : ''} />
            <span className="text-[10px] mt-1 font-medium">Tareas</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
