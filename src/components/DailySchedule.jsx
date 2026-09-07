import { useState } from 'react';
import { ChefHat, CalendarCheck, Sun, CheckCircle2, Circle } from 'lucide-react';

const getTaskIcon = (taskName) => {
  if (taskName === 'Cocina') return <ChefHat size={20} />;
  if (taskName === 'Reserva') return <CalendarCheck size={20} />;
  if (taskName === 'Despertar') return <Sun size={20} />;
  return <CheckCircle2 size={20} />;
};

export default function DailySchedule({ schedule, onGenerate, tasks }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onGenerate();
      setIsGenerating(false);
    }, 800); // Fake delay for animation effect
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-br from-surface to-surface/50 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 text-center space-y-4">
          <h2 className="text-2xl font-bold">Tareas de Hoy</h2>
          <p className="text-textMuted text-sm max-w-sm mx-auto">
            {!schedule 
              ? "Aún no se han asignado las tareas para el día de hoy. Presiona el botón para sortear." 
              : "Las tareas han sido asignadas exitosamente."}
          </p>
          <button 
            onClick={handleGenerateClick}
            disabled={isGenerating || schedule}
            className={`
              px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 w-full sm:w-auto
              ${schedule 
                ? 'bg-white/5 text-textMuted cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primaryHover hover:scale-105 active:scale-95 shadow-lg shadow-primary/25'}
            `}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Circle className="animate-spin" size={20} />
                Sorteando...
              </span>
            ) : schedule ? 'Tareas Asignadas' : 'Sortear Tareas'}
          </button>
        </div>
      </div>

      {schedule && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-lg font-semibold px-2">Resultados del Sorteo</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {schedule.displaySchedule.map((assignment, idx) => {
              const taskInfo = tasks.find(t => t.id === assignment.taskId);
              return (
                <div 
                  key={idx} 
                  className="bg-surface p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                      {getTaskIcon(taskInfo?.name)}
                    </div>
                    <h4 className="font-semibold text-lg">{taskInfo?.name}</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {assignment.users.map((user, i) => (
                      <div key={i} className="flex items-center justify-between bg-black/20 p-3 rounded-xl">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-textMuted border border-white/5 capitalize">
                          {user.role.replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
