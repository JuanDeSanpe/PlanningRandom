import { useState } from 'react';
import { Plus, Trash2, Shield, Power, PowerOff, Pencil, Check, X } from 'lucide-react';
import { getTaskHue } from '../utils/themeColors';

export default function UserList({ users, onUpdate, tasks }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('asumidor');
  const [newProtectedTasks, setNewProtectedTasks] = useState([]);

  // Estado para la edición de usuarios
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('asumidor');
  const [editProtectedTasks, setEditProtectedTasks] = useState([]);

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
    if (editingUserId === id) setEditingUserId(null);
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

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditRole(user.role);
    setEditProtectedTasks([...(user.protectedTasks || [])]);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
  };

  const handleSaveEdit = (userId) => {
    if (!editName.trim()) return;
    onUpdate(users.map(u => u.id === userId ? {
      ...u,
      name: editName.trim(),
      role: editRole,
      protectedTasks: editProtectedTasks
    } : u));
    setEditingUserId(null);
  };

  const toggleEditProtectedTask = (taskName) => {
    setEditProtectedTasks(prev => 
      prev.includes(taskName) 
        ? prev.filter(t => t !== taskName)
        : [...prev, taskName]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-primary italic">Usuarios</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingUserId(null); }}
          className="bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Añadir
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-surface p-6 rounded-[2rem] border-t border-white/5 space-y-5 animate-in fade-in slide-in-from-top-4 card-3d-effect">
          <div>
            <label className="block text-sm font-serif text-primary mb-2">Nombre del Usuario</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-background border border-black/5 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-textMain"
              placeholder="Ej. Juan Pérez"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-serif text-primary mb-2">Nivel de Experiencia</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewRole('asumidor')}
                className={`py-3 rounded-xl text-sm font-medium transition-all border ${newRole === 'asumidor' ? 'role-asumidor font-semibold shadow-sm border-current' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
              >
                Asumidor (Azul)
              </button>
              <button
                type="button"
                onClick={() => setNewRole('no-asumidor')}
                className={`py-3 rounded-xl text-sm font-medium transition-all border ${newRole === 'no-asumidor' ? 'role-noasumidor font-semibold shadow-sm border-current' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
              >
                No Asumidor (Rosado)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-serif text-primary mb-2">Tareas Protegidas (Opcional)</label>
            <div className="flex flex-wrap gap-2">
              {protectedTaskOptions.map(taskName => {
                const isSelected = newProtectedTasks.includes(taskName);
                const hue = getTaskHue(taskName);
                return (
                  <button
                    key={taskName}
                    type="button"
                    onClick={() => toggleProtectedTask(taskName)}
                    style={{ '--task-hue': hue }}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${isSelected ? 'task-pill font-semibold shadow-sm border-current' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
                  >
                    {taskName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-primary text-surface py-3 rounded-full font-medium transition-all btn-3d-effect">
              Guardar Usuario
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 bg-black/5 hover:bg-black/10 text-textMain py-3 rounded-full font-medium transition-all">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {users.map(user => {
          const isEditing = editingUserId === user.id;

          if (isEditing) {
            return (
              <div 
                key={user.id} 
                className="bg-surface p-6 rounded-[2rem] border-t border-white/5 space-y-4 animate-in fade-in card-3d-effect"
              >
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <h3 className="font-serif text-lg text-primary">Modificar Usuario</h3>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${editRole === 'asumidor' ? 'role-asumidor' : 'role-noasumidor'}`}>
                    {editRole.replace('-', ' ')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-serif text-primary mb-1.5">Nombre del Usuario</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(user.id);
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    className="w-full bg-background border border-black/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 text-textMain text-sm shadow-inner"
                    placeholder="Escribe el nombre del usuario..."
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-primary mb-1.5">Nivel de Experiencia</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditRole('asumidor')}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-all border ${editRole === 'asumidor' ? 'role-asumidor font-semibold shadow-sm border-current' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
                    >
                      Asumidor (Azul)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditRole('no-asumidor')}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-all border ${editRole === 'no-asumidor' ? 'role-noasumidor font-semibold shadow-sm border-current' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
                    >
                      No Asumidor (Rosado)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-serif text-primary mb-1.5">Tareas Protegidas (Opcional)</label>
                  <div className="flex flex-wrap gap-2">
                    {protectedTaskOptions.map(taskName => {
                      const isSelected = editProtectedTasks.includes(taskName);
                      const hue = getTaskHue(taskName);
                      return (
                        <button
                          key={taskName}
                          type="button"
                          onClick={() => toggleEditProtectedTask(taskName)}
                          style={{ '--task-hue': hue }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isSelected ? 'task-pill font-semibold shadow-sm border-current' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
                        >
                          {taskName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <button 
                    type="button" 
                    onClick={cancelEditing} 
                    className="px-4 py-2 bg-black/5 hover:bg-black/10 text-textMuted rounded-full text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    <X size={14} /> Cancelar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleSaveEdit(user.id)} 
                    className="px-5 py-2 bg-primary text-surface rounded-full text-xs font-medium transition-all btn-3d-effect flex items-center gap-1.5"
                  >
                    <Check size={14} /> Guardar Cambios
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={user.id} className={`bg-surface border-t border-white/5 p-4 rounded-3xl flex items-center justify-between group transition-all card-3d-effect ${user.active ? '' : 'opacity-60 grayscale'}`}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleActive(user.id)}
                  className={`p-2.5 rounded-full transition-colors ${user.active ? 'bg-primary/5 text-primary hover:bg-primary/10' : 'bg-black/5 text-textMuted hover:bg-black/10'}`}
                  title={user.active ? "Desactivar usuario (Dar de baja)" : "Activar usuario"}
                >
                  {user.active ? <Power size={20} /> : <PowerOff size={20} />}
                </button>
                <div>
                  <h3 className="font-serif text-lg leading-tight text-textMain">
                    {user.name} {user.active ? '' : <span className="text-xs text-textMuted font-sans italic ml-2">(De baja)</span>}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${user.role === 'asumidor' ? 'role-asumidor' : 'role-noasumidor'}`}>
                      {user.role.replace('-', ' ')}
                    </span>
                    {user.protectedTasks.length > 0 && (
                      user.protectedTasks.map(taskName => (
                        <span 
                          key={taskName}
                          style={{ '--task-hue': getTaskHue(taskName) }}
                          className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border task-pill"
                        >
                          <Shield size={10} />
                          {taskName}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => startEditing(user)}
                  className="text-textMuted hover:text-primary p-2 rounded-full hover:bg-black/5 transition-all"
                  title="Modificar usuario"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(user.id)}
                  className="text-textMuted hover:text-primary p-2 rounded-full hover:bg-black/5 transition-all"
                  title="Eliminar usuario"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
