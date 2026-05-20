"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, X, Check, Flame, Search } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface GrillProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "CORTE" | "PARRILLADA" | "PAPA" | "EMBUTIDO" | "BBQ" | "COMPLEMENTO";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_LABELS = {
  CORTE: "Línea al Carbón (Cortes)",
  PARRILLADA: "Parrilladas (WhatsApp)",
  PAPA: "Papas Rellenas",
  EMBUTIDO: "Embutidos Artesanales",
  BBQ: "Ahumados BBQ",
  COMPLEMENTO: "Complementos",
};

export default function AdminGrillPage() {
  const [products, setProducts] = useState<GrillProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GrillProduct | null>(null);

  // Form fields state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"CORTE" | "PARRILLADA" | "PAPA" | "EMBUTIDO" | "BBQ" | "COMPLEMENTO">("CORTE");
  const [isActive, setIsActive] = useState(true);

  // UI filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("TODOS");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/grill");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Error al cargar los productos de Zona Grill.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al cargar productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategory("CORTE");
    setIsActive(true);
    setError("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: GrillProduct) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setCategory(product.category);
    setIsActive(product.isActive);
    setError("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Open confirmation modal instead of native confirm
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDeletion = async () => {
    if (!pendingDeleteId) return;
    try {
      const res = await fetch(`/api/grill?id=${pendingDeleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== pendingDeleteId));
        setSuccessMsg("Platillo eliminado correctamente.");
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
      name,
      price: Number(price),
      description,
      category,
      isActive,
    };

    try {
      const url = editingProduct ? `/api/grill?id=${editingProduct.id}` : "/api/grill";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar el platillo.");
      }

      setSuccessMsg(editingProduct ? "Platillo actualizado con éxito." : "Platillo creado con éxito.");
      setIsFormOpen(false);
      fetchProducts();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrar platillos por búsqueda y categoría
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "TODOS" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 5; // Compacto para evitar scroll vertical excesivo
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-white flex items-center gap-2">
            <Flame className="w-8 h-8 text-gold-400" />
            Administrar Zona Grill
          </h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">
            Añadir, Editar y Eliminar Especialidades a las Brasas y Complementos (Pedidos por WhatsApp)
          </p>
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Nuevo Platillo
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      {!loading && products.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#111111] p-4 border border-neutral-800 rounded-sm">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar platillo..."
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
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white min-w-[180px]"
            >
              <option value="TODOS">Todas las Categorías</option>
              <option value="CORTE">Línea al Carbón (Cortes)</option>
              <option value="PARRILLADA">Parrilladas (WhatsApp)</option>
              <option value="PAPA">Papas Rellenas</option>
              <option value="EMBUTIDO">Embutidos Artesanales</option>
              <option value="BBQ">Ahumados BBQ</option>
              <option value="COMPLEMENTO">Complementos</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Listing Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
          <span className="text-xs text-neutral-500 tracking-wider uppercase font-semibold">Cargando menú Zona Grill...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-neutral-800 rounded-sm">
          <h3 className="font-serif text-lg text-neutral-300 mb-1">Sin platillos</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            El menú de la Zona Grill está vacío. Registra tu primer platillo o complemento presionando el botón superior.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-neutral-800 rounded-sm">
          <h3 className="font-serif text-lg text-neutral-300 mb-1">Sin resultados</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No se encontraron platillos que coincidan con la búsqueda o el filtro seleccionado.
          </p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-neutral-800 rounded-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-800 bg-black/40 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                <th className="py-4 px-6">Platillo</th>
                <th className="py-4 px-6">Categoría</th>
                <th className="py-4 px-6">Precio (MXN)</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-xs text-neutral-300">
              {currentProducts.map((product) => {
                return (
                  <tr key={product.id} className="hover:bg-neutral-850 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-neutral-100 text-sm">{product.name}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1 max-w-md">{product.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-xs bg-gold-400/5 text-gold-400 border-gold-400/10">
                        {CATEGORY_LABELS[product.category] || product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-serif font-bold text-neutral-200 text-sm">
                      {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(product.price)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border rounded-xs ${
                        product.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }`}>
                        {product.isActive ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-gold-400 border border-transparent hover:border-neutral-700 transition-all rounded-xs"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
                  {Math.min(indexOfLastItem, filteredProducts.length)}
                </span>{" "}
                de <span className="font-semibold text-neutral-300">{filteredProducts.length}</span> platillos
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
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-end font-sans">
          <div className="w-full max-w-2xl bg-[#111111] h-full overflow-y-auto border-l border-neutral-800 p-8 flex flex-col justify-between animate-in slide-in-from-right duration-350">
            <div>
              {/* Form Title */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-6">
                <h2 className="font-serif text-2xl font-semibold text-white">
                  {editingProduct ? "Editar Platillo Zona Grill" : "Nuevo Platillo Zona Grill"}
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
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Nombre del Platillo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Sirloin al Grill"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Precio (MXN)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ej. 220"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Descripción (Incluir Peso / Cantidad / Porciones)</label>
                    <span className="text-[9px] text-gold-400 uppercase tracking-widest">Ej: 300g, 4 porciones, 150g</span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej. Corte jugoso de 300g preparado al carbón con sazón especial de la casa..."
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white resize-none"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Categoría del Menú</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    >
                      <option value="CORTE">Línea al Carbón (Cortes)</option>
                      <option value="PARRILLADA">Parrilladas (WhatsApp)</option>
                      <option value="PAPA">Papas Rellenas</option>
                      <option value="EMBUTIDO">Embutidos Artesanales</option>
                      <option value="BBQ">Ahumados BBQ</option>
                      <option value="COMPLEMENTO">Complementos y Guarniciones</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Disponibilidad en Web</label>
                    <select
                      value={isActive ? "true" : "false"}
                      onChange={(e) => setIsActive(e.target.value === "true")}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    >
                      <option value="true">Activo / Visible</option>
                      <option value="false">Inactivo / Oculto</option>
                    </select>
                  </div>
                </div>

                {/* Form actions */}
                <div className="pt-6 border-t border-neutral-800 flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-gold-400 hover:bg-gold-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all rounded-sm flex items-center justify-center font-bold"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Platillo"
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

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirmar Eliminación"
        message="¿Está seguro de eliminar este platillo del menú Zona Grill? Esta acción no se puede deshacer."
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
    </div>
  );
}
