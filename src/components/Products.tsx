import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Edit2,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
  Percent,
  Clock,
  Layers,
  Archive,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const CATEGORIES = ['Hamburguesas', 'Pizzas', 'Tacos', 'Bebidas', 'Saludable', 'Acompañamientos'];

const FOOD_PRESETS = [
  { name: 'Hamburguesa Especial', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', category: 'Hamburguesas' },
  { name: 'Hamburguesa Premium', url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80', category: 'Hamburguesas' },
  { name: 'Pizza Pepperoni', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', category: 'Pizzas' },
  { name: 'Pizza Suprema', url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80', category: 'Pizzas' },
  { name: 'Tacos Al Pastor', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', category: 'Tacos' },
  { name: 'Tacos de Birria', url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80', category: 'Tacos' },
  { name: 'Gaseosa Helada', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', category: 'Bebidas' },
  { name: 'Jugo Natural', url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80', category: 'Bebidas' },
  { name: 'Bowl Saludable', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', category: 'Saludable' },
  { name: 'Papas Fritas', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80', category: 'Acompañamientos' }
];

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, duplicateProduct } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // File Upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Hamburguesas',
    price: 0,
    discountPrice: 0,
    available: true,
    quantity: 10,
    estimatedTime: '15-20 min',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        setUploadError('La imagen es muy grande. Máximo 1.5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        setFormData(prev => ({ ...prev, image: base64Str }));
      };
      reader.onerror = () => {
        setUploadError('Error al leer el archivo.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError('');
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        setUploadError('La imagen es muy grande. Máximo 1.5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        setFormData(prev => ({ ...prev, image: base64Str }));
      };
      reader.onerror = () => {
        setUploadError('Error al leer el archivo.');
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'Hamburguesas',
      price: 15000,
      discountPrice: 0,
      available: true,
      quantity: 50,
      estimatedTime: '15-20 min',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      category: prod.category,
      price: prod.price,
      discountPrice: prod.discountPrice || 0,
      available: prod.available,
      quantity: prod.quantity,
      estimatedTime: prod.estimatedTime,
      status: prod.status,
      image: prod.image
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      quantity: Number(formData.quantity)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setIsModalOpen(false);
  };

  const toggleAvailability = (prod: Product) => {
    updateProduct(prod.id, {
      available: !prod.available,
      status: !prod.available ? 'active' : 'inactive'
    });
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            Administrador de Menú & Productos
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Crea, edita y gestiona tus productos</p>
        </div>
        <button
          id="btn-add-product"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/15 transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          Agregar Producto
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121212] border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder-zinc-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              selectedCategory === 'All'
                ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Todos ({products.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                    : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Listings */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
          <Archive className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm">No se encontraron productos que coincidan con la búsqueda.</p>
          <p className="text-xs text-zinc-600 mt-1">Intenta ajustando los filtros o agrega un nuevo producto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={`bg-[#121212] border rounded-2xl overflow-hidden flex flex-col justify-between group transition-all ${
                p.available ? 'border-zinc-800 hover:border-amber-500/30' : 'border-zinc-900 opacity-60'
              }`}
            >
              {/* Product Header / Image */}
              <div className="relative h-44 w-full bg-zinc-950 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                  <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-zinc-800">
                    {p.category}
                  </span>
                  {p.discountPrice && p.discountPrice > 0 ? (
                    <span className="bg-red-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wider self-end">
                      <Percent className="w-3 h-3" /> Oferta
                    </span>
                  ) : null}
                </div>

                {/* Quick toggle availability badge */}
                <button
                  onClick={() => toggleAvailability(p)}
                  className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-zinc-800 rounded-lg p-1.5 hover:bg-black/80 transition-all"
                  title="Cambiar Disponibilidad"
                >
                  {p.available ? (
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4.5 h-4.5 text-red-500" />
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors">{p.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>

                <div className="space-y-2 border-t border-zinc-800/60 pt-3">
                  {/* Prices */}
                  <div className="flex items-baseline gap-2">
                    {p.discountPrice ? (
                      <>
                        <span className="text-base font-bold font-mono text-amber-400">{formatCOP(p.discountPrice)}</span>
                        <span className="text-xs text-zinc-500 font-mono line-through">{formatCOP(p.price)}</span>
                      </>
                    ) : (
                      <span className="text-base font-bold font-mono text-white">{formatCOP(p.price)}</span>
                    )}
                  </div>

                  {/* Badges / Extras */}
                  <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" /> {p.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-zinc-500" /> Stock: {p.quantity} ud
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Actions Footer */}
              <div className="border-t border-zinc-800/80 px-4 py-3 bg-zinc-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-zinc-400 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-all"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateProduct(p.id)}
                    className="p-1.5 text-zinc-400 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-all"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl w-full max-w-xl my-8 overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/40 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">
                {editingProduct ? `Editar Producto: ${editingProduct.name}` : 'Agregar Nuevo Producto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Product name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Hamburguesa Especial de la Casa, Pizza Pepperoni"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>

              {/* Description / Content */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">¿Qué lleva el producto? (Ingredientes / Descripción) *</label>
                <textarea
                  required
                  placeholder="Ej: Pan artesanal, 150g de carne de res premium, queso cheddar fundido, tocineta crujiente, cebolla caramelizada, lechuga, tomate y salsa especial de la casa."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all leading-relaxed"
                />
              </div>

              {/* Image upload sector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">Subir Foto del Producto *</label>
                
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-amber-500 bg-amber-500/5'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {formData.image ? (
                    <div className="relative w-full max-w-[200px] h-28 rounded-lg overflow-hidden border border-zinc-800">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-[10px] text-white font-bold uppercase">Cambiar Imagen</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-900 rounded-full text-zinc-400">
                      <Upload className="w-5 h-5 text-amber-500" />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-300 font-medium">
                      {formData.image ? '¡Foto cargada con éxito!' : 'Arrastra una foto aquí o haz clic para buscar'}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      Soporta formatos JPG, PNG, WEBP (Recomendado máx 1.5MB)
                    </p>
                  </div>
                </div>

                {uploadError && (
                  <p className="text-xs text-red-500 font-mono">{uploadError}</p>
                )}

                {/* Food Presets Quick Library */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">O selecciona una de nuestras fotos de alta calidad:</span>
                  <div className="grid grid-cols-5 gap-2">
                    {FOOD_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: preset.url }));
                          setUploadError('');
                        }}
                        className={`group relative h-12 rounded-lg overflow-hidden border transition-all ${
                          formData.image === preset.url
                            ? 'border-amber-500 ring-1 ring-amber-500'
                            : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                        title={preset.name}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-0.5 justify-center">
                          <span className="text-[7px] text-zinc-300 font-medium truncate max-w-full leading-none">{preset.name.split(' ')[0]}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Image URL fallback */}
                <div className="pt-1">
                  <details className="cursor-pointer text-[10px] text-zinc-500 hover:text-zinc-400 select-none">
                    <summary className="font-medium">¿Quieres usar un enlace web directo en su lugar? Haz clic aquí</summary>
                    <div className="mt-2 space-y-1">
                      <input
                        type="text"
                        placeholder="Pega un enlace de imagen (URL)"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </details>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Categoría *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Delivery estimate */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Tiempo de Preparación (ej: 15-20 min)</label>
                  <input
                    type="text"
                    placeholder="Ej: 20-30 min"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Precio de Venta ($ COP) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">$</span>
                    <input
                      type="number"
                      required
                      placeholder="Ej: 18000"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-8 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Discount price */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Precio con Descuento ($ COP)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">$</span>
                    <input
                      type="number"
                      placeholder="Opcional"
                      value={formData.discountPrice || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: Number(e.target.value) }))}
                      className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 pl-8 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Stock limit */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Cantidad en Inventario *</label>
                  <input
                    type="number"
                    required
                    placeholder="Ej: 100"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  />
                </div>

                {/* Status selection */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Estado del Producto</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  >
                    <option value="active">Activo (Visible en tienda)</option>
                    <option value="inactive">Inactivo (No visible)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-5 border-t border-zinc-800 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black text-xs font-black rounded-xl transition-all shadow-lg shadow-amber-500/15"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
