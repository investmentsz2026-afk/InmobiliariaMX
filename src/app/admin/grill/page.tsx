"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, X, Check, Flame, Search, Upload, Film, BookOpen, Image as ImageIcon, Eye, Gift, Star } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface GrillProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomCategory {
  id: string;
  name: string;
  target: string;
}

export default function AdminGrillPage() {
  const [products, setProducts] = useState<GrillProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Category management state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [catError, setCatError] = useState("");

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GrillProduct | null>(null);

  // Form fields state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // UI filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("TODOS");

  // Grill Content Modal State
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentTab, setContentTab] = useState<"video" | "about" | "carousel" | "testimonials">("video");
  const [loadingContent, setLoadingContent] = useState(false);
  const [savingContent, setSavingContent] = useState(false);

  // Video Section Fields
  const [videoTag, setVideoTag] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPosterUrl, setVideoPosterUrl] = useState("");
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // About Section Fields
  const [aboutTag, setAboutTag] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutParagraph1, setAboutParagraph1] = useState("");
  const [aboutParagraph2, setAboutParagraph2] = useState("");
  const [aboutStat1Value, setAboutStat1Value] = useState("");
  const [aboutStat1Label, setAboutStat1Label] = useState("");
  const [aboutStat2Value, setAboutStat2Value] = useState("");
  const [aboutStat2Label, setAboutStat2Label] = useState("");
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);

  // Carousel Section Fields
  const [carouselSlides, setCarouselSlides] = useState<any[]>([]);
  const [isSlideFormOpen, setIsSlideFormOpen] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  
  // Slide Editor Fields
  const [slideTag, setSlideTag] = useState("");
  const [slideTitle, setSlideTitle] = useState("");
  const [slideSubtitle, setSlideSubtitle] = useState("");
  const [slideDescription, setSlideDescription] = useState("");
  const [slideImage, setSlideImage] = useState("");
  const [uploadingSlideImage, setUploadingSlideImage] = useState(false);

  // Promotions Fields
  const [promotions, setPromotions] = useState<Array<{
    tag: string;
    value: string;
    title: string;
    description: string;
  }>>([
    { tag: "", value: "", title: "", description: "" },
    { tag: "", value: "", title: "", description: "" },
    { tag: "", value: "", title: "", description: "" },
  ]);

  const handlePromoChange = (index: number, field: string, val: string) => {
    setPromotions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  // Delete Slide Confirmation states
  const [isDeleteSlideConfirmOpen, setIsDeleteSlideConfirmOpen] = useState(false);
  const [pendingDeleteSlideIndex, setPendingDeleteSlideIndex] = useState<number | null>(null);

  // Delete Category Confirmation states
  const [isDeleteCatConfirmOpen, setIsDeleteCatConfirmOpen] = useState(false);
  const [pendingDeleteCatId, setPendingDeleteCatId] = useState<string | null>(null);

  const confirmDeleteSlide = () => {
    if (pendingDeleteSlideIndex !== null) {
      const updated = carouselSlides.filter((_, idx) => idx !== pendingDeleteSlideIndex);
      setCarouselSlides(updated);
    }
    setIsDeleteSlideConfirmOpen(false);
    setPendingDeleteSlideIndex(null);
  };

  const confirmDeleteCategory = async () => {
    if (!pendingDeleteCatId) return;
    setCatError("");
    try {
      const res = await fetch(`/api/categories?id=${pendingDeleteCatId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCategories();
      } else {
        const data = await res.json();
        setCatError(data.error || "Error al eliminar categoría");
      }
    } catch (err) {
      console.error(err);
      setCatError("Error de red al eliminar categoría");
    } finally {
      setIsDeleteCatConfirmOpen(false);
      setPendingDeleteCatId(null);
    }
  };

  // Testimonials Section Fields
  const [grillTestimonials, setGrillTestimonials] = useState<any[]>([]);
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);
  const [testimonialText, setTestimonialText] = useState("");
  const [testimonialAuthor, setTestimonialAuthor] = useState("");
  const [testimonialRole, setTestimonialRole] = useState("");

  // Delete Testimonial Confirmation states
  const [isDeleteTestimonialConfirmOpen, setIsDeleteTestimonialConfirmOpen] = useState(false);
  const [pendingDeleteTestimonialIndex, setPendingDeleteTestimonialIndex] = useState<number | null>(null);

  const handleOpenAddTestimonial = () => {
    setEditingTestimonialIndex(null);
    setTestimonialText("");
    setTestimonialAuthor("");
    setTestimonialRole("");
    setIsTestimonialFormOpen(true);
  };

  const handleOpenEditTestimonial = (index: number) => {
    const item = grillTestimonials[index];
    setEditingTestimonialIndex(index);
    setTestimonialText(item.text || "");
    setTestimonialAuthor(item.author || "");
    setTestimonialRole(item.role || "");
    setIsTestimonialFormOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: editingTestimonialIndex !== null ? grillTestimonials[editingTestimonialIndex].id : Date.now(),
      text: testimonialText,
      author: testimonialAuthor,
      role: testimonialRole,
    };

    if (editingTestimonialIndex !== null) {
      const updated = [...grillTestimonials];
      updated[editingTestimonialIndex] = newItem;
      setGrillTestimonials(updated);
    } else {
      setGrillTestimonials([...grillTestimonials, newItem]);
    }
    setIsTestimonialFormOpen(false);
  };

  const handleDeleteTestimonial = (index: number) => {
    setPendingDeleteTestimonialIndex(index);
    setIsDeleteTestimonialConfirmOpen(true);
  };

  const confirmDeleteTestimonial = () => {
    if (pendingDeleteTestimonialIndex !== null) {
      const updated = grillTestimonials.filter((_, idx) => idx !== pendingDeleteTestimonialIndex);
      setGrillTestimonials(updated);
    }
    setIsDeleteTestimonialConfirmOpen(false);
    setPendingDeleteTestimonialIndex(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?target=GRILL");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

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

  const fetchGrillContent = async () => {
    setLoadingContent(true);
    try {
      const res = await fetch("/api/grill/content");
      if (res.ok) {
        const data = await res.json();
        
        // Load video section
        setVideoTag(data.videoSection?.tag || "");
        setVideoTitle(data.videoSection?.title || "");
        setVideoDescription(data.videoSection?.description || "");
        setVideoUrl(data.videoSection?.videoUrl || "");
        setVideoPosterUrl(data.videoSection?.posterUrl || "");

        // Load about section
        setAboutTag(data.aboutSection?.tag || "");
        setAboutTitle(data.aboutSection?.title || "");
        setAboutParagraph1(data.aboutSection?.paragraph1 || "");
        setAboutParagraph2(data.aboutSection?.paragraph2 || "");
        setAboutStat1Value(data.aboutSection?.stat1Value || "");
        setAboutStat1Label(data.aboutSection?.stat1Label || "");
        setAboutStat2Value(data.aboutSection?.stat2Value || "");
        setAboutStat2Label(data.aboutSection?.stat2Label || "");
        setAboutImageUrl(data.aboutSection?.imageUrl || "");

        // Load slides
        setCarouselSlides(data.carouselSlides || []);

        // Load promotions
        const loadedPromos = data.promotions || [];
        const finalPromos = [
          {
            tag: loadedPromos[0]?.tag || "",
            value: loadedPromos[0]?.value || "",
            title: loadedPromos[0]?.title || "",
            description: loadedPromos[0]?.description || "",
          },
          {
            tag: loadedPromos[1]?.tag || "",
            value: loadedPromos[1]?.value || "",
            title: loadedPromos[1]?.title || "",
            description: loadedPromos[1]?.description || "",
          },
          {
            tag: loadedPromos[2]?.tag || "",
            value: loadedPromos[2]?.value || "",
            title: loadedPromos[2]?.title || "",
            description: loadedPromos[2]?.description || "",
          },
        ];
        setPromotions(finalPromos);

        // Load testimonials
        setGrillTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error("Error loading grill content:", err);
    } finally {
      setLoadingContent(false);
    }
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const resData = await res.json();
      throw new Error(resData.error || "Fallo en la carga de imagen");
    }

    const data = await res.json();
    if (data.urls && data.urls.length > 0) {
      return data.urls[0];
    }
    throw new Error("No se devolvió URL de imagen");
  };

  const handleSaveContent = async () => {
    setSavingContent(true);
    setError("");
    const body = {
      videoSection: {
        tag: videoTag,
        title: videoTitle,
        description: videoDescription,
        videoUrl,
        posterUrl: videoPosterUrl,
      },
      aboutSection: {
        tag: aboutTag,
        title: aboutTitle,
        paragraph1: aboutParagraph1,
        paragraph2: aboutParagraph2,
        stat1Value: aboutStat1Value,
        stat1Label: aboutStat1Label,
        stat2Value: aboutStat2Value,
        stat2Label: aboutStat2Label,
        imageUrl: aboutImageUrl,
      },
      carouselSlides,
      promotions,
      testimonials: grillTestimonials,
    };

    try {
      const res = await fetch("/api/grill/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccessMsg("Contenido de Zona Grill actualizado con éxito.");
        setIsContentModalOpen(false);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar contenido.");
      }
    } catch (err) {
      console.error("Error saving grill content:", err);
      setError("Error de conexión al guardar contenido.");
    } finally {
      setSavingContent(false);
    }
  };

  const handleOpenAddSlide = () => {
    setEditingSlideIndex(null);
    setSlideTag("");
    setSlideTitle("");
    setSlideSubtitle("");
    setSlideDescription("");
    setSlideImage("");
    setIsSlideFormOpen(true);
  };

  const handleOpenEditSlide = (index: number) => {
    const slide = carouselSlides[index];
    setEditingSlideIndex(index);
    setSlideTag(slide.tag || "");
    setSlideTitle(slide.title || "");
    setSlideSubtitle(slide.subtitle || "");
    setSlideDescription(slide.description || "");
    setSlideImage(slide.image || "");
    setIsSlideFormOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideImage) {
      alert("Por favor, suba una imagen para la diapositiva.");
      return;
    }
    const newSlide = {
      id: editingSlideIndex !== null ? carouselSlides[editingSlideIndex].id : Date.now(),
      tag: slideTag,
      title: slideTitle,
      subtitle: slideSubtitle,
      description: slideDescription,
      image: slideImage,
    };

    if (editingSlideIndex !== null) {
      const updated = [...carouselSlides];
      updated[editingSlideIndex] = newSlide;
      setCarouselSlides(updated);
    } else {
      setCarouselSlides([...carouselSlides, newSlide]);
    }
    setIsSlideFormOpen(false);
  };

  const handleDeleteSlide = (index: number) => {
    setPendingDeleteSlideIndex(index);
    setIsDeleteSlideConfirmOpen(true);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchGrillContent();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setAddingCat(true);
    setCatError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, target: "GRILL" }),
      });
      if (res.ok) {
        setNewCategoryName("");
        await fetchCategories();
      } else {
        const data = await res.json();
        setCatError(data.error || "Error al agregar categoría");
      }
    } catch (err) {
      console.error(err);
      setCatError("Error de red al agregar categoría");
    } finally {
      setAddingCat(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setPendingDeleteCatId(id);
    setIsDeleteCatConfirmOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategory(categories[0]?.name || "");
    setIsActive(true);
    setImageUrl(null);
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
    setImageUrl(product.imageUrl || null);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("files", files[0]);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Fallo en la carga de imagen");
      }

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        setImageUrl(data.urls[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al subir la imagen.");
    } finally {
      setUploadingImage(false);
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
      imageUrl,
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
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              fetchGrillContent();
              setIsContentModalOpen(true);
            }}
            className="px-5 py-3 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
          >
            Contenido Zona Grill
          </button>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-5 py-3 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
          >
            Gestionar Categorías
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Nuevo Platillo
          </button>
        </div>
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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
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
                <th className="py-4 px-6 w-16">Foto</th>
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
                    <td className="py-4 px-6 w-16">
                      <div className="w-12 h-12 rounded-sm overflow-hidden border border-neutral-800 bg-neutral-900 flex items-center justify-center relative">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Flame className="w-5 h-5 text-neutral-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-neutral-100 text-sm">{product.name}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1 max-w-md">{product.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-xs bg-gold-400/5 text-gold-400 border-gold-400/10">
                        {product.category}
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
                {/* Image Upload Widget */}
                <div className="space-y-2">
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Imagen del Platillo</label>
                  {imageUrl ? (
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] border border-neutral-800 rounded-sm overflow-hidden group max-w-xl">
                      <img src={imageUrl} alt="Platillo" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setImageUrl(null)}
                          className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-xs uppercase font-bold tracking-wider rounded-sm transition-all flex items-center gap-1.5"
                        >
                          <Trash2 className="w-4 h-4" /> Eliminar Imagen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-neutral-800 hover:border-gold-400/25 p-6 text-center transition-colors rounded-sm relative max-w-xl">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                      <span className="block text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                        {uploadingImage ? "Subiendo imagen..." : "Seleccionar Imagen"}
                      </span>
                      <span className="text-[10px] text-neutral-600 block mt-1">Formatos soportados: JPG, PNG. Relación rectangular recomendada.</span>
                    </div>
                  )}
                </div>

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
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                      required
                    >
                      <option value="" disabled>Seleccionar Categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
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

      {/* Confirm Slide Deletion Modal */}
      <ConfirmModal
        isOpen={isDeleteSlideConfirmOpen}
        title="Confirmar Eliminación"
        message="¿Está seguro de eliminar esta diapositiva de la galería de Zona Grill?"
        variant="danger"
        onConfirm={confirmDeleteSlide}
        onCancel={() => { setIsDeleteSlideConfirmOpen(false); setPendingDeleteSlideIndex(null); }}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />

      {/* Confirm Category Deletion Modal */}
      <ConfirmModal
        isOpen={isDeleteCatConfirmOpen}
        title="Confirmar Eliminación"
        message="¿Está seguro de eliminar esta categoría? Esto no afectará a los platillos existentes."
        variant="danger"
        onConfirm={confirmDeleteCategory}
        onCancel={() => { setIsDeleteCatConfirmOpen(false); setPendingDeleteCatId(null); }}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />

      {/* Confirm Testimonial Deletion Modal */}
      <ConfirmModal
        isOpen={isDeleteTestimonialConfirmOpen}
        title="Confirmar Eliminación"
        message="¿Está seguro de eliminar este testimonio de cliente de la Zona Grill?"
        variant="danger"
        onConfirm={confirmDeleteTestimonial}
        onCancel={() => { setIsDeleteTestimonialConfirmOpen(false); setPendingDeleteTestimonialIndex(null); }}
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

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111111] border border-neutral-800 p-6 rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-200 text-white">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute right-4 top-4 text-neutral-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Flame className="w-5 h-5 text-gold-400" />
              Administrar Categorías
            </h3>
            
            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input
                type="text"
                required
                placeholder="Nueva categoría..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
              />
              <button
                type="submit"
                disabled={addingCat}
                className="px-4 py-2 bg-gold-400 hover:bg-gold-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-obsidian text-xs font-bold tracking-widest uppercase rounded-sm flex items-center gap-1 transition-all"
              >
                {addingCat ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Agregar
              </button>
            </form>

            {catError && (
              <p className="text-[11px] text-red-400 mb-4 bg-red-500/10 border border-red-500/20 p-2 rounded-sm">{catError}</p>
            )}

            {/* List of categories */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border-t border-neutral-800 pt-4">
              {categories.length === 0 ? (
                <p className="text-center text-xs text-neutral-500 py-4">No hay categorías creadas.</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between bg-black/20 p-2.5 border border-neutral-850 rounded-xs hover:border-neutral-800 transition-colors">
                    <span className="text-xs text-neutral-200">{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xs transition-colors"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold tracking-widest uppercase transition-colors rounded-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grill Content Management Modal */}
      {isContentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-end font-sans text-white">
          <div className="w-full max-w-4xl bg-[#111111] h-full overflow-y-auto border-l border-neutral-800 p-8 flex flex-col justify-between animate-in slide-in-from-right duration-350">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-gold-400">
                    Administrar Contenido de Zona Grill
                  </h2>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                    Edita el Video, la Galería del Chef y la sección Sobre Nosotros
                  </p>
                </div>
                <button
                  onClick={() => setIsContentModalOpen(false)}
                  className="p-2 text-neutral-500 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-neutral-800 mb-6 gap-6 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setContentTab("video")}
                  className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                    contentTab === "video"
                      ? "border-gold-400 text-gold-400"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  <Film className="w-4 h-4" />
                  Experiencia Sensorial
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab("about")}
                  className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                    contentTab === "about"
                      ? "border-gold-400 text-gold-400"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Sobre Nosotros
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab("carousel")}
                  className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                    contentTab === "carousel"
                      ? "border-gold-400 text-gold-400"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Galería del Chef
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab("testimonials")}
                  className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                    contentTab === "testimonials"
                      ? "border-gold-400 text-gold-400"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Testimonios
                </button>
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
                  <span className="text-xs text-neutral-500 uppercase tracking-widest">Cargando contenido...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* TAB: VIDEO */}
                  {contentTab === "video" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Tag Superior</label>
                          <input
                            type="text"
                            value={videoTag}
                            onChange={(e) => setVideoTag(e.target.value)}
                            placeholder="Ej. Experiencia Sensorial"
                            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Título de la Sección</label>
                          <input
                            type="text"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder="Ej. El Arte del Fuego en Vivo"
                            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Descripción Corta</label>
                        <textarea
                          rows={3}
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          placeholder="Descripción breve de la preparación..."
                          className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Video de la Experiencia (MP4/WebM)</label>
                          {videoUrl ? (
                            <div className="relative aspect-video border border-neutral-800 rounded-sm overflow-hidden group">
                              <video src={videoUrl} className="w-full h-full object-cover" controls />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => setVideoUrl("")}
                                  className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-xs uppercase font-bold tracking-wider rounded-sm transition-all flex items-center gap-1.5"
                                >
                                  <Trash2 className="w-4 h-4" /> Eliminar Video
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-neutral-800 hover:border-gold-400/25 p-6 text-center transition-colors rounded-sm relative">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (!files || files.length === 0) return;
                                  setUploadingVideo(true);
                                  try {
                                    const url = await uploadImageFile(files[0]);
                                    setVideoUrl(url);
                                  } catch (err: any) {
                                    alert(err.message || "Error al subir video");
                                  } finally {
                                    setUploadingVideo(false);
                                  }
                                }}
                                disabled={uploadingVideo}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <Film className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                              <span className="block text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                                {uploadingVideo ? "Subiendo video..." : "Seleccionar Video"}
                              </span>
                              <span className="text-[10px] text-neutral-600 block mt-1">Formatos: MP4, WebM</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Miniatura / Poster del Video</label>
                          {videoPosterUrl ? (
                            <div className="relative aspect-video border border-neutral-800 rounded-sm overflow-hidden group">
                              <img src={videoPosterUrl} alt="Poster Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => setVideoPosterUrl("")}
                                  className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-xs uppercase font-bold tracking-wider rounded-sm transition-all flex items-center gap-1.5"
                                >
                                  <Trash2 className="w-4 h-4" /> Eliminar Poster
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-neutral-800 hover:border-gold-400/25 p-6 text-center transition-colors rounded-sm relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (!files || files.length === 0) return;
                                  setUploadingPoster(true);
                                  try {
                                    const url = await uploadImageFile(files[0]);
                                    setVideoPosterUrl(url);
                                  } catch (err: any) {
                                    alert(err.message || "Error al subir poster");
                                  } finally {
                                    setUploadingPoster(false);
                                  }
                                }}
                                disabled={uploadingPoster}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                              <span className="block text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                                {uploadingPoster ? "Subiendo miniatura..." : "Seleccionar Miniatura"}
                              </span>
                              <span className="text-[10px] text-neutral-600 block mt-1">Formatos: JPG, PNG, WebP</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Promociones del Fin de Semana */}
                      <div className="border-t border-neutral-800 pt-6 mt-6">
                        <h3 className="font-serif text-lg font-semibold text-gold-400 mb-4 flex items-center gap-2">
                          <Gift className="w-5 h-5 text-gold-400" />
                          Promociones del Fin de Semana
                        </h3>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-6">
                          Edita la información de las tres tarjetas de promociones que aparecen en la página de inicio.
                        </p>

                        <div className="space-y-6">
                          {promotions.map((promo, idx) => (
                            <div key={idx} className="p-4 bg-black/20 border border-neutral-850 rounded-sm space-y-4">
                              <h4 className="text-[10px] text-gold-400 uppercase tracking-widest font-black">
                                Promoción {idx + 1}
                              </h4>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Etiqueta (Badge)</label>
                                  <input
                                    type="text"
                                    value={promo.tag}
                                    onChange={(e) => handlePromoChange(idx, "tag", e.target.value)}
                                    placeholder="Ej. Sábados y Domingos"
                                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2.5 text-xs outline-none transition-colors rounded-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Valor (Descuento/Precio)</label>
                                  <input
                                    type="text"
                                    value={promo.value}
                                    onChange={(e) => handlePromoChange(idx, "value", e.target.value)}
                                    placeholder="Ej. GRATIS o 10% OFF"
                                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2.5 text-xs outline-none transition-colors rounded-xs text-white"
                                  />
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Título de la Promoción</label>
                                  <input
                                    type="text"
                                    value={promo.title}
                                    onChange={(e) => handlePromoChange(idx, "title", e.target.value)}
                                    placeholder="Ej. Papas Rellenas Especiales"
                                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2.5 text-xs outline-none transition-colors rounded-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Descripción</label>
                                  <textarea
                                    rows={2}
                                    value={promo.description}
                                    onChange={(e) => handlePromoChange(idx, "description", e.target.value)}
                                    placeholder="Detalles de la promoción..."
                                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2.5 text-xs outline-none transition-colors rounded-xs text-white resize-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: ABOUT US */}
                  {contentTab === "about" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Tag Superior</label>
                          <input
                            type="text"
                            value={aboutTag}
                            onChange={(e) => setAboutTag(e.target.value)}
                            placeholder="Ej. Nuestra Historia"
                            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Título de la Historia</label>
                          <input
                            type="text"
                            value={aboutTitle}
                            onChange={(e) => setAboutTitle(e.target.value)}
                            placeholder="Ej. Calidad de Origen y Pasión"
                            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Primer Párrafo</label>
                          <textarea
                            rows={4}
                            value={aboutParagraph1}
                            onChange={(e) => setAboutParagraph1(e.target.value)}
                            placeholder="Texto del primer párrafo..."
                            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Segundo Párrafo</label>
                          <textarea
                            rows={4}
                            value={aboutParagraph2}
                            onChange={(e) => setAboutParagraph2(e.target.value)}
                            placeholder="Texto del segundo párrafo..."
                            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white resize-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Stat 1 */}
                        <div className="p-4 bg-black/20 border border-neutral-850 rounded-sm space-y-3">
                          <h4 className="text-[10px] text-gold-400 uppercase tracking-widest font-black">Métrica 1</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Valor (Grande)</label>
                              <input
                                type="text"
                                value={aboutStat1Value}
                                onChange={(e) => setAboutStat1Value(e.target.value)}
                                placeholder="Ej. Sonora"
                                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2 text-xs outline-none transition-colors rounded-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Etiqueta</label>
                              <input
                                type="text"
                                value={aboutStat1Label}
                                onChange={(e) => setAboutStat1Label(e.target.value)}
                                placeholder="Ej. Cortes Premium"
                                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2 text-xs outline-none transition-colors rounded-xs text-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-4 bg-black/20 border border-neutral-850 rounded-sm space-y-3">
                          <h4 className="text-[10px] text-gold-400 uppercase tracking-widest font-black">Métrica 2</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Valor (Grande)</label>
                              <input
                                type="text"
                                value={aboutStat2Value}
                                onChange={(e) => setAboutStat2Value(e.target.value)}
                                placeholder="Ej. 100%"
                                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2 text-xs outline-none transition-colors rounded-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Etiqueta</label>
                              <input
                                type="text"
                                value={aboutStat2Label}
                                onChange={(e) => setAboutStat2Label(e.target.value)}
                                placeholder="Ej. Carbón de Mezquite"
                                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2 text-xs outline-none transition-colors rounded-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Lateral */}
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Imagen Lateral de Nosotros</label>
                        {aboutImageUrl ? (
                          <div className="relative aspect-[4/3] max-w-md border border-neutral-800 rounded-sm overflow-hidden group">
                            <img src={aboutImageUrl} alt="Nosotros Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setAboutImageUrl("")}
                                className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-xs uppercase font-bold tracking-wider rounded-sm transition-all flex items-center gap-1.5"
                              >
                                <Trash2 className="w-4 h-4" /> Eliminar Imagen
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-neutral-800 hover:border-gold-400/25 p-6 text-center transition-colors rounded-sm relative max-w-md">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const files = e.target.files;
                                if (!files || files.length === 0) return;
                                setUploadingAboutImage(true);
                                try {
                                  const url = await uploadImageFile(files[0]);
                                  setAboutImageUrl(url);
                                } catch (err: any) {
                                  alert(err.message || "Error al subir imagen");
                                } finally {
                                  setUploadingAboutImage(false);
                                }
                              }}
                              disabled={uploadingAboutImage}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                            <span className="block text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                              {uploadingAboutImage ? "Subiendo imagen..." : "Seleccionar Imagen"}
                            </span>
                            <span className="text-[10px] text-neutral-600 block mt-1">Formatos: JPG, PNG, WebP</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB: CAROUSEL */}
                  {contentTab === "carousel" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                        <h4 className="text-[10px] text-gold-400 uppercase tracking-widest font-black">Diapositivas del Carrusel</h4>
                        <button
                          type="button"
                          onClick={handleOpenAddSlide}
                          className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-obsidian text-[10px] font-bold tracking-widest uppercase rounded-sm flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Agregar Foto
                        </button>
                      </div>

                      {/* List slides */}
                      <div className="grid grid-cols-1 gap-4">
                        {carouselSlides.length === 0 ? (
                          <p className="text-center text-xs text-neutral-500 py-8">No hay diapositivas en la galería. Agrega una nueva.</p>
                        ) : (
                          carouselSlides.map((slide, index) => (
                            <div key={slide.id || index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/20 p-4 border border-neutral-850 rounded-sm gap-4 hover:border-neutral-800 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-14 rounded-xs overflow-hidden border border-neutral-800 bg-neutral-900 shrink-0">
                                  {slide.image ? (
                                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                      <ImageIcon className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="overflow-hidden">
                                  <span className="text-[8px] bg-red-650/10 border border-red-500/10 text-red-400 font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-widest">{slide.tag || "SLIDE"}</span>
                                  <h5 className="font-serif text-sm font-semibold text-neutral-200 mt-1">{slide.title || "Sin Título"}</h5>
                                  <p className="text-[10px] text-neutral-500 line-clamp-1">{slide.subtitle}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 self-end sm:self-center shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditSlide(index)}
                                  className="p-1.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:text-gold-400 rounded-xs transition-all"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlide(index)}
                                  className="p-1.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:text-red-400 rounded-xs transition-all"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB: TESTIMONIALS */}
                  {contentTab === "testimonials" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                        <h4 className="text-[10px] text-gold-400 uppercase tracking-widest font-black">Testimonios de Clientes</h4>
                        <button
                          type="button"
                          onClick={handleOpenAddTestimonial}
                          className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-obsidian text-[10px] font-bold tracking-widest uppercase rounded-sm flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Agregar Testimonio
                        </button>
                      </div>

                      {/* List testimonials */}
                      <div className="grid grid-cols-1 gap-4">
                        {grillTestimonials.length === 0 ? (
                          <p className="text-center text-xs text-neutral-500 py-8">No hay testimonios. Agrega uno nuevo.</p>
                        ) : (
                          grillTestimonials.map((item, index) => (
                            <div key={item.id || index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/20 p-4 border border-neutral-850 rounded-sm gap-4 hover:border-neutral-800 transition-colors">
                              <div className="overflow-hidden space-y-1">
                                <p className="text-xs text-neutral-300 italic font-serif">"{item.text}"</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gold-400 font-semibold">{item.author}</span>
                                  <span className="text-neutral-600 text-[10px]">|</span>
                                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{item.role}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 self-end sm:self-center shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditTestimonial(index)}
                                  className="p-1.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:text-gold-400 rounded-xs transition-all"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTestimonial(index)}
                                  className="p-1.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:text-red-400 rounded-xs transition-all"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="pt-6 border-t border-neutral-800 flex gap-4 mt-8">
              <button
                type="button"
                onClick={handleSaveContent}
                disabled={savingContent || loadingContent}
                className="flex-1 py-3.5 bg-gold-400 hover:bg-gold-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all rounded-sm flex items-center justify-center font-bold"
              >
                {savingContent ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando Todo...
                  </>
                ) : (
                  "Guardar Contenido Zona Grill"
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsContentModalOpen(false)}
                className="px-6 py-3.5 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold tracking-widest uppercase transition-colors rounded-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Editor Sub-Modal */}
      {isSlideFormOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-sans text-white">
          <form onSubmit={handleSaveSlide} className="w-full max-w-lg bg-[#111111] border border-neutral-800 rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <h3 className="font-serif text-xl font-semibold text-gold-400">
                {editingSlideIndex !== null ? "Editar Diapositiva" : "Nueva Diapositiva"}
              </h3>
              <button
                type="button"
                onClick={() => setIsSlideFormOpen(false)}
                className="text-neutral-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Tag Superior</label>
                  <input
                    type="text"
                    required
                    value={slideTag}
                    onChange={(e) => setSlideTag(e.target.value)}
                    placeholder="Ej. CORTES PREMIUM"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Título Principal</label>
                  <input
                    type="text"
                    required
                    value={slideTitle}
                    onChange={(e) => setSlideTitle(e.target.value)}
                    placeholder="Ej. RIBEYE CON MARMOLEO"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Subtítulo</label>
                <input
                  type="text"
                  required
                  value={slideSubtitle}
                  onChange={(e) => setSlideSubtitle(e.target.value)}
                  placeholder="Ej. Marmoleo perfecto y calidad prime"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Descripción Completa</label>
                <textarea
                  rows={3}
                  required
                  value={slideDescription}
                  onChange={(e) => setSlideDescription(e.target.value)}
                  placeholder="Escribe detalles del corte, ahumado, etc..."
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Imagen de la Diapositiva</label>
                {slideImage ? (
                  <div className="relative aspect-[4/3] w-full border border-neutral-800 rounded-sm overflow-hidden group">
                    <img src={slideImage} alt="Slide Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setSlideImage("")}
                        className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-xs uppercase font-bold tracking-wider rounded-sm transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar Imagen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-neutral-800 hover:border-gold-400/25 p-6 text-center transition-colors rounded-sm relative w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setUploadingSlideImage(true);
                        try {
                          const url = await uploadImageFile(files[0]);
                          setSlideImage(url);
                        } catch (err: any) {
                          alert(err.message || "Error al subir imagen");
                        } finally {
                          setUploadingSlideImage(false);
                        }
                      }}
                      disabled={uploadingSlideImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <span className="block text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                      {uploadingSlideImage ? "Subiendo imagen..." : "Seleccionar Imagen"}
                    </span>
                    <span className="text-[10px] text-neutral-600 block mt-1">Formatos: JPG, PNG, WebP</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 shrink-0">
              <button
                type="submit"
                className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-bold uppercase rounded-sm"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setIsSlideFormOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonial Editor Sub-Modal */}
      {isTestimonialFormOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-sans text-white">
          <form onSubmit={handleSaveTestimonial} className="w-full max-w-lg bg-[#111111] border border-neutral-800 rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <h3 className="font-serif text-xl font-semibold text-gold-400">
                {editingTestimonialIndex !== null ? "Editar Testimonio" : "Nuevo Testimonio"}
              </h3>
              <button
                type="button"
                onClick={() => setIsTestimonialFormOpen(false)}
                className="text-neutral-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Autor / Cliente</label>
                <input
                  type="text"
                  required
                  value={testimonialAuthor}
                  onChange={(e) => setTestimonialAuthor(e.target.value)}
                  placeholder="Ej. Carlos Villalobos"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Rol / Categoría</label>
                <input
                  type="text"
                  required
                  value={testimonialRole}
                  onChange={(e) => setTestimonialRole(e.target.value)}
                  placeholder="Ej. Cliente de Fin de Semana"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Opinión / Comentario</label>
                <textarea
                  rows={4}
                  required
                  value={testimonialText}
                  onChange={(e) => setTestimonialText(e.target.value)}
                  placeholder="Escribe el testimonio del cliente..."
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 shrink-0">
              <button
                type="submit"
                className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-bold uppercase rounded-sm"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setIsTestimonialFormOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
