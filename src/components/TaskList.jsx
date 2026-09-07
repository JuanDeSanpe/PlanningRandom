import { useState } from 'react';
import { Plus, Trash2, ListTodo, Shield, ChefHat } from 'lucide-react';

export default function TaskList({ tasks, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('regular'); // 'regular', 'protected', 'cocina'

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      name: newName.trim(),
      type: newType
    };

    onUpdate([...tasks, newTask]);
    setNewName('');
    setNewType('regular');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    onUpdate(tasks.filter(t => t.id !== id));
  };

  const getIconForType = (type) => {
    if (type === 'protected') return <Shield size={16} />;
    if (type === 'cocina') return <ChefHat size={16} />;
    return <ListTodo size={16} />;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-primary italic">Gestión de Tareas</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Añadir
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-surface p-6 rounded-[2rem] border-t border-white/5 space-y-5 animate-in fade-in slide-in-from-top-4 card-3d-effect">
          <div>
            <label className="block text-sm font-serif text-primary mb-2">Nombre de la Tarea</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-background border border-black/5 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-textMain"
              placeholder="Ej. Recoger Cocina"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-serif text-primary mb-2">Tipo de Tarea</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setNewType('regular')}
                className={`py-3 px-4 rounded-xl text-left text-sm font-medium transition-all border ${newType === 'regular' ? 'bg-primary/10 border-primary/30 text-primary shadow-sm' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
              >
                <div className="font-bold mb-0.5">Regular</div>
                <div className="font-normal text-xs opacity-80">1 Asumidor + 1 No Asumidor</div>
              </button>
              <button
                type="button"
                onClick={() => setNewType('protected')}
                className={`py-3 px-4 rounded-xl text-left text-sm font-medium transition-all border ${newType === 'protected' ? 'bg-accent/10 border-accent/30 text-accent shadow-sm' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
              >
                <div className="font-bold mb-0.5">Protegida</div>
                <div className="font-normal text-xs opacity-80">1 solo usuario VIP con protección</div>
              </button>
              <button
                type="button"
                onClick={() => setNewType('cocina')}
                className={`py-3 px-4 rounded-xl text-left text-sm font-medium transition-all border ${newType === 'cocina' ? 'bg-amber-600/10 border-amber-600/30 text-amber-700 shadow-sm' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
              >
                <div className="font-bold mb-0.5">Cocina</div>
                <div className="font-normal text-xs opacity-80">Prioridad Asumidor VIP Cocina + 1 No Asumidor</div>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-primary text-surface py-3 rounded-full font-medium transition-all btn-3d-effect">
              Guardar Tarea
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 bg-black/5 hover:bg-black/10 text-textMain py-3 rounded-full font-medium transition-all">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-surface border-t border-white/5 p-4 rounded-3xl flex items-center justify-between group transition-all card-3d-effect">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                task.type === 'protected' ? 'bg-accent/10 text-accent' : 
                task.type === 'cocina' ? 'bg-amber-600/10 text-amber-700' : 
                'bg-primary/5 text-primary'
              }`}>
                {getIconForType(task.type)}
              </div>
              <div>
                <h3 className="font-serif text-lg leading-tight text-textMain">{task.name}</h3>
                <div className="mt-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                    task.type === 'protected' ? 'bg-accent/10 text-accent border-accent/20' : 
                    task.type === 'cocina' ? 'bg-amber-600/10 text-amber-700 border-amber-600/20' : 
                    'bg-black/5 text-textMuted border-black/5'
                  }`}>
                    {task.type === 'protected' ? 'PROTEGIDA (VIP)' : task.type === 'cocina' ? 'COCINA' : 'REGULAR'}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(task.id)}
              className="text-textMuted hover:text-primary p-2 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
              title="Eliminar tarea"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center p-8 text-textMuted border border-black/10 border-dashed rounded-[2rem]">
            No hay tareas configuradas. Añade tu primera tarea.
          </div>
        )}
      </div>
    </div>
  );
}
