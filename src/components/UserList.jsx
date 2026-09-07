import { useState } from 'react';
import { Plus, Trash2, Shield, User, Power, PowerOff } from 'lucide-react';

export default function UserList({ users, onUpdate, tasks }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('asumidor');
  const [newProtectedTasks, setNewProtectedTasks] = useState([]);

  const protectedTaskOptions = tasks.filter(t => t.type === 'protected' || t.type === 'cocina').map(t => t.name);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newUser = {
      id: Date.now().toString(),
      name: newName.trim(),
      role: newRole,
      protectedTasks: newProtectedTasks,
      active: true
    };

    onUpdate([...users, newUser]);
    setNewName('');
    setNewRole('asumidor');
    setNewProtectedTasks([]);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    onUpdate(users.filter(u => u.id !== id));
  };

  const toggleActive = (id) => {
    onUpdate(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const toggleProtectedTask = (taskName) => {
    setNewProtectedTasks(prev => 
      prev.includes(taskName) 
        ? prev.filter(t => t !== taskName)
        : [...prev, taskName]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Usuarios</h2>
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
            <label className="block text-sm font-medium text-textMuted mb-1.5">Nombre</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
              placeholder="Ej. Juan Pérez"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">Nivel de Experiencia</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNewRole('asumidor')}
                className={`py-2 rounded-xl text-sm font-medium transition-colors border ${newRole === 'asumidor' ? 'bg-primary/20 border-primary text-primary' : 'bg-black/20 border-white/5 text-textMuted hover:border-white/10'}`}
              >
                Asumidor
              </button>
              <button
                type="button"
                onClick={() => setNewRole('no-asumidor')}
                className={`py-2 rounded-xl text-sm font-medium transition-colors border ${newRole === 'no-asumidor' ? 'bg-primary/20 border-primary text-primary' : 'bg-black/20 border-white/5 text-textMuted hover:border-white/10'}`}
              >
                No Asumidor
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">Tareas Protegidas (Opcional)</label>
            <div className="flex flex-wrap gap-2">
              {protectedTaskOptions.map(taskName => (
                <button
                  key={taskName}
                  type="button"
                  onClick={() => toggleProtectedTask(taskName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${newProtectedTasks.includes(taskName) ? 'bg-accent/20 border-accent text-accent' : 'bg-black/20 border-white/5 text-textMuted hover:border-white/10'}`}
                >
                  {taskName}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-primary hover:bg-primaryHover text-white py-2.5 rounded-xl font-medium transition-colors">
              Guardar Usuario
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl font-medium transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {users.map(user => (
          <div key={user.id} className={`bg-surface border border-white/5 p-4 rounded-2xl flex items-center justify-between group transition-all ${user.active ? '' : 'opacity-50 grayscale'}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleActive(user.id)}
                className={`p-2.5 rounded-full transition-colors ${user.active ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                title={user.active ? "Desactivar usuario (Dar de baja)" : "Activar usuario"}
              >
                {user.active ? <Power size={20} /> : <PowerOff size={20} />}
              </button>
              <div>
                <h3 className="font-medium text-base leading-tight">
                  {user.name} {user.active ? '' : <span className="text-xs text-red-400 font-normal ml-2">(De baja)</span>}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${user.role === 'asumidor' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-textMuted'}`}>
                    {user.role.replace('-', ' ')}
                  </span>
                  {user.protectedTasks.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                      <Shield size={10} />
                      {user.protectedTasks.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(user.id)}
              className="text-textMuted hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
              title="Eliminar usuario"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
