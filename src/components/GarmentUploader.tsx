import React, { useState, useRef } from 'react';
import { Garment, GarmentCategory, OutfitLayer } from '../types';
import { Shirt, Footprints, Sparkles, Plus, Upload, Check, Search, Trash2 } from 'lucide-react';

interface GarmentUploaderProps {
  garments: Garment[];
  equippedLayers: OutfitLayer[];
  onToggleGarment: (garment: Garment) => void;
  onAddCustomGarment: (garment: Garment) => void;
  onDeleteCustomGarment: (garmentId: string) => void;
}

// Category configuration
const CATEGORIES: {
  id: GarmentCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}[] = [
  { id: 'superior', label: 'Superior', icon: Shirt, badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'inferior', label: 'Inferior', icon: () => <span className="text-xs font-bold">👖</span>, badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'calzado', label: 'Calzado', icon: Footprints, badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'accesorios', label: 'Accesorios', icon: Sparkles, badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export const GarmentUploader: React.FC<GarmentUploaderProps> = ({
  garments,
  equippedLayers,
  onToggleGarment,
  onAddCustomGarment,
  onDeleteCustomGarment,
}) => {
  const [activeTab, setActiveTab] = useState<GarmentCategory>('superior');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [customName, setCustomName] = useState('');
  const [isUploadingModal, setIsUploadingModal] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter garments by tab & search query
  const filteredGarments = garments.filter((g) => {
    const matchesCategory = g.category === activeTab;
    const matchesSearch = searchQuery.trim() === '' ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.brand && g.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const isEquipped = (garmentId: string) => {
    return equippedLayers.some((layer) => layer.garment.id === garmentId);
  };

  const handleFileProcess = (file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setPendingImageUrl(url);
          setCustomName(file.name.replace(/\.[^/.]+$/, ''));
          setIsUploadingModal(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleSaveCustomGarment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingImageUrl) return;

    const newGarment: Garment = {
      id: `custom-garment-${Date.now()}`,
      name: customName.trim() || `Prenda ${activeTab}`,
      category: activeTab,
      imageUrl: pendingImageUrl,
      thumbnailUrl: pendingImageUrl,
      color: '#3B82F6',
      brand: 'Mi Armario',
      price: 0,
      description: 'Prenda personalizada importada por el usuario',
      isCustom: true,
      defaultScale: 1.0,
      defaultPosition: { x: 0, y: activeTab === 'superior' ? 18 : activeTab === 'inferior' ? 55 : activeTab === 'calzado' ? 88 : 15 },
    };

    onAddCustomGarment(newGarment);
    onToggleGarment(newGarment); // auto-equip
    setIsUploadingModal(false);
    setPendingImageUrl(null);
    setCustomName('');
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-zinc-700" />
          <h3 className="text-sm font-bold tracking-tight text-zinc-900">
            2. Cargador de Prendas
          </h3>
        </div>
        <span className="text-[11px] text-zinc-500">
          {filteredGarments.length} disponibles
        </span>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100/80 rounded-xl border border-zinc-200/80">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          const equippedInCat = equippedLayers.filter((l) => l.garment.category === cat.id).length;

          return (
            <button
              key={cat.id}
              id={`tab-category-${cat.id}`}
              onClick={() => setActiveTab(cat.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/60'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/40'
              }`}
            >
              <div className="flex items-center gap-1">
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{cat.label}</span>
              </div>
              {equippedInCat > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                  {equippedInCat}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Upload Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={`Buscar en ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
          />
        </div>
        <button
          id="btn-upload-garment"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200 rounded-lg transition-colors shrink-0"
          title={`Subir prenda a categoría ${activeTab}`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Subir</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileProcess(file);
          }}
        />
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border border-dashed rounded-xl p-2.5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-zinc-900 bg-zinc-900/5'
            : 'border-zinc-200/90 bg-zinc-50/40 hover:bg-zinc-100/50 hover:border-zinc-300'
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-zinc-500">
          <Upload className="w-3.5 h-3.5 text-zinc-500" />
          <p className="text-[11px] font-medium text-zinc-600">
            Arrastra tu prenda <span className="font-semibold text-zinc-900">({activeTab})</span> PNG sin fondo o JPG
          </p>
        </div>
      </div>

      {/* Garments Grid */}
      <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
        {filteredGarments.map((garment) => {
          const equipped = isEquipped(garment.id);

          return (
            <div
              key={garment.id}
              id={`garment-card-${garment.id}`}
              onClick={() => onToggleGarment(garment)}
              className={`group relative rounded-xl border p-2 text-left cursor-pointer transition-all duration-200 ${
                equipped
                  ? 'border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900/20 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xs'
              }`}
            >
              {/* Image thumbnail container */}
              <div className="aspect-square rounded-lg overflow-hidden bg-zinc-50 border border-zinc-100 relative mb-2 flex items-center justify-center p-1">
                <img
                  src={garment.thumbnailUrl || garment.imageUrl}
                  alt={garment.name}
                  className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Equipped Badge */}
                {equipped && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {/* Custom Garment delete button */}
                {garment.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomGarment(garment.id);
                    }}
                    className="absolute top-1.5 left-1.5 p-1 rounded-md bg-white/90 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors shadow-xs"
                    title="Eliminar prenda personalizada"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* Color preview dot */}
                <div
                  className="absolute bottom-1.5 left-1.5 w-3 h-3 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: garment.color }}
                  title={`Color: ${garment.color}`}
                />
              </div>

              {/* Garment Details */}
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate">
                  {garment.brand || 'Atelier'}
                </p>
                <h4 className="text-xs font-semibold text-zinc-900 leading-tight line-clamp-1">
                  {garment.name}
                </h4>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-700">
                    {garment.price ? `$${garment.price.toFixed(0)}` : 'Custom'}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors ${
                      equipped
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200'
                    }`}
                  >
                    {equipped ? 'Equipada' : 'Equipar'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredGarments.length === 0 && (
          <div className="col-span-2 py-8 text-center text-zinc-400">
            <Shirt className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
            <p className="text-xs font-medium text-zinc-600">
              No hay prendas en esta sección
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Arrastra una imagen para agregar tu propia prenda
            </p>
          </div>
        )}
      </div>

      {/* Modal for naming uploaded custom garment */}
      {isUploadingModal && pendingImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-zinc-900 mb-3">
              Guardar Prenda Personalizada ({activeTab})
            </h3>
            <div className="aspect-square w-32 mx-auto rounded-xl overflow-hidden border border-zinc-200 mb-3 bg-zinc-50">
              <img src={pendingImageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <form onSubmit={handleSaveCustomGarment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Nombre de la prenda
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ej. Cazadora denim oversize"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadingModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-sm"
                >
                  Guardar y Equipar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
