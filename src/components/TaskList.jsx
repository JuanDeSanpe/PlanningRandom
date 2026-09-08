import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { getTaskHue, getTaskBadgeText, TaskIcon } from '../utils/themeColors';

export default function TaskList({ tasks, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('regular'); // 'regular', 'protected', 'cocina'

  // Estado para la edición de categorías/tareas
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('regular');

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
    if (editingTaskId === id) setEditingTaskId(null);
    onUpdate(tasks.filter(t => t.id !== id));
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditName(task.name);
    setEditType(task.type);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const handleSaveEdit = (taskId) => {
    if (!editName.trim()) return;
    onUpdate(tasks.map(t => t.id === taskId ? { ...t, name: editName.trim(), type: editType } : t));
    setEditingTaskId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif text-primary italic">Gestión de Tareas</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingTaskId(null); }}
          className="bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Añadir
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-surface p-6 rounded-[2rem] border-t border-white/5 space-y-5 animate-in fade-in slide-in-from-top-4 card-3d-effect">
          <div>
            <label className="block text-sm font-serif text-primary mb-2">Nombre de la Categoría / Tarea</label>
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
                style={{ '--task-hue': 95 }}
                className={`py-3 px-4 rounded-xl text-left text-sm font-medium transition-all border ${newType === 'regular' ? 'task-pill shadow-sm border-current font-semibold' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
              >
                <div className="font-bold mb-0.5">Regular</div>
                <div className="font-normal text-xs opacity-80">1 Asumidor + 1 No Asumidor</div>
              </button>
              <button
                type="button"
                onClick={() => setNewType('protected')}
                style={{ '--task-hue': (newName || '').toLowerCase().includes('despertar') ? 45 : 38 }}
                className={`py-3 px-4 rounded-xl text-left text-sm font-medium transition-all border ${newType === 'protected' ? 'task-pill shadow-sm border-current font-semibold' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
              >
                <div className="font-bold mb-0.5">
                  {(newName || '').toLowerCase().includes('puesta en marcha') || (newName || '').toLowerCase().includes('mañana') || (newName || '').toLowerCase().includes('pm') || (newName || '').toLowerCase().includes('acompañ')
                    ? 'Protegida (Acompañamiento)'
                    : (newName || '').toLowerCase().includes('despertar')
                    ? 'Protegida VIP (Coordis)'
                    : 'Protegida'}
                </div>
                <div className="font-normal text-xs opacity-80">
                  {(newName || '').toLowerCase().includes('puesta en marcha') || (newName || '').toLowerCase().includes('mañana') || (newName || '').toLowerCase().includes('pm') || (newName || '').toLowerCase().includes('acompañ')
                    ? 'Asumidor rotativo de acompañamiento + Nuevo usuario'
                    : '1 solo usuario VIP con protección (ej. Despertar)'}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setNewType('cocina')}
                style={{ '--task-hue': 18 }}
                className={`py-3 px-4 rounded-xl text-left text-sm font-medium transition-all border ${newType === 'cocina' ? 'task-pill shadow-sm border-current font-semibold' : 'bg-background border-black/5 text-textMuted hover:border-black/10'}`}
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
        {tasks.map(task => {
          const isEditing = editingTaskId === task.id;
          const currentHue = getTaskHue(isEditing ? editName || task.name : task.name, isEditing ? editType : task.type);
          const badgeText = getTaskBadgeText(isEditing ? { name: editName || task.name, type: editType } : task);

          if (isEditing) {
            return (
              <div 
                key={task.id}
                style={{ '--task-hue': currentHue }}
                className="task-card-capsule p-5 rounded-3xl space-y-4 card-3d-effect animate-in fade-in"
              >
                <div className="flex items-center justify-between border-b task-card-divider pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full border task-icon-box">
                      <TaskIcon name={editName || task.name} type={editType} size={18} />
                    </div>
                    <h3 className="font-serif text-lg text-textMain">Modificar Categoría / Tarea</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border task-pill">
                    {badgeText}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-serif text-primary mb-1.5">Nombre de la Categoría / Tarea</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(task.id);
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    className="w-full bg-background border border-black/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 text-textMain text-sm shadow-inner"
                    placeholder="Escribe el nuevo nombre..."
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-primary mb-1.5">Tipo de Tarea</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditType('regular')}
                      style={{ '--task-hue': 95 }}
                      className={`py-2 px-3 rounded-xl text-center text-xs font-medium transition-all border ${editType === 'regular' ? 'task-pill shadow-sm border-current font-semibold' : 'bg-background/80 border-black/5 text-textMuted hover:border-black/10'}`}
                    >
                      Regular
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditType('protected')}
                      style={{ '--task-hue': (editName || task.name || '').toLowerCase().includes('despertar') ? 45 : 38 }}
                      className={`py-2 px-3 rounded-xl text-center text-xs font-medium transition-all border ${editType === 'protected' ? 'task-pill shadow-sm border-current font-semibold' : 'bg-background/80 border-black/5 text-textMuted hover:border-black/10'}`}
                    >
                      {(editName || task.name || '').toLowerCase().includes('despertar')
                        ? 'Protegida VIP (Coordis)'
                        : (editName || task.name || '').toLowerCase().includes('puesta en marcha') || (editName || task.name || '').toLowerCase().includes('mañana') || (editName || task.name || '').toLowerCase().includes('pm') || (editName || task.name || '').toLowerCase().includes('acompañ')
                        ? 'Protegida (Acompañamiento)'
                        : 'Protegida'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditType('cocina')}
                      style={{ '--task-hue': 18 }}
                      className={`py-2 px-3 rounded-xl text-center text-xs font-medium transition-all border ${editType === 'cocina' ? 'task-pill shadow-sm border-current font-semibold' : 'bg-background/80 border-black/5 text-textMuted hover:border-black/10'}`}
                    >
                      Cocina
                    </button>
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
                    onClick={() => handleSaveEdit(task.id)} 
                    className="px-5 py-2 bg-primary text-surface rounded-full text-xs font-medium transition-all btn-3d-effect flex items-center gap-1.5"
                  >
                    <Check size={14} /> Guardar Cambios
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={task.id} 
              style={{ '--task-hue': currentHue }}
              className="task-card-capsule p-4 rounded-3xl flex items-center justify-between group transition-all card-3d-effect"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full border task-icon-box transition-transform group-hover:scale-105">
                  <TaskIcon name={task.name} type={task.type} size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg leading-tight text-textMain">{task.name}</h3>
                  <div className="mt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border task-pill inline-flex items-center">
                      {badgeText}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => startEditing(task)}
                  className="text-textMuted hover:text-primary p-2 rounded-full hover:bg-black/5 transition-all"
                  title="Modificar nombre o tipo de tarea"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="text-textMuted hover:text-primary p-2 rounded-full hover:bg-black/5 transition-all"
                  title="Eliminar tarea"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="text-center p-8 text-textMuted border border-black/10 border-dashed rounded-[2rem]">
            No hay tareas configuradas. Añade tu primera tarea.
          </div>
        )}
      </div>
    </div>
  );
}
