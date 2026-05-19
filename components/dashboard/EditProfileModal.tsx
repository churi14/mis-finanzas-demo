import { useState } from 'react';
import { X, User, Check } from 'lucide-react';

interface EditProfileModalProps {
  currentName: string;
  currentAvatar: string;
  onClose: () => void;
  onSave: (newName: string, newAvatar: string) => void;
}

// Avatares predefinidos (Estilo Notion/Moderno)
const AVATAR_OPTIONS = [
  "https://api.dicebear.com/9.x/micah/svg?seed=Felix",
  "https://api.dicebear.com/9.x/micah/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/micah/svg?seed=Willow",
  "https://api.dicebear.com/9.x/micah/svg?seed=Sorell",
  "https://api.dicebear.com/9.x/micah/svg?seed=Emery",
  "https://api.dicebear.com/9.x/micah/svg?seed=Bear"
];

export default function EditProfileModal({ currentName, currentAvatar, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(currentName);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSave(name, selectedAvatar);
    // El loading se mantiene hasta que el padre cierre el modal o termine
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-xl text-slate-900 tracking-tight">Editar Perfil</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Selección de Avatar */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Elige tu Avatar</label>
            <div className="grid grid-cols-3 gap-3">
               {AVATAR_OPTIONS.map((avatar, index) => (
                 <div 
                    key={index}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative cursor-pointer rounded-full p-1 border-2 transition-all ${selectedAvatar === avatar ? 'border-blue-600 scale-110' : 'border-transparent hover:scale-105'}`}
                 >
                    <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-slate-100" />
                    {selectedAvatar === avatar && (
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
                            <Check size={10} strokeWidth={4} />
                        </div>
                    )}
                 </div>
               ))}
            </div>
          </div>

          {/* Input Nombre */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tu Nombre</label>
             <div className="relative">
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-black transition-all"
                    placeholder="Ej: Julián"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                </div>
             </div>
          </div>

          {/* Botones */}
          <div className="pt-2 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                Cancelar
             </button>
             <button 
                type="submit" 
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-black text-white font-bold shadow-lg hover:bg-slate-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center gap-2"
             >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}