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
      <div className="bg-surface p-8 rounded-[2rem] border-t border-white/5 relative overflow-hidden card-3d-effect">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10 text-center space-y-4">
          <h2 className="text-3xl font-serif text-primary mb-2 italic">Tareas de Hoy</h2>
          <p className="text-textMuted text-sm max-w-sm mx-auto font-light leading-relaxed">
            {!schedule 
              ? "Aún no se han asignado las tareas para el día de hoy. Presiona el botón para sortear." 
              : "Las tareas han sido asignadas exitosamente. ¡A por todas!"}
          </p>
          <button 
            onClick={handleGenerateClick}
            disabled={isGenerating || schedule}
            className={`
              px-8 py-3.5 rounded-full font-medium text-base tracking-wide transition-all duration-300 w-full sm:w-auto btn-3d-effect
              ${schedule 
                ? 'bg-black/5 text-textMuted cursor-not-allowed border border-black/5' 
                : 'bg-primary text-surface hover:bg-primaryHover'}
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mt-8 mb-6">
            <span className="uppercase tracking-widest text-xs font-semibold text-textMuted">— Resultados —</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {schedule.displaySchedule.map((assignment, idx) => {
              const taskInfo = tasks.find(t => t.id === assignment.taskId);
              return (
                <div 
                  key={idx} 
                  className="bg-surface p-6 rounded-3xl border-t border-white/5 hover:border-primary/20 hover:shadow-md transition-all duration-500 card-3d-effect"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-black/5">
                    <div className="bg-primary/5 text-primary p-2.5 rounded-full">
                      {getTaskIcon(taskInfo?.name)}
                    </div>
                    <h4 className="font-serif text-lg text-primary">{taskInfo?.name}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {assignment.users.map((user, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <span className="font-medium text-textMain">{user.name}</span>
                        <span className="text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full bg-black/5 text-textMuted">
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
