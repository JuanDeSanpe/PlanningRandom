import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users, Calendar, Settings, Sparkles, ListTodo } from 'lucide-react';
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

  useEffect(() => {
    const data = getInitialData();
    setUsers(data.users);
    setTasks(data.tasks);
    setHistory(data.history);
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const existingToday = data.history.find(h => h.date === todayStr);
    if (existingToday) {
      setTodaySchedule(existingToday);
    }
  }, []);

  const handleGenerate = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newSchedule = generateDailySchedule(users, tasks, history);
    
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
  };

  const updateTaskList = (newTasks) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-background text-textMain pb-20">
      {/* Header */}
      <header className="bg-surface border-b border-white/5 sticky top-0 z-10 backdrop-blur-md bg-surface/80">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-xl text-primary">
              <Sparkles size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">RandomTasks</h1>
          </div>
          <div className="text-sm font-medium text-textMuted bg-white/5 px-3 py-1.5 rounded-full">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
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
          />
        )}
        {activeTab === 'users' && (
          <UserList 
            users={users} 
            onUpdate={updateUserList} 
            tasks={tasks}
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
      <nav className="fixed bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-white/5 pb-safe">
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
