"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Upload, X, Check, Star, Search, Film, BookOpen, MessageSquare, Image as ImageIcon, LayoutGrid, Tag } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { parseDescription, serializeDescription } from "@/lib/utils";
import { upload } from "@vercel/blob/client";

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
  type: string;
  status: "DISPONIBLE" | "RESERVADO" | "VENDIDO";
  featured: boolean;
  images: PropertyImage[];
}

interface CustomCategory {
  id: string;
  name: string;
  target: string;
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

  // Category management state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [catError, setCatError] = useState("");

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
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<"DISPONIBLE" | "RESERVADO" | "VENDIDO">("DISPONIBLE");
  const [featured, setFeatured] = useState(false);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Store Content Modal State
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentTab, setContentTab] = useState<"hero" | "video" | "catalog" | "gallery" | "about" | "testimonials">("hero");
  const [loadingContent, setLoadingContent] = useState(false);
  const [savingContent, setSavingContent] = useState(false);

  // Hero Slide Section Fields
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [isHeroSlideFormOpen, setIsHeroSlideFormOpen] = useState(false);
  const [editingHeroSlideIndex, setEditingHeroSlideIndex] = useState<number | null>(null);

  // Hero Slide Editor Fields
  const [heroSlideTag, setHeroSlideTag] = useState("");
  const [heroSlideTitle, setHeroSlideTitle] = useState("");
  const [heroSlideDescription, setHeroSlideDescription] = useState("");
  const [heroSlideMediaType, setHeroSlideMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [heroSlideMediaUrl, setHeroSlideMediaUrl] = useState("");
  const [uploadingHeroMedia, setUploadingHeroMedia] = useState(false);

  // Delete Hero Slide Confirmation states
  const [isDeleteHeroSlideConfirmOpen, setIsDeleteHeroSlideConfirmOpen] = useState(false);
  const [pendingDeleteHeroSlideIndex, setPendingDeleteHeroSlideIndex] = useState<number | null>(null);

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

  // Testimonials Section Fields
  const [storeTestimonials, setStoreTestimonials] = useState<any[]>([]);
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);

  // Testimonial Editor Fields
  const [testimonialText, setTestimonialText] = useState("");
  const [testimonialAuthor, setTestimonialAuthor] = useState("");
  const [testimonialRole, setTestimonialRole] = useState("");

  // Delete Testimonial Confirmation states
  const [isDeleteTestimonialConfirmOpen, setIsDeleteTestimonialConfirmOpen] = useState(false);
  const [pendingDeleteTestimonialIndex, setPendingDeleteTestimonialIndex] = useState<number | null>(null);

  // Delete Category Confirmation states
  const [isDeleteCatConfirmOpen, setIsDeleteCatConfirmOpen] = useState(false);
  const [pendingDeleteCatId, setPendingDeleteCatId] = useState<string | null>(null);

  // Modal Sub-Form Error States
  const [heroSlideFormError, setHeroSlideFormError] = useState("");
  const [testimonialFormError, setTestimonialFormError] = useState("");
  const [contentFormError, setContentFormError] = useState("");

  // Catalog Section Fields
  const [catalogTag, setCatalogTag] = useState("");
  const [catalogTitle, setCatalogTitle] = useState("");
  const [catalogDescription, setCatalogDescription] = useState("");

  // Gallery Section Fields
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState<number | null>(null);
  const [isGalleryImageFormOpen, setIsGalleryImageFormOpen] = useState(false);
  const [editingGalleryImageIndex, setEditingGalleryImageIndex] = useState<number | null>(null);
  const [galleryImageUrl, setGalleryImageUrl] = useState("");
  const [galleryImageLabel, setGalleryImageLabel] = useState("");
  const [galleryImageFormError, setGalleryImageFormError] = useState("");
  const [uploadingGalleryMedia, setUploadingGalleryMedia] = useState(false);
  const [isDeleteGalleryImageConfirmOpen, setIsDeleteGalleryImageConfirmOpen] = useState(false);
  const [pendingDeleteGalleryImageIndex, setPendingDeleteGalleryImageIndex] = useState<number | null>(null);

  const fetchStoreContent = async () => {
    setLoadingContent(true);
    try {
      const res = await fetch("/api/store/content");
      if (res.ok) {
        const data = await res.json();
        
        // Load heroSlides
        setHeroSlides(data.heroSlides || []);

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

        // Load testimonials
        setStoreTestimonials(data.testimonials || []);

        // Load catalog section
        setCatalogTag(data.catalogSection?.tag || "");
        setCatalogTitle(data.catalogSection?.title || "");
        setCatalogDescription(data.catalogSection?.description || "");

        // Load gallery section
        setGalleryTitle(data.gallerySection?.title || "");
        setGalleryImages(data.gallerySection?.images || []);
      }
    } catch (err) {
      console.error("Error loading store content:", err);
    } finally {
      setLoadingContent(false);
    }
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      return blob.url;
    } catch (err: any) {
      console.error("Client upload error:", err);
      throw new Error(err.message || "Fallo en la subida del archivo");
    }
  };

  const handleSaveStoreContent = async () => {
    setSavingContent(true);
    setError("");
    setContentFormError("");
    const body = {
      heroSlides,
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
      testimonials: storeTestimonials,
      catalogSection: {
        tag: catalogTag,
        title: catalogTitle,
        description: catalogDescription,
      },
      gallerySection: {
        title: galleryTitle,
        images: galleryImages,
      },
    };

    try {
      const res = await fetch("/api/store/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccessMsg("Contenido de Store actualizado con éxito.");
        setIsContentModalOpen(false);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar contenido.");
      }
    } catch (err) {
      console.error("Error saving store content:", err);
      setError("Error de conexión al guardar contenido.");
    } finally {
      setSavingContent(false);
    }
  };

  const handleOpenAddHeroSlide = () => {
    setEditingHeroSlideIndex(null);
    setHeroSlideTag("");
    setHeroSlideTitle("");
    setHeroSlideDescription("");
    setHeroSlideMediaType("IMAGE");
    setHeroSlideMediaUrl("");
    setHeroSlideFormError("");
    setIsHeroSlideFormOpen(true);
  };

  const handleOpenEditHeroSlide = (index: number) => {
    const slide = heroSlides[index];
    setEditingHeroSlideIndex(index);
    setHeroSlideTag(slide.tag || "");
    setHeroSlideTitle(slide.title || "");
    setHeroSlideDescription(slide.description || "");
    setHeroSlideMediaType(slide.mediaType || "IMAGE");
    setHeroSlideMediaUrl(slide.mediaUrl || "");
    setHeroSlideFormError("");
    setIsHeroSlideFormOpen(true);
  };

  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSlideMediaUrl) {
      setHeroSlideFormError(`Por favor, suba una ${heroSlideMediaType === "IMAGE" ? "imagen" : "un video"} para la diapositiva.`);
      return;
    }
    const newSlide = {
      id: editingHeroSlideIndex !== null ? heroSlides[editingHeroSlideIndex].id : Date.now(),
      tag: heroSlideTag,
      title: heroSlideTitle,
      description: heroSlideDescription,
      mediaType: heroSlideMediaType,
      mediaUrl: heroSlideMediaUrl,
    };

    if (editingHeroSlideIndex !== null) {
      const updated = [...heroSlides];
      updated[editingHeroSlideIndex] = newSlide;
      setHeroSlides(updated);
    } else {
      setHeroSlides([...heroSlides, newSlide]);
    }
    setIsHeroSlideFormOpen(false);
  };

  const handleDeleteHeroSlide = (index: number) => {
    setPendingDeleteHeroSlideIndex(index);
    setIsDeleteHeroSlideConfirmOpen(true);
  };

  const confirmDeleteHeroSlide = () => {
    if (pendingDeleteHeroSlideIndex !== null) {
      const updated = heroSlides.filter((_, idx) => idx !== pendingDeleteHeroSlideIndex);
      setHeroSlides(updated);
    }
    setIsDeleteHeroSlideConfirmOpen(false);
    setPendingDeleteHeroSlideIndex(null);
  };

  const handleOpenAddTestimonial = () => {
    setEditingTestimonialIndex(null);
    setTestimonialText("");
    setTestimonialAuthor("");
    setTestimonialRole("");
    setTestimonialFormError("");
    setIsTestimonialFormOpen(true);
  };

  const handleOpenEditTestimonial = (index: number) => {
    const item = storeTestimonials[index];
    setEditingTestimonialIndex(index);
    setTestimonialText(item.text || "");
    setTestimonialAuthor(item.author || "");
    setTestimonialRole(item.role || "");
    setTestimonialFormError("");
    setIsTestimonialFormOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: editingTestimonialIndex !== null ? storeTestimonials[editingTestimonialIndex].id : Date.now(),
      text: testimonialText,
      author: testimonialAuthor,
      role: testimonialRole,
    };

    if (editingTestimonialIndex !== null) {
      const updated = [...storeTestimonials];
      updated[editingTestimonialIndex] = newItem;
      setStoreTestimonials(updated);
    } else {
      setStoreTestimonials([...storeTestimonials, newItem]);
    }
    setIsTestimonialFormOpen(false);
  };

  const handleDeleteTestimonial = (index: number) => {
    setPendingDeleteTestimonialIndex(index);
    setIsDeleteTestimonialConfirmOpen(true);
  };

  const confirmDeleteTestimonial = () => {
    if (pendingDeleteTestimonialIndex !== null) {
      const updated = storeTestimonials.filter((_, idx) => idx !== pendingDeleteTestimonialIndex);
      setStoreTestimonials(updated);
    }
    setIsDeleteTestimonialConfirmOpen(false);
    setPendingDeleteTestimonialIndex(null);
  };

  // Gallery Image handlers
  const handleOpenAddGalleryImage = () => {
    setEditingGalleryImageIndex(null);
    setGalleryImageUrl("");
    setGalleryImageLabel("");
    setGalleryImageFormError("");
    setIsGalleryImageFormOpen(true);
  };

  const handleOpenEditGalleryImage = (index: number) => {
    const img = galleryImages[index];
    setEditingGalleryImageIndex(index);
    setGalleryImageUrl(img.url || "");
    setGalleryImageLabel(img.label || "");
    setGalleryImageFormError("");
    setIsGalleryImageFormOpen(true);
  };

  const handleSaveGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryImageUrl) {
      setGalleryImageFormError("Por favor, suba una imagen para la galería.");
      return;
    }
    const newImg = {
      id: editingGalleryImageIndex !== null ? galleryImages[editingGalleryImageIndex].id : String(Date.now()),
      url: galleryImageUrl,
      label: galleryImageLabel,
    };

    if (editingGalleryImageIndex !== null) {
      const updated = [...galleryImages];
      updated[editingGalleryImageIndex] = newImg;
      setGalleryImages(updated);
    } else {
      setGalleryImages([...galleryImages, newImg]);
    }
    setIsGalleryImageFormOpen(false);
  };

  const handleDeleteGalleryImage = (index: number) => {
    setPendingDeleteGalleryImageIndex(index);
    setIsDeleteGalleryImageConfirmOpen(true);
  };

  const confirmDeleteGalleryImage = () => {
    if (pendingDeleteGalleryImageIndex !== null) {
      const updated = galleryImages.filter((_, idx) => idx !== pendingDeleteGalleryImageIndex);
      setGalleryImages(updated);
    }
    setIsDeleteGalleryImageConfirmOpen(false);
    setPendingDeleteGalleryImageIndex(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?target=STORE");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

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
    fetchCategories();
    fetchStoreContent();
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
        body: JSON.stringify({ name: newCategoryName, target: "STORE" }),
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
    setType(categories[0]?.name || "");
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
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        newUrls.push(blob.url);
      }

      const newImages = newUrls.map((url: string, index: number) => ({
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
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              fetchStoreContent();
              setIsContentModalOpen(true);
            }}
            className="px-5 py-3 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
          >
            Contenido Store
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
            Nuevo Producto
          </button>
        </div>
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
                      {prop.type}
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
                      onChange={(e) => setType(e.target.value)}
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
              <Star className="w-5 h-5 text-gold-400" />
              Administrar Categorías Boutique
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

      {/* Store Content Management Modal */}
      {isContentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-end font-sans text-white">
          <div className="w-full max-w-4xl bg-[#111111] h-full overflow-y-auto border-l border-neutral-800 p-8 flex flex-col justify-between animate-in slide-in-from-right duration-350">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-gold-400">
                    Administrar Contenido de Store
                  </h2>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                    Edita la portada, video, catálogo, galería, sobre nosotros y testimonios
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
                  onClick={() => setContentTab("hero")}
                  className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                    contentTab === "hero"
                      ? "border-gold-400 text-gold-400"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Portada (Slider)
                </button>
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
                  Concepto Integral
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab("catalog")}
                  className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                    contentTab === "catalog"
                      ? "border-gold-400 text-gold-400"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  Sección Catálogo
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab("gallery")}
                  className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                    contentTab === "gallery"
                      ? "border-gold-400 text-gold-400"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Galería Visual
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
                  <MessageSquare className="w-4 h-4" />
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
                  {contentFormError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm mb-6 flex justify-between items-center animate-in fade-in duration-200">
                      <span>{contentFormError}</span>
                      <button type="button" onClick={() => setContentFormError("")} className="text-red-400 hover:text-white p-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* TAB: HERO SLIDER */}
                  {contentTab === "hero" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                        <div>
                          <h4 className="text-[10px] text-gold-400 uppercase tracking-widest font-black">Diapositivas de Portada</h4>
                          <p className="text-[10px] text-neutral-500 uppercase mt-1">Crea slides de portada con textos personalizados e imágenes/videos de fondo</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenAddHeroSlide}
                          className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-obsidian text-[10px] font-bold tracking-widest uppercase rounded-sm flex items-center gap-1.5 animate-all duration-300"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Agregar Diapositiva
                        </button>
                      </div>

                      {/* List heroSlides */}
                      <div className="grid grid-cols-1 gap-4">
                        {heroSlides.length === 0 ? (
                          <p className="text-center text-xs text-neutral-500 py-8">No hay diapositivas de portada. Agrega una nueva.</p>
                        ) : (
                          heroSlides.map((slide, index) => (
                            <div key={slide.id || index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/20 p-4 border border-neutral-850 rounded-sm gap-4 hover:border-neutral-800 transition-colors">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-24 h-16 shrink-0 bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden flex items-center justify-center relative">
                                  {slide.mediaType === "VIDEO" ? (
                                    <video src={slide.mediaUrl} className="w-full h-full object-cover" muted />
                                  ) : (
                                    <img src={slide.mediaUrl} alt={slide.title} className="w-full h-full object-cover" />
                                  )}
                                  <span className="absolute top-1 left-1 bg-black/70 px-1 py-0.5 rounded-[2px] text-[8px] font-black uppercase text-gold-400">
                                    {slide.mediaType}
                                  </span>
                                </div>
                                <div className="overflow-hidden">
                                  <span className="text-[8px] bg-gold-400/10 border border-gold-400/20 text-gold-400 font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-widest">{slide.tag || "PORTADA"}</span>
                                  <h5 className="font-serif text-sm font-semibold text-neutral-200 mt-1">{slide.title || "Sin Título"}</h5>
                                  <p className="text-[10px] text-neutral-500 line-clamp-1">{slide.description}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 self-end sm:self-center shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditHeroSlide(index)}
                                  className="p-1.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:text-gold-400 rounded-xs transition-all"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteHeroSlide(index)}
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
                            placeholder="Ej. EXPERIENCIA SENSORIAL"
                            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Título de la Sección</label>
                          <input
                            type="text"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder="Ej. El Arte del Fuego & La Brasa"
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
                          placeholder="Descripción breve..."
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
                                    setContentFormError(err.message || "Error al subir video");
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
                                    setContentFormError(err.message || "Error al subir poster");
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
                            placeholder="Ej. CONCEPTO INTEGRAL"
                            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Título de la Historia</label>
                          <input
                            type="text"
                            value={aboutTitle}
                            onChange={(e) => setAboutTitle(e.target.value)}
                            placeholder="Ej. Calidad de Origen, Suavidad y Pasión"
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
                              <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Valor</label>
                              <input
                                type="text"
                                value={aboutStat1Value}
                                onChange={(e) => setAboutStat1Value(e.target.value)}
                                placeholder="Ej. 100%"
                                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2 text-xs outline-none transition-colors rounded-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Etiqueta</label>
                              <input
                                type="text"
                                value={aboutStat1Label}
                                onChange={(e) => setAboutStat1Label(e.target.value)}
                                placeholder="Ej. Ganado de Sonora"
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
                              <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Valor</label>
                              <input
                                type="text"
                                value={aboutStat2Value}
                                onChange={(e) => setAboutStat2Value(e.target.value)}
                                placeholder="Ej. Alto Vacío"
                                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2 text-xs outline-none transition-colors rounded-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Etiqueta</label>
                              <input
                                type="text"
                                value={aboutStat2Label}
                                onChange={(e) => setAboutStat2Label(e.target.value)}
                                placeholder="Ej. Frescura Garantizada"
                                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-2 text-xs outline-none transition-colors rounded-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Lateral */}
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Imagen Lateral</label>
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
                        {storeTestimonials.length === 0 ? (
                          <p className="text-center text-xs text-neutral-500 py-8">No hay testimonios. Agrega uno nuevo.</p>
                        ) : (
                          storeTestimonials.map((item, index) => (
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

                  {/* TAB: CATALOG SECTION */}
                  {contentTab === "catalog" && (
                    <div className="space-y-6">
                      <div className="border-b border-neutral-800 pb-4">
                        <h4 className="text-[10px] text-gold-400 uppercase tracking-widest font-black">Encabezados del Catálogo</h4>
                        <p className="text-[10px] text-neutral-500 uppercase mt-1">Edita el tag, título y descripción que aparecen sobre el listado de productos</p>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Tag Superior</label>
                        <input
                          type="text"
                          value={catalogTag}
                          onChange={(e) => setCatalogTag(e.target.value)}
                          placeholder="Ej. SELECCIÓN BOUTIQUE"
                          className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Título del Catálogo</label>
                        <input
                          type="text"
                          value={catalogTitle}
                          onChange={(e) => setCatalogTitle(e.target.value)}
                          placeholder="Ej. Nuestro Menú & Productos"
                          className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Descripción</label>
                        <textarea
                          rows={3}
                          value={catalogDescription}
                          onChange={(e) => setCatalogDescription(e.target.value)}
                          placeholder="Descripción breve del catálogo..."
                          className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB: GALLERY */}
                  {contentTab === "gallery" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                        <div>
                          <h4 className="text-[10px] text-gold-400 uppercase tracking-widest font-black">Galería Visual</h4>
                          <p className="text-[10px] text-neutral-500 uppercase mt-1">Administra las imágenes de la galería de la tienda</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenAddGalleryImage}
                          className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-obsidian text-[10px] font-bold tracking-widest uppercase rounded-sm flex items-center gap-1.5 animate-all duration-300"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Agregar Imagen
                        </button>
                      </div>

                      {/* Gallery Images List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {galleryImages.length === 0 ? (
                          <p className="text-center text-xs text-neutral-500 py-8 col-span-2">No hay imágenes en la galería. Agrega una nueva.</p>
                        ) : (
                          galleryImages.map((img, index) => (
                            <div key={img.id || index} className="relative group border border-neutral-850 rounded-sm overflow-hidden bg-black/20 hover:border-neutral-800 transition-colors">
                              <div className="aspect-[4/3] relative">
                                <img src={img.url} alt={img.label || "Galería"} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditGalleryImage(index)}
                                    className="p-2 bg-neutral-900/80 hover:bg-neutral-800 text-gold-400 rounded-sm transition-all"
                                    title="Editar"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGalleryImage(index)}
                                    className="p-2 bg-neutral-900/80 hover:bg-neutral-800 text-red-400 rounded-sm transition-all"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="p-3">
                                <span className="text-xs text-neutral-300 uppercase tracking-wider font-semibold">{img.label || "Sin etiqueta"}</span>
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
                onClick={handleSaveStoreContent}
                disabled={savingContent || loadingContent}
                className="flex-1 py-3.5 bg-gold-400 hover:bg-gold-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all rounded-sm flex items-center justify-center font-bold"
              >
                {savingContent ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando Todo...
                  </>
                ) : (
                  "Guardar Contenido Store"
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
              {testimonialFormError && (
                <div className="p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-xs rounded-sm mb-4 animate-in fade-in duration-200">
                  {testimonialFormError}
                </div>
              )}
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Contenido del Testimonio</label>
                <textarea
                  rows={4}
                  required
                  value={testimonialText}
                  onChange={(e) => setTestimonialText(e.target.value)}
                  placeholder="Excelente calidad..."
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Autor</label>
                  <input
                    type="text"
                    required
                    value={testimonialAuthor}
                    onChange={(e) => setTestimonialAuthor(e.target.value)}
                    placeholder="Ej. Sofía Galván"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Rol / Relación</label>
                  <input
                    type="text"
                    required
                    value={testimonialRole}
                    onChange={(e) => setTestimonialRole(e.target.value)}
                    placeholder="Ej. Cliente Boutique"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                  />
                </div>
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

      {/* Hero Slide Editor Sub-Modal */}
      {isHeroSlideFormOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-sans text-white">
          <form onSubmit={handleSaveHeroSlide} className="w-full max-w-lg bg-[#111111] border border-neutral-800 rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <h3 className="font-serif text-xl font-semibold text-gold-400">
                {editingHeroSlideIndex !== null ? "Editar Diapositiva de Portada" : "Nueva Diapositiva de Portada"}
              </h3>
              <button
                type="button"
                onClick={() => setIsHeroSlideFormOpen(false)}
                className="text-neutral-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {heroSlideFormError && (
                <div className="p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-xs rounded-sm mb-4 animate-in fade-in duration-200">
                  {heroSlideFormError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Tag Superior</label>
                  <input
                    type="text"
                    required
                    value={heroSlideTag}
                    onChange={(e) => setHeroSlideTag(e.target.value)}
                    placeholder="Ej. SOLO SERVICIO A DOMICILIO"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Título Principal</label>
                  <input
                    type="text"
                    required
                    value={heroSlideTitle}
                    onChange={(e) => setHeroSlideTitle(e.target.value)}
                    placeholder="Ej. DARK KITCHEN"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Descripción Corta</label>
                <textarea
                  rows={3}
                  required
                  value={heroSlideDescription}
                  onChange={(e) => setHeroSlideDescription(e.target.value)}
                  placeholder="Ej. Las mejores brasas merecen los mejores cortes."
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white resize-none"
                />
              </div>

              {/* Media Type Selection */}
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Tipo de Medio</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="heroMediaType"
                      checked={heroSlideMediaType === "IMAGE"}
                      onChange={() => {
                        setHeroSlideMediaType("IMAGE");
                        setHeroSlideMediaUrl("");
                      }}
                      className="accent-gold-400"
                    />
                    Imagen
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="radio"
                      name="heroMediaType"
                      checked={heroSlideMediaType === "VIDEO"}
                      onChange={() => {
                        setHeroSlideMediaType("VIDEO");
                        setHeroSlideMediaUrl("");
                      }}
                      className="accent-gold-400"
                    />
                    Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">
                  {heroSlideMediaType === "IMAGE" ? "Archivo de Imagen" : "Archivo de Video"}
                </label>
                {heroSlideMediaUrl ? (
                  <div className="relative aspect-video w-full border border-neutral-800 rounded-sm overflow-hidden group">
                    {heroSlideMediaType === "IMAGE" ? (
                      <img src={heroSlideMediaUrl} alt="Slide Preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={heroSlideMediaUrl} className="w-full h-full object-cover" muted playsInline controls />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setHeroSlideMediaUrl("")}
                        className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-xs uppercase font-bold tracking-wider rounded-sm transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar Medio
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-neutral-800 hover:border-gold-400/25 p-6 text-center transition-colors rounded-sm relative w-full">
                    <input
                      type="file"
                      accept={heroSlideMediaType === "IMAGE" ? "image/*" : "video/*"}
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setUploadingHeroMedia(true);
                        setHeroSlideFormError("");
                        try {
                          const url = await uploadImageFile(files[0]);
                          setHeroSlideMediaUrl(url);
                        } catch (err: any) {
                          setHeroSlideFormError(err.message || "Error al subir medio");
                        } finally {
                          setUploadingHeroMedia(false);
                        }
                      }}
                      disabled={uploadingHeroMedia}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {heroSlideMediaType === "IMAGE" ? (
                      <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    ) : (
                      <Film className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    )}
                    <span className="block text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                      {uploadingHeroMedia ? "Subiendo..." : heroSlideMediaType === "IMAGE" ? "Seleccionar Imagen" : "Seleccionar Video"}
                    </span>
                    <span className="text-[10px] text-neutral-600 block mt-1">
                      {heroSlideMediaType === "IMAGE" ? "Formatos: JPG, PNG, WebP" : "Formatos: MP4, WebM"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 shrink-0">
              <button
                type="submit"
                disabled={uploadingHeroMedia}
                className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-bold uppercase rounded-sm disabled:opacity-50"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setIsHeroSlideFormOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category deletion ConfirmModal */}
      <ConfirmModal
        isOpen={isDeleteCatConfirmOpen}
        title="Eliminar Categoría"
        message="¿Está seguro de eliminar esta categoría? Esto no afectará a los productos existentes."
        variant="danger"
        onConfirm={confirmDeleteCategory}
        onCancel={() => { setIsDeleteCatConfirmOpen(false); setPendingDeleteCatId(null); }}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />

      {/* Hero Slide deletion ConfirmModal */}
      <ConfirmModal
        isOpen={isDeleteHeroSlideConfirmOpen}
        title="Eliminar Diapositiva"
        message="¿Está seguro de eliminar esta diapositiva de portada? Esta acción no se puede deshacer."
        variant="danger"
        onConfirm={confirmDeleteHeroSlide}
        onCancel={() => { setIsDeleteHeroSlideConfirmOpen(false); setPendingDeleteHeroSlideIndex(null); }}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />

      {/* Testimonial deletion ConfirmModal */}
      <ConfirmModal
        isOpen={isDeleteTestimonialConfirmOpen}
        title="Eliminar Testimonio"
        message="¿Está seguro de eliminar este testimonio? Esta acción no se puede deshacer."
        variant="danger"
        onConfirm={confirmDeleteTestimonial}
        onCancel={() => { setIsDeleteTestimonialConfirmOpen(false); setPendingDeleteTestimonialIndex(null); }}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />

      {/* Gallery Image Editor Sub-Modal */}
      {isGalleryImageFormOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-sans text-white">
          <form onSubmit={handleSaveGalleryImage} className="w-full max-w-lg bg-[#111111] border border-neutral-800 rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <h3 className="font-serif text-xl font-semibold text-gold-400">
                {editingGalleryImageIndex !== null ? "Editar Imagen de Galería" : "Nueva Imagen de Galería"}
              </h3>
              <button
                type="button"
                onClick={() => setIsGalleryImageFormOpen(false)}
                className="text-neutral-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {galleryImageFormError && (
                <div className="p-3 bg-red-900/20 border border-red-900/50 text-red-400 text-xs rounded-sm mb-4 animate-in fade-in duration-200">
                  {galleryImageFormError}
                </div>
              )}

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Etiqueta de la Imagen</label>
                <input
                  type="text"
                  value={galleryImageLabel}
                  onChange={(e) => setGalleryImageLabel(e.target.value)}
                  placeholder="Ej. Ribeye Sonorense"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors rounded-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Imagen</label>
                {galleryImageUrl ? (
                  <div className="relative aspect-[4/3] w-full border border-neutral-800 rounded-sm overflow-hidden group">
                    <img src={galleryImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setGalleryImageUrl("")}
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
                        setUploadingGalleryMedia(true);
                        setGalleryImageFormError("");
                        try {
                          const url = await uploadImageFile(files[0]);
                          setGalleryImageUrl(url);
                        } catch (err: any) {
                          setGalleryImageFormError(err.message || "Error al subir imagen");
                        } finally {
                          setUploadingGalleryMedia(false);
                        }
                      }}
                      disabled={uploadingGalleryMedia}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <span className="block text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                      {uploadingGalleryMedia ? "Subiendo..." : "Seleccionar Imagen"}
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
                disabled={uploadingGalleryMedia}
                className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-bold uppercase rounded-sm disabled:opacity-50"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setIsGalleryImageFormOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Image deletion ConfirmModal */}
      <ConfirmModal
        isOpen={isDeleteGalleryImageConfirmOpen}
        title="Eliminar Imagen de Galería"
        message="¿Está seguro de eliminar esta imagen de la galería? Esta acción no se puede deshacer."
        variant="danger"
        onConfirm={confirmDeleteGalleryImage}
        onCancel={() => { setIsDeleteGalleryImageConfirmOpen(false); setPendingDeleteGalleryImageIndex(null); }}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
