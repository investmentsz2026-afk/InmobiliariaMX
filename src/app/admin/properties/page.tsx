"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Upload, X, Check, Star, Search } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { parseDescription, serializeDescription } from "@/lib/utils";

interface PropertyImage {
  id?: string;
  url: string;
  isMain: boolean;
}

interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  m2Total: number;
  m2Covered: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  type: "CASA" | "TERRENO" | "DEPARTAMENTO" | "PROYECTO";
  status: "DISPONIBLE" | "RESERVADO" | "VENDIDO";
  featured: boolean;
  images: PropertyImage[];
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // UI filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("TODOS");

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form fields state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [m2Total, setM2Total] = useState("");
  const [m2Covered, setM2Covered] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState("");
  const [type, setType] = useState<"CASA" | "TERRENO" | "DEPARTAMENTO" | "PROYECTO">("CASA");
  const [status, setStatus] = useState<"DISPONIBLE" | "RESERVADO" | "VENDIDO">("DISPONIBLE");
  const [featured, setFeatured] = useState(false);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  


  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProperty) {
      setSlug(slugify(val));
    }
  };

  const handleOpenCreate = () => {
    setEditingProperty(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setPrice("");
    setLocation("");
    setCity("");
    setState("");
    setM2Total("");
    setM2Covered("");
    setBedrooms("");
    setBathrooms("");
    setParkingSpaces("");
    setType("CASA");
    setStatus("DISPONIBLE");
    setFeatured(false);
    setPropertyImages([]);
    setError("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setTitle(prop.title);
    setSlug(prop.slug);
    
    // Parse description and quality prices
    const parsed = parseDescription(prop.description);
    setDescription(parsed.text);

    setPrice(prop.price.toString());
    setLocation(prop.location);
    setCity(prop.city);
    setState(prop.state);
    setM2Total(prop.m2Total.toString());
    setM2Covered(prop.m2Covered?.toString() || "");
    setBedrooms(prop.bedrooms?.toString() || "");
    setBathrooms(prop.bathrooms?.toString() || "");
    setParkingSpaces(prop.parkingSpaces?.toString() || "");
    setType(prop.type);
    setStatus(prop.status);
    setFeatured(prop.featured);
    setPropertyImages(prop.images.map(img => ({ url: img.url, isMain: img.isMain })));
    setError("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError("");

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Fallo en la carga de imagen");
      }

      const data = await res.json();
      const newImages = data.urls.map((url: string, index: number) => ({
        url,
        isMain: propertyImages.length === 0 && index === 0,
      }));

      setPropertyImages(prev => [...prev, ...newImages]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al subir una o más imágenes.");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setPropertyImages(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      // If we removed the main image, make the first of the remaining main
      if (filtered.length > 0 && !filtered.some(img => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  const setMainImage = (index: number) => {
    setPropertyImages(prev =>
      prev.map((img, i) => ({
        ...img,
        isMain: i === index,
      }))
    );
  };

  const handleDelete = async (id: string) => {
    // Open confirmation modal instead of native confirm
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDeletion = async () => {
    if (!pendingDeleteId) return;
    try {
      const res = await fetch(`/api/properties/${pendingDeleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== pendingDeleteId));
        setSuccessMsg("Producto eliminado correctamente.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Error al eliminar.");
        setTimeout(() => setError(""), 4000);
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const body = {
      title,
      slug,
      description,
      price,
      location,
      city,
      state,
      m2Total,
      m2Covered: m2Covered || null,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      parkingSpaces: parkingSpaces || null,
      type,
      status,
      featured,
      images: propertyImages,
    };

    try {
      const url = editingProperty ? `/api/properties/${editingProperty.id}` : "/api/properties";
      const method = editingProperty ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar la propiedad.");
      }

      setSuccessMsg(editingProperty ? "Producto actualizado con éxito." : "Producto creado con éxito.");
      setIsFormOpen(false);
      fetchProperties();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrar productos por búsqueda y categoría
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "TODOS" || prop.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const itemsPerPage = 5; // Compacto para evitar scroll vertical excesivo
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-white">Administrar Catálogo de Carnes</h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Crear, Editar y Eliminar Productos</p>
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      {!loading && properties.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#111111] p-4 border border-neutral-800 rounded-sm">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 pl-9 pr-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white placeholder-neutral-500"
            />
            <Search className="absolute left-3 top-3 text-neutral-500 w-4 h-4" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold hidden sm:inline">Categoría:</label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white min-w-[180px]"
            >
              <option value="TODOS">Todas las Categorías</option>
              <option value="CASA">Cortes de Res (Carne Fría)</option>
              <option value="TERRENO">Paquetes</option>
              <option value="DEPARTAMENTO">Embutidos</option>
              <option value="PROYECTO">Zona Grill</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Listing Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
          <span className="text-xs text-neutral-500 tracking-wider uppercase font-semibold">Cargando productos...</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-neutral-800 rounded-sm">
          <h3 className="font-serif text-lg text-neutral-300 mb-1">Sin productos</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            El catálogo de cortes se encuentra vacío. Registra tu primer producto presionando el botón superior.
          </p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-neutral-800 rounded-sm">
          <h3 className="font-serif text-lg text-neutral-300 mb-1">Sin resultados</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No se encontraron productos que coincidan con la búsqueda o el filtro seleccionado.
          </p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-neutral-800 rounded-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-800 bg-black/40 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                <th className="py-4 px-6">Producto</th>
                <th className="py-4 px-6">Categoría</th>
                <th className="py-4 px-6">Precio (MXN)</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-center">Destacado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-xs text-neutral-300">
              {currentProperties.map((prop) => {
                const mainImg = prop.images.find(img => img.isMain)?.url || prop.images[0]?.url || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80";
                return (
                  <tr key={prop.id} className="hover:bg-neutral-850 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img src={mainImg} alt={prop.title} className="w-12 h-9 object-cover rounded-xs border border-neutral-800" />
                      <div>
                        <p className="font-semibold text-neutral-100">{prop.title}</p>
                        <p className="text-[10px] text-neutral-500">{prop.city}, {prop.state}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 uppercase tracking-wider font-semibold text-[10px]">
                      {{ CASA: "Cortes de Res", TERRENO: "Paquetes", DEPARTAMENTO: "Embutidos", PROYECTO: "Zona Grill" }[prop.type] || prop.type}
                    </td>
                    <td className="py-4 px-6 font-serif font-bold text-neutral-200">
                      {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(prop.price)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border rounded-xs ${
                        prop.status === "DISPONIBLE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : prop.status === "RESERVADO"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {prop.featured ? (
                        <Star className="w-4 h-4 text-gold-400 fill-gold-400 mx-auto" />
                      ) : (
                        <span className="text-neutral-600">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(prop)}
                          className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-gold-400 border border-transparent hover:border-neutral-700 transition-all rounded-xs"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="p-1.5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 border border-transparent hover:border-neutral-700 transition-all rounded-xs"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Controles de Paginación */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-neutral-800 bg-black/20 text-xs gap-4">
              <span className="text-neutral-500">
                Mostrando <span className="font-semibold text-neutral-300">{indexOfFirstItem + 1}</span> a{" "}
                <span className="font-semibold text-neutral-300">
                  {Math.min(indexOfLastItem, filteredProperties.length)}
                </span>{" "}
                de <span className="font-semibold text-neutral-300">{filteredProperties.length}</span> productos
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-neutral-850 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none rounded-sm transition-all uppercase tracking-widest font-semibold text-[10px]"
                >
                  Anterior
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-sm transition-all font-serif font-bold text-xs ${
                      currentPage === page
                        ? "bg-gold-400 text-obsidian"
                        : "border border-neutral-850 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-neutral-850 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none rounded-sm transition-all uppercase tracking-widest font-semibold text-[10px]"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide / Pop Form overlay */}
<ConfirmModal
  isOpen={isConfirmOpen}
  title="Confirmar Eliminación"
  message="¿Está seguro de eliminar este producto? Esta acción no se puede deshacer."
  variant="danger"
  onConfirm={confirmDeletion}
  onCancel={() => { setIsConfirmOpen(false); setPendingDeleteId(null); }}
  confirmLabel="Eliminar"
  cancelLabel="Cancelar"
/>

      {/* Floating Toast Notification */}
      {successMsg && (
        <div className="fixed bottom-5 right-5 z-[999] bg-[#111111] border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="p-1 rounded-full bg-emerald-500/10">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider">{successMsg}</span>
        </div>
      )}
      {error && !isFormOpen && (
        <div className="fixed bottom-5 right-5 z-[999] bg-[#111111] border border-red-500/30 text-red-400 px-4 py-3 rounded-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="p-1 rounded-full bg-red-500/10">
            <X className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider">{error}</span>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-end font-sans">
          <div className="w-full max-w-3xl bg-[#111111] h-full overflow-y-auto border-l border-neutral-800 p-8 flex flex-col justify-between animate-in slide-in-from-right duration-350">
            <div>
              {/* Form Title */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-6">
                <h2 className="font-serif text-2xl font-semibold text-white">
                  {editingProperty ? "Editar Producto" : "Nuevo Producto"}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-neutral-500 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Nombre del Producto / Corte</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Ej. Ribeye Sonora Premium"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Slug URL (Autogenerado)</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      placeholder="ej-ribeye-sonora-premium"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Descripción del Producto / Sugerencias de Preparación</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalles sobre el origen del corte, sugerencias de preparación, término recomendado, marinado..."
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white resize-none"
                  />
                </div>

                {/* Price, Type, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Precio (MXN)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ej. 3500000"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Categoría del Producto</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    >
                      <option value="CASA">Cortes de Res (Carne Fría)</option>
                      <option value="TERRENO">Paquetes y Parrilladas</option>
                      <option value="DEPARTAMENTO">Embutidos Artesanales</option>
                      <option value="PROYECTO">Especialidades Grill</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Disponibilidad</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    >
                      <option value="DISPONIBLE">Disponible</option>
                      <option value="RESERVADO">Agotado</option>
                      <option value="VENDIDO">Agotado</option>
                    </select>
                  </div>
                </div>

                {/* Location Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-1">
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Origen / Zona</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ej. Sonora / Importación"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Ciudad Origen</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ej. Hermosillo"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Estado Origen</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Ej. Sonora"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>
                </div>

                {/* Dimensions and Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Peso (gramos)</label>
                    <input
                      type="number"
                      required
                      value={m2Total}
                      onChange={(e) => setM2Total(e.target.value)}
                      placeholder="Ej. 400"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Grosor (Pulgadas)</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      placeholder="Ej. 1.5"
                      step="0.1"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Calidad</label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    >
                      <option value="">Sin especificar</option>
                      <option value="1">U.S. Choice</option>
                      <option value="2">U.S. Prime</option>
                      <option value="3">Wagyu / A5</option>
                      <option value="4">Sonora Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Porciones (Personas)</label>
                    <input
                      type="number"
                      value={parkingSpaces}
                      onChange={(e) => setParkingSpaces(e.target.value)}
                      placeholder="Ej. 2"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>
                </div>



                {/* Featured Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-gold-400 border border-neutral-700 bg-neutral-900 rounded-xs"
                  />
                  <label htmlFor="featured" className="text-xs text-neutral-300 font-semibold select-none cursor-pointer uppercase tracking-wider">
                    Destacar este producto en el Inicio
                  </label>
                </div>

                {/* Image upload box */}
                <div className="space-y-4">
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Imágenes del Producto</label>
                  
                  <div className="border-2 border-dashed border-neutral-800 hover:border-gold-400/25 p-6 text-center transition-colors rounded-sm relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <span className="block text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                      {uploadingImages ? "Subiendo archivos..." : "Seleccionar Archivos"}
                    </span>
                    <span className="text-[10px] text-neutral-600 block mt-1">Soporta PNG, JPG, JPEG</span>
                  </div>

                  {/* Thumbnail manager */}
                  {propertyImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                      {propertyImages.map((img, index) => (
                        <div key={index} className="relative aspect-[4/3] border border-neutral-800 rounded-xs overflow-hidden group">
                          <img src={img.url} alt="subida" className="w-full h-full object-cover" />
                          
                          {/* Overlay tools */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setMainImage(index)}
                              className={`p-1.5 rounded-xs transition-colors ${
                                img.isMain ? "bg-gold-400 text-obsidian" : "bg-neutral-800 text-neutral-400 hover:text-white"
                              }`}
                              title={img.isMain ? "Imagen principal" : "Definir como principal"}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-1.5 bg-neutral-850 hover:bg-red-500/25 text-neutral-400 hover:text-red-400 rounded-xs transition-colors"
                              title="Remover"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Main badge */}
                          {img.isMain && (
                            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-gold-400 text-obsidian text-[7px] font-bold uppercase tracking-wider rounded-2xs">
                              Principal
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form actions */}
                <div className="pt-6 border-t border-neutral-800 flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting || uploadingImages}
                    className="flex-1 py-3.5 bg-gold-400 hover:bg-gold-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all rounded-sm flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Producto"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-3.5 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold tracking-widest uppercase transition-colors rounded-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
