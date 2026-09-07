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

  const getTypeIcon = (type) => {
    if (type === 'protected') return <Shield size={16} className="text-accent" />;
    if (type === 'cocina') return <ChefHat size={16} className="text-orange-400" />;
    return <ListTodo size={16} className="text-primary" />;
  };

  const getTypeName = (type) => {
    if (type === 'protected') return 'Protegida (1 Persona VIP)';
    if (type === 'cocina') return 'Cocina (Especial)';
    return 'Regular (2 Personas)';
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tareas</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary/20 text-primary hover:bg-primary/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Añadir
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-surface p-5 rounded-2xl border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">Nombre de la Tarea</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
              placeholder="Ej. Sacar la Basura"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">Categoría / Reglas</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setNewType('regular')}
                className={`p-3 text-left rounded-xl text-sm transition-colors border ${newType === 'regular' ? 'bg-primary/20 border-primary' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
              >
                <div className="font-semibold text-primary mb-1">Regular</div>
                <div className="text-xs text-textMuted leading-tight">1 Asumidor + 1 No Asumidor</div>
              </button>
              
              <button
                type="button"
                onClick={() => setNewType('protected')}
                className={`p-3 text-left rounded-xl text-sm transition-colors border ${newType === 'protected' ? 'bg-accent/20 border-accent' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
              >
                <div className="font-semibold text-accent mb-1">Protegida</div>
                <div className="text-xs text-textMuted leading-tight">Solo 1 persona (Usuario VIP)</div>
              </button>
              
              <button
                type="button"
                onClick={() => setNewType('cocina')}
                className={`p-3 text-left rounded-xl text-sm transition-colors border ${newType === 'cocina' ? 'bg-orange-500/20 border-orange-500' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
              >
                <div className="font-semibold text-orange-400 mb-1">Cocina</div>
                <div className="text-xs text-textMuted leading-tight">1 Asu + 1 No-Asu (con prioridad VIP)</div>
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-primary hover:bg-primaryHover text-white py-2.5 rounded-xl font-medium transition-colors">
              Guardar Tarea
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl font-medium transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {tasks.map(task => (
          <div key={task.id} className="bg-surface border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="bg-black/20 p-2.5 rounded-full">
                {getTypeIcon(task.type)}
              </div>
              <div>
                <h3 className="font-medium text-base leading-tight">{task.name}</h3>
                <div className="mt-1 text-xs text-textMuted">
                  {getTypeName(task.type)}
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(task.id)}
              className="text-textMuted hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center p-8 text-textMuted border border-white/5 border-dashed rounded-2xl">
            No hay tareas configuradas. Añade tu primera tarea.
          </div>
        )}
      </div>
    </div>
  );
}
