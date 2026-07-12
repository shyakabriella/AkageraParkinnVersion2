// src/pages/dashboard/RestaurantSection.jsx
import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Upload,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Sun,
  Utensils,
  Eye,
  Edit2,
  Tag,
} from "lucide-react";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api").replace(/\/$/, "");
const APP_URL = API_URL.replace(/\/api$/, "");

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/storage/")) return `${APP_URL}${path}`;
  if (path.startsWith("storage/")) return `${APP_URL}/${path}`;
  return `${APP_URL}/storage/${path}`;
};

const getToken = () => {
  return sessionStorage.getItem("token") || localStorage.getItem("token") || localStorage.getItem("auth_token");
};

// ─── DEFAULT RESTAURANT CONTENT ──────────────────────────────────────────────
const DEFAULT_RESTAURANT_CONTENT = {
  hero: {
    title: "Dine with us",
    subtitle: "Restaurant — Order & Book",
    description: "Choose from our menu, add a custom request, and either buy now or reserve a table.",
  },
};

// ─── PREVIEW ──────────────────────────────────────────────────────────────────
function RestaurantPreview({ data, categories, items, onClose }) {
  const content = data || {};
  const hero = content.hero || {};

  return (
    <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-stone-700">Restaurant Preview</span>
            <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">Website View</span>
          </div>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition text-sm font-medium">
            <X className="h-4 w-4" /> Close Preview
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-emerald-800 to-emerald-600 h-[300px]">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{hero.title || "Dine with us"}</h1>
            <p className="mt-2 text-lg text-white/80">{hero.subtitle || ""}</p>
            <p className="mt-3 text-sm text-white/70 max-w-2xl">{hero.description || ""}</p>
          </div>
        </div>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-stone-800 text-center mb-6">Categories</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <span key={cat.id} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-200">
                  {cat.icon} {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        {items && items.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-stone-800 text-center mb-6">Menu Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const img = getImageUrl(item.image);
                const category = categories?.find(c => c.id === item.category_id);
                return (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition">
                    {img ? <img src={img} alt={item.name} className="w-full h-48 object-cover" /> : <div className="w-full h-48 bg-stone-100 flex items-center justify-center"><Utensils className="h-12 w-12 text-stone-300" /></div>}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-stone-800">{item.name}</h3>
                          {category && <p className="text-xs text-emerald-600">{category.name}</p>}
                        </div>
                        <span className="font-bold text-emerald-700">RWF {item.price}</span>
                      </div>
                      <p className="text-sm text-stone-500 mt-2 line-clamp-2">{item.description}</p>
                      {item.is_available ? <span className="text-xs text-emerald-600 mt-2 inline-block">✅ Available</span> : <span className="text-xs text-red-500 mt-2 inline-block">❌ Unavailable</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HERO EDITOR ─────────────────────────────────────────────────────────────
function HeroEditor({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Title</label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
              placeholder="Title..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Subtitle</label>
            <input
              type="text"
              value={data.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition"
              placeholder="Subtitle..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label>
            <textarea
              value={data.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              rows={3}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y transition"
              placeholder="Description..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function RestaurantSectionManager() {
  const [pageData, setPageData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('page');

  // ─── Category Form State ──────────────────────────────────────────────────
  const [categoryForm, setCategoryForm] = useState({ name: "", icon: "🍽️", description: "", is_active: true });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // ─── Item Form State ─────────────────────────────────────────────────────
  const [itemForm, setItemForm] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    image: null,
    image_preview: null,
    is_available: true,
    is_active: true,
    preparation_time: "",
    calories: "",
    spicy_level: "None",
    allergens: [],
    dietary_info: [],
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRestaurantPage(),
        fetchCategories(),
        fetchItems(),
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load restaurant data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantPage = async () => {
    try {
      const token = getToken();
      const headers = { Accept: "application/json", ...(token && { Authorization: `Bearer ${token}` }) };
      const res = await fetch(`${API_URL}/restaurant`, { headers });
      const result = await res.json();
      
      if (result.success && result.data) {
        setPageData(result.data);
        const sections = Object.keys(result.data.content || {});
        if (sections.length > 0) setExpandedSections({ [sections[0]]: true });
      } else {
        setPageData({
          id: null,
          slug: "restaurant",
          name: "Restaurant",
          content: DEFAULT_RESTAURANT_CONTENT,
          seo: { title: "Restaurant - Akagera Park Inn", description: "Dine with us.", keywords: "Restaurant, Akagera Park Inn" },
          is_active: true,
        });
        setExpandedSections({ hero: true });
      }
    } catch (err) {
      console.error("Error fetching restaurant page:", err);
      setPageData({
        id: null,
        slug: "restaurant",
        name: "Restaurant",
        content: DEFAULT_RESTAURANT_CONTENT,
        seo: { title: "Restaurant - Akagera Park Inn", description: "Dine with us.", keywords: "Restaurant, Akagera Park Inn" },
        is_active: true,
      });
      setExpandedSections({ hero: true });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/restaurant/categories`);
      const result = await res.json();
      if (result.success) {
        setCategories(result.data || []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/restaurant/items`);
      const result = await res.json();
      if (result.success) {
        setItems(result.data || []);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems([]);
    }
  };

  // ─── Page Content ──────────────────────────────────────────────────────────
  const updateSection = (sectionName, field, value) => {
    setPageData((prev) => {
      const newContent = { ...prev.content };
      newContent[sectionName] = { ...newContent[sectionName], [field]: value };
      return { ...prev, content: newContent };
    });
    setSaved(false);
    setError(null);
  };

  const savePageContent = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Please login first");

      const payload = {
        content: pageData.content,
        seo: pageData.seo || {},
        is_active: true,
      };

      const isUpdate = Boolean(pageData.id);
      const url = isUpdate ? `${API_URL}/admin/restaurant/section/hero` : `${API_URL}/admin/restaurant/pages`;
      
      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(isUpdate ? { data: pageData.content.hero } : payload),
      });
      
      const result = await response.json();
      if (response.ok && result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchRestaurantPage();
      } else {
        setError(result.message || "Error saving page content");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save page content");
    } finally {
      setSaving(false);
    }
  };

  // ─── Categories CRUD ──────────────────────────────────────────────────────
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Please login first");

      const url = editingCategoryId
        ? `${API_URL}/admin/restaurant/categories/${editingCategoryId}`
        : `${API_URL}/admin/restaurant/categories`;
      const method = editingCategoryId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(categoryForm),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchCategories();
        setShowCategoryForm(false);
        setCategoryForm({ name: "", icon: "🍽️", description: "", is_active: true });
        setEditingCategoryId(null);
      } else {
        setError(result.message || "Error saving category");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/admin/restaurant/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const result = await response.json();
      if (result.success) {
        await fetchCategories();
        await fetchItems();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.message || "Error deleting category");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete category");
    }
  };

  const editCategory = (category) => {
    setCategoryForm({ name: category.name, icon: category.icon || "🍽️", description: category.description || "", is_active: category.is_active });
    setEditingCategoryId(category.id);
    setShowCategoryForm(true);
  };

  // ─── Items CRUD ────────────────────────────────────────────────────────────
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Please login first");

      const formData = new FormData();
      
      // Add all text fields
      formData.append("category_id", parseInt(itemForm.category_id));
      formData.append("name", itemForm.name.trim());
      formData.append("description", itemForm.description?.trim() || "");
      formData.append("price", parseFloat(itemForm.price));
      formData.append("is_available", itemForm.is_available ? "1" : "0");
      formData.append("is_active", itemForm.is_active ? "1" : "0");
      formData.append("preparation_time", itemForm.preparation_time?.trim() || "");
      formData.append("spicy_level", itemForm.spicy_level || "None");
      
      if (itemForm.calories && itemForm.calories !== "") {
        formData.append("calories", parseInt(itemForm.calories));
      }

      // Handle array fields - send as JSON strings
      formData.append("allergens", JSON.stringify(itemForm.allergens || []));
      formData.append("dietary_info", JSON.stringify(itemForm.dietary_info || []));

      // Handle image upload
      if (itemForm.image instanceof File) {
        formData.append("image", itemForm.image);
      }

      // For edit, add _method PUT
      if (editingItemId) {
        formData.append("_method", "PUT");
      }

      const url = editingItemId
        ? `${API_URL}/admin/restaurant/items/${editingItemId}`
        : `${API_URL}/admin/restaurant/items`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchItems();
        setShowItemForm(false);
        resetItemForm();
        setEditingItemId(null);
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(", ");
          setError(`Validation Error: ${errorMessages}`);
        } else {
          setError(result.message || "Error saving item");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const resetItemForm = () => {
    setItemForm({
      category_id: "",
      name: "",
      description: "",
      price: "",
      image: null,
      image_preview: null,
      is_available: true,
      is_active: true,
      preparation_time: "",
      calories: "",
      spicy_level: "None",
      allergens: [],
      dietary_info: [],
    });
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/admin/restaurant/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const result = await response.json();
      if (result.success) {
        await fetchItems();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.message || "Error deleting item");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete item");
    }
  };

  const editItem = (item) => {
    setItemForm({
      category_id: item.category_id || item.category?.id || "",
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      image: null,
      image_preview: getImageUrl(item.image),
      is_available: item.is_available !== undefined ? item.is_available : true,
      is_active: item.is_active !== undefined ? item.is_active : true,
      preparation_time: item.preparation_time || "",
      calories: item.calories || "",
      spicy_level: item.spicy_level || "None",
      allergens: item.allergens || [],
      dietary_info: item.dietary_info || [],
    });
    setEditingItemId(item.id);
    setShowItemForm(true);
  };

  const handleItemImageUpload = (file) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) { 
      setError("Please select a valid image (JPEG, PNG, WebP)"); 
      return; 
    }
    if (file.size > 5 * 1024 * 1024) { 
      setError("Image size must be less than 5MB"); 
      return; 
    }
    const previewUrl = URL.createObjectURL(file);
    setItemForm((prev) => ({ ...prev, image: file, image_preview: previewUrl }));
  };

  const removeItemImage = () => {
    if (itemForm.image_preview?.startsWith("blob:")) {
      URL.revokeObjectURL(itemForm.image_preview);
    }
    setItemForm((prev) => ({ ...prev, image: null, image_preview: null }));
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  const openPreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  const handleReset = () => {
    fetchAllData();
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
      </div>
    );
  }

  const sections = Object.keys(pageData?.content || {});

  return (
    <div className="min-h-screen bg-stone-100 pb-16">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');`}</style>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-emerald-950 text-stone-50 shadow-lg shadow-emerald-950/10 rounded-b-3xl border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Akagera Park Inn</p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-white">
              Restaurant Manager
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {saved && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-800/60 px-3 py-1.5 text-sm font-medium text-emerald-100">
                <Check size={15} /> Saved
              </span>
            )}
            <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-700/60 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-900 transition">
              <RotateCcw size={15} /> Reset
            </button>
            <button onClick={openPreview} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition bg-emerald-700 text-white hover:bg-emerald-800">
              <Eye size={15} /> View Preview
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
          {[
            { id: 'page', label: 'Page Content', icon: Sun },
            { id: 'categories', label: 'Categories', icon: Tag },
            { id: 'items', label: 'Menu Items', icon: Utensils },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-6 space-y-6">
        {error && (
          <div className="rounded-xl border-2 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* ─── PAGE CONTENT TAB ────────────────────────────────────────────── */}
        {activeTab === 'page' && (
          <div className="relative pl-14">
            <div className="absolute left-[27px] top-3 bottom-3 w-px bg-emerald-200" aria-hidden="true" />
            <div className="space-y-4">
              {sections.map((sectionName, idx) => {
                const isExpanded = expandedSections[sectionName] || false;
                const sectionData = pageData?.content[sectionName] || {};
                const meta = { label: "Hero", blurb: "Restaurant hero section", icon: Sun };
                const Icon = meta.icon;

                return (
                  <div key={sectionName} className="relative">
                    <div className={`absolute -left-14 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 ${isExpanded ? "border-amber-500 bg-amber-50 text-amber-600" : "border-emerald-200 bg-white text-emerald-700"}`}>
                      <Icon size={16} />
                    </div>
                    <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition">
                      <button onClick={() => toggleSection(sectionName)} className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-stone-400">{String(idx + 1).padStart(2, "0")}</span>
                          <div>
                            <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="font-semibold text-stone-800">{meta.label}</p>
                            <p className="text-xs text-stone-400">{meta.blurb}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-stone-400">{isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}</div>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-stone-100 p-6">
                          <HeroEditor
                            data={sectionData}
                            onChange={(field, value) => updateSection(sectionName, field, value)}
                          />
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={savePageContent}
                              disabled={saving}
                              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${saving ? "bg-stone-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
                            >
                              {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={15} />}
                              {saving ? "Saving..." : "Save Page Content"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── CATEGORIES TAB ──────────────────────────────────────────────── */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-800">Categories</h2>
                <p className="text-sm text-stone-500">Manage restaurant categories</p>
              </div>
              <button
                onClick={() => { setShowCategoryForm(true); setEditingCategoryId(null); setCategoryForm({ name: "", icon: "🍽️", description: "", is_active: true }); }}
                className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800 transition"
              >
                <Plus size={16} /> Add Category
              </button>
            </div>

            {/* Category Form */}
            {showCategoryForm && (
              <div className="bg-white rounded-2xl border-2 border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-stone-800">{editingCategoryId ? "Edit Category" : "New Category"}</h3>
                  <button onClick={() => setShowCategoryForm(false)} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Name *</label>
                    <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="Category name" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Icon</label>
                    <input type="text" value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="🍽️" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
                    <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="Category description" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3">
                    <label className="text-sm font-medium text-stone-700">Active</label>
                    <button type="button" onClick={() => setCategoryForm({ ...categoryForm, is_active: !categoryForm.is_active })} className={`relative h-6 w-12 rounded-full transition-colors ${categoryForm.is_active ? "bg-emerald-500" : "bg-stone-300"}`}>
                      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${categoryForm.is_active ? "translate-x-7" : "translate-x-1"}`} />
                    </button>
                  </div>
                  <div className="md:col-span-2 flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">
                      {saving ? "Saving..." : editingCategoryId ? "Update" : "Create"}
                    </button>
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="px-6 py-2 border-2 border-stone-200 rounded-xl hover:bg-stone-50 transition">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl border-2 border-stone-200 p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon || "🍽️"}</span>
                      <div>
                        <h3 className="font-semibold text-stone-800">{cat.name}</h3>
                        <p className="text-xs text-stone-500">{cat.items_count || 0} items</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => editCategory(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit2 size={14} /></button>
                      <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {cat.description && <p className="text-sm text-stone-500 mt-2">{cat.description}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cat.is_active ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                      {cat.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {categories.length === 0 && (
              <div className="text-center py-12 text-stone-400">
                <Tag size={48} className="mx-auto mb-3 opacity-50" />
                <p>No categories yet</p>
                <p className="text-sm">Click "Add Category" to create one</p>
              </div>
            )}
          </div>
        )}

        {/* ─── ITEMS TAB ────────────────────────────────────────────────────── */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-800">Menu Items</h2>
                <p className="text-sm text-stone-500">Manage restaurant menu items</p>
              </div>
              <button
                onClick={() => { setShowItemForm(true); setEditingItemId(null); resetItemForm(); }}
                className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800 transition"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>

            {/* Item Form */}
            {showItemForm && (
              <div className="bg-white rounded-2xl border-2 border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-stone-800">{editingItemId ? "Edit Item" : "New Item"}</h3>
                  <button onClick={() => { setShowItemForm(false); resetItemForm(); setEditingItemId(null); }} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleItemSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Category *</label>
                    <select value={itemForm.category_id} onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" required>
                      <option value="">Select category</option>
                      {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Name *</label>
                    <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="Item name" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
                    <textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} rows={2} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="Item description" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Price (RWF) *</label>
                    <input type="number" step="0.01" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="15000" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Preparation Time</label>
                    <input type="text" value={itemForm.preparation_time} onChange={(e) => setItemForm({ ...itemForm, preparation_time: e.target.value })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="20-30 min" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Calories</label>
                    <input type="number" value={itemForm.calories} onChange={(e) => setItemForm({ ...itemForm, calories: e.target.value })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="350" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Spicy Level</label>
                    <select value={itemForm.spicy_level} onChange={(e) => setItemForm({ ...itemForm, spicy_level: e.target.value })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20">
                      <option value="None">None</option>
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Hot">Hot</option>
                      <option value="Very Hot">Very Hot</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Allergens</label>
                    <input type="text" value={itemForm.allergens.join(", ")} onChange={(e) => setItemForm({ ...itemForm, allergens: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="Gluten, Dairy" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Dietary Info</label>
                    <input type="text" value={itemForm.dietary_info.join(", ")} onChange={(e) => setItemForm({ ...itemForm, dietary_info: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20" placeholder="Vegan, Gluten-Free" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-stone-700">Item Image</label>
                    <div className="flex items-center gap-4">
                      {itemForm.image_preview && <img src={itemForm.image_preview} alt="Item" className="h-20 w-20 rounded-xl object-cover" />}
                      <div className="flex gap-2">
                        <label className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-sm">
                          Upload
                          <input type="file" accept="image/*" onChange={(e) => handleItemImageUpload(e.target.files[0])} className="hidden" />
                        </label>
                        {itemForm.image_preview && <button type="button" onClick={removeItemImage} className="px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition text-sm">Remove</button>}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-stone-700">Available</label>
                      <button type="button" onClick={() => setItemForm({ ...itemForm, is_available: !itemForm.is_available })} className={`relative h-6 w-12 rounded-full transition-colors ${itemForm.is_available ? "bg-green-500" : "bg-stone-300"}`}>
                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${itemForm.is_available ? "translate-x-7" : "translate-x-1"}`} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-stone-700">Active</label>
                      <button type="button" onClick={() => setItemForm({ ...itemForm, is_active: !itemForm.is_active })} className={`relative h-6 w-12 rounded-full transition-colors ${itemForm.is_active ? "bg-emerald-500" : "bg-stone-300"}`}>
                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${itemForm.is_active ? "translate-x-7" : "translate-x-1"}`} />
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">
                      {saving ? "Saving..." : editingItemId ? "Update" : "Create"}
                    </button>
                    <button type="button" onClick={() => { setShowItemForm(false); resetItemForm(); setEditingItemId(null); }} className="px-6 py-2 border-2 border-stone-200 rounded-xl hover:bg-stone-50 transition">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const img = getImageUrl(item.image);
                const category = categories.find(c => c.id === item.category_id);
                return (
                  <div key={item.id} className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden hover:shadow-md transition">
                    {img ? <img src={img} alt={item.name} className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-stone-100 flex items-center justify-center"><Utensils size={40} className="text-stone-300" /></div>}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-stone-800">{item.name}</h3>
                          {category && <p className="text-xs text-emerald-600">{category.name}</p>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => editItem(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit2 size={14} /></button>
                          <button onClick={() => deleteItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p className="text-sm text-stone-500 mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-emerald-700">RWF {item.price}</span>
                        <div className="flex gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_available ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                            {item.is_available ? "Available" : "Unavailable"}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      {item.preparation_time && <div className="mt-1 text-xs text-stone-400">⏱ {item.preparation_time}</div>}
                      {(item.allergens?.length > 0 || item.dietary_info?.length > 0) && (
                        <div className="mt-1 text-xs text-stone-400">
                          {item.allergens?.length > 0 && <span className="mr-2">⚠️ {item.allergens.join(", ")}</span>}
                          {item.dietary_info?.length > 0 && <span>🌿 {item.dietary_info.join(", ")}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {items.length === 0 && (
              <div className="text-center py-12 text-stone-400">
                <Utensils size={48} className="mx-auto mb-3 opacity-50" />
                <p>No menu items yet</p>
                <p className="text-sm">Click "Add Item" to create one</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <RestaurantPreview
          data={pageData?.content}
          categories={categories}
          items={items}
          onClose={closePreview}
        />
      )}
    </div>
  );
}