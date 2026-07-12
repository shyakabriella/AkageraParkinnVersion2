// src/pages/dashboard/FooterSection.jsx
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
  Eye,
  MapPin,
  Phone,
  Mail,
  Clock,
  Link,
  Image,
} from "lucide-react";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api").replace(/\/$/, "");
const APP_URL = API_URL.replace(/\/api$/, "");

const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/storage/")) return `${APP_URL}${path}`;
  if (path.startsWith("storage/")) return `${APP_URL}/${path}`;
  return `${APP_URL}/storage/${path}`;
};

const getToken = () => {
  return sessionStorage.getItem("token") || localStorage.getItem("token") || localStorage.getItem("auth_token");
};

const IMAGE_KEYS = new Set(["background_image", "image", "logo", "avatar_image"]);

function stripFilesForSubmit(node, formData, pathParts) {
  if (Array.isArray(node)) {
    return node.map((item, idx) => stripFilesForSubmit(item, formData, [...pathParts, idx]));
  }
  if (node && typeof node === "object" && !(node instanceof File)) {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (key.endsWith("_preview")) continue;
      if (IMAGE_KEYS.has(key) && value instanceof File) {
        const fieldPath = [...pathParts, key];
        formData.append(`images${fieldPath.map((p) => `[${p}]`).join("")}`, value);
        out[key] = '__FILE_REPLACE__';
      } else {
        out[key] = stripFilesForSubmit(value, formData, [...pathParts, key]);
      }
    }
    return out;
  }
  return node;
}

// ─── DEFAULT FOOTER CONTENT ──────────────────────────────────────────────
const DEFAULT_FOOTER_CONTENT = {
  footer: {
    company: {
      name: "Akagera Park Inn",
      description: "Near Akagera National Park • Calm stays • Pool & garden.",
      logo: "/images/logo.png",
      address: "3MGF+4HF Akagera Village, Akagera, Rwanda",
    },
    quick_links: {
      title: "Explore",
      links: [
        { label: "About Us", url: "/about" },
        { label: "Rooms", url: "/rooms" },
        { label: "Services", url: "/services" },
        { label: "Restaurant", url: "/restaurant" },
        { label: "Gallery", url: "/gallery" },
      ],
    },
    book_section: {
      title: "Book",
      links: [
        { label: "Reserve a Room", url: "/booking" },
        { label: "View Rooms", url: "/rooms" },
        { label: "Restaurant", url: "/restaurant" },
        { label: "Guest Reviews", url: "/reviews" },
      ],
    },
    contact: {
      title: "Contact",
      phone: "+250 788 471 880",
      phone_alt: "+250 793 842 491",
      email: "info@akageraparkinn.com",
      address: "3MGF+4HF Akagera Village, Akagera, Rwanda",
      check_in_time: "Check-in 11:00",
    },
    social: {
      title: "Follow Us",
      links: [
        { platform: "Facebook", icon: "facebook", url: "https://facebook.com/akageraparkinn" },
        { platform: "Twitter", icon: "twitter", url: "https://twitter.com/akageraparkinn" },
        { platform: "Instagram", icon: "instagram", url: "https://instagram.com/akageraparkinn" },
        { platform: "Youtube", icon: "youtube", url: "https://youtube.com/akageraparkinn" },
      ],
    },
    copyright: {
      text: "© 2026 Akagera Park Inn — All rights reserved.",
    },
  },
};

// ─── IMAGE DROPZONE ──────────────────────────────────────────────────────────
function ImageDropzone({ label, preview, uploading, height, onUpload, onRemove, compact, small }) {
  const safePreview = preview && typeof preview === 'string' ? preview : null;
  
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</label>
      <div className={`rounded-2xl border-4 border-dashed border-stone-300 bg-white ${small ? "p-2" : "p-4"} hover:border-emerald-500 transition`}>
        {safePreview ? (
          <div className="relative group">
            <img 
              src={safePreview} 
              alt={label} 
              className={`${height} w-full rounded-xl object-cover`} 
              onError={(e) => { e.target.src = "https://placehold.co/800x400?text=Image+Not+Found"; }} 
            />
            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 rounded-xl transition flex items-center justify-center gap-2">
              <button onClick={onRemove} className="rounded-full bg-rose-500 p-2 text-white hover:bg-rose-600 transition"><Trash2 size={compact ? 14 : 16} /></button>
              <label className="cursor-pointer">
                <div className="rounded-full bg-emerald-600 p-2 text-white hover:bg-emerald-700 transition"><Upload size={compact ? 14 : 16} /></div>
                <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <div className={`flex flex-col items-center justify-center ${height} rounded-xl border-4 border-dashed border-stone-300 hover:border-emerald-500 transition`}>
              {uploading ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" /> : <><Upload size={compact ? 20 : 28} className="text-stone-400" /><p className="mt-2 text-xs text-stone-500">Click to upload</p></>}
            </div>
            <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files[0])} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}

// ─── FOOTER PREVIEW ──────────────────────────────────────────────────────────
function FooterPreview({ data, onClose }) {
  const content = data || {};
  const footer = content.footer || {};
  const company = footer.company || {};
  const quickLinks = footer.quick_links || {};
  const bookSection = footer.book_section || {};
  const contact = footer.contact || {};
  const social = footer.social || {};
  const copyright = footer.copyright || {};

  // ✅ Use Link icon for all social links (since Facebook, Twitter, etc. don't exist in lucide-react)
  const socialIcons = {
    facebook: Link,
    twitter: Link,
    instagram: Link,
    youtube: Link,
    link: Link,
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-stone-700">Footer Preview</span>
            <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">Website View</span>
          </div>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition text-sm font-medium">
            <X className="h-4 w-4" /> Close Preview
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Footer */}
        <div className="bg-emerald-950 text-white rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8 lg:p-12">
            {/* Company Info */}
            <div>
              {company.logo && (
                <img src={getImageUrl(company.logo)} alt={company.name} className="h-12 w-auto mb-4" />
              )}
              <h3 className="text-xl font-bold mb-2">{company.name}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{company.description}</p>
              <div className="flex items-center gap-2 mt-3 text-white/60 text-sm">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{company.address}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white/90 mb-3">{quickLinks.title || "Explore"}</h4>
              <ul className="space-y-2">
                {(quickLinks.links || []).map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-white/60 hover:text-white text-sm transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Book Section */}
            <div>
              <h4 className="font-semibold text-white/90 mb-3">{bookSection.title || "Book"}</h4>
              <ul className="space-y-2">
                {(bookSection.links || []).map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-white/60 hover:text-white text-sm transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white/90 mb-3">{contact.title || "Contact"}</h4>
              <ul className="space-y-2 text-sm">
                {contact.phone && (
                  <li className="flex items-center gap-2 text-white/60">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">{contact.phone}</a>
                  </li>
                )}
                {contact.phone_alt && (
                  <li className="flex items-center gap-2 text-white/60 pl-6">
                    <a href={`tel:${contact.phone_alt}`} className="hover:text-white transition-colors">{contact.phone_alt}</a>
                  </li>
                )}
                {contact.email && (
                  <li className="flex items-center gap-2 text-white/60">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a>
                  </li>
                )}
                {contact.address && (
                  <li className="flex items-center gap-2 text-white/60">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{contact.address}</span>
                  </li>
                )}
                {contact.check_in_time && (
                  <li className="flex items-center gap-2 text-white/60">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{contact.check_in_time}</span>
                  </li>
                )}
              </ul>

              {/* Social Links */}
              {(social.links && social.links.length > 0) && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-white/80 mb-2">{social.title || "Follow Us"}</h5>
                  <div className="flex gap-3">
                    {(social.links || []).map((link, index) => {
                      const Icon = socialIcons[link.icon] || Link;
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                          <Icon className="h-4 w-4 text-white/70" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 px-8 lg:px-12 py-4 text-center">
            <p className="text-white/40 text-sm">{copyright.text || "© 2026 Akagera Park Inn — All rights reserved."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER EDITOR ──────────────────────────────────────────────────────────
function FooterEditor({ data, onChange, onImageUpload, onRemoveImage, isUploading }) {
  const company = data.company || {};
  const quickLinks = data.quick_links || {};
  const bookSection = data.book_section || {};
  const contact = data.contact || {};
  const social = data.social || {};
  const copyright = data.copyright || {};

  // ─── Company ──────────────────────────────────────────────────────────────
  const updateCompany = (field, value) => {
    onChange("company", { ...company, [field]: value });
  };

  // ─── Quick Links ──────────────────────────────────────────────────────────
  const addQuickLink = () => {
    const links = [...(quickLinks.links || [])];
    links.push({ label: "", url: "" });
    onChange("quick_links", { ...quickLinks, links });
  };

  const updateQuickLink = (index, field, value) => {
    const links = [...(quickLinks.links || [])];
    links[index] = { ...links[index], [field]: value };
    onChange("quick_links", { ...quickLinks, links });
  };

  const removeQuickLink = (index) => {
    const links = [...(quickLinks.links || [])];
    links.splice(index, 1);
    onChange("quick_links", { ...quickLinks, links });
  };

  // ─── Book Links ──────────────────────────────────────────────────────────
  const addBookLink = () => {
    const links = [...(bookSection.links || [])];
    links.push({ label: "", url: "" });
    onChange("book_section", { ...bookSection, links });
  };

  const updateBookLink = (index, field, value) => {
    const links = [...(bookSection.links || [])];
    links[index] = { ...links[index], [field]: value };
    onChange("book_section", { ...bookSection, links });
  };

  const removeBookLink = (index) => {
    const links = [...(bookSection.links || [])];
    links.splice(index, 1);
    onChange("book_section", { ...bookSection, links });
  };

  // ─── Social Links ──────────────────────────────────────────────────────────
  const addSocialLink = () => {
    const links = [...(social.links || [])];
    links.push({ platform: "", icon: "link", url: "" });
    onChange("social", { ...social, links });
  };

  const updateSocialLink = (index, field, value) => {
    const links = [...(social.links || [])];
    links[index] = { ...links[index], [field]: value };
    onChange("social", { ...social, links });
  };

  const removeSocialLink = (index) => {
    const links = [...(social.links || [])];
    links.splice(index, 1);
    onChange("social", { ...social, links });
  };

  return (
    <div className="space-y-6">
      {/* Company Info */}
      <div className="rounded-xl border-2 border-stone-200 p-4 bg-stone-50">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <Image className="h-4 w-4" /> Company Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Company Name</label>
            <input
              type="text"
              value={company.name || ""}
              onChange={(e) => updateCompany("name", e.target.value)}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="Akagera Park Inn"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Logo</label>
            <ImageDropzone
              label="Logo"
              small
              preview={company.logo_preview || getImageUrl(company.logo)}
              uploading={isUploading(undefined, "logo")}
              height="h-20"
              onUpload={(file) => onImageUpload(file, undefined, "logo")}
              onRemove={() => updateCompany("logo", null)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
            <textarea
              value={company.description || ""}
              onChange={(e) => updateCompany("description", e.target.value)}
              rows={2}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 resize-y"
              placeholder="Near Akagera National Park • Calm stays • Pool & garden."
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">Address</label>
            <input
              type="text"
              value={company.address || ""}
              onChange={(e) => updateCompany("address", e.target.value)}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="3MGF+4HF Akagera Village, Akagera, Rwanda"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-xl border-2 border-stone-200 p-4 bg-stone-50">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <Link className="h-4 w-4" /> Quick Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">Section Title</label>
            <input
              type="text"
              value={quickLinks.title || ""}
              onChange={(e) => onChange("quick_links", { ...quickLinks, title: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="Explore"
            />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-stone-700">Links</label>
            <button onClick={addQuickLink} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700 transition">
              <Plus size={12} /> Add Link
            </button>
          </div>
          <div className="space-y-2">
            {(quickLinks.links || []).map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link.label || ""}
                  onChange={(e) => updateQuickLink(index, "label", e.target.value)}
                  className="flex-1 rounded-lg border-2 border-stone-200 px-3 py-1.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.url || ""}
                  onChange={(e) => updateQuickLink(index, "url", e.target.value)}
                  className="flex-1 rounded-lg border-2 border-stone-200 px-3 py-1.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  placeholder="/about"
                />
                <button onClick={() => removeQuickLink(index)} className="text-rose-500 hover:text-rose-700">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Section */}
      <div className="rounded-xl border-2 border-stone-200 p-4 bg-stone-50">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <Link className="h-4 w-4" /> Book Section
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">Section Title</label>
            <input
              type="text"
              value={bookSection.title || ""}
              onChange={(e) => onChange("book_section", { ...bookSection, title: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="Book"
            />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-stone-700">Links</label>
            <button onClick={addBookLink} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700 transition">
              <Plus size={12} /> Add Link
            </button>
          </div>
          <div className="space-y-2">
            {(bookSection.links || []).map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link.label || ""}
                  onChange={(e) => updateBookLink(index, "label", e.target.value)}
                  className="flex-1 rounded-lg border-2 border-stone-200 px-3 py-1.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.url || ""}
                  onChange={(e) => updateBookLink(index, "url", e.target.value)}
                  className="flex-1 rounded-lg border-2 border-stone-200 px-3 py-1.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  placeholder="/booking"
                />
                <button onClick={() => removeBookLink(index)} className="text-rose-500 hover:text-rose-700">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border-2 border-stone-200 p-4 bg-stone-50">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <Phone className="h-4 w-4" /> Contact Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Section Title</label>
            <input
              type="text"
              value={contact.title || ""}
              onChange={(e) => onChange("contact", { ...contact, title: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="Contact"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Phone</label>
            <input
              type="text"
              value={contact.phone || ""}
              onChange={(e) => onChange("contact", { ...contact, phone: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="+250 788 471 880"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Alternative Phone</label>
            <input
              type="text"
              value={contact.phone_alt || ""}
              onChange={(e) => onChange("contact", { ...contact, phone_alt: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="+250 793 842 491"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
            <input
              type="email"
              value={contact.email || ""}
              onChange={(e) => onChange("contact", { ...contact, email: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="info@akageraparkinn.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">Address</label>
            <input
              type="text"
              value={contact.address || ""}
              onChange={(e) => onChange("contact", { ...contact, address: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="3MGF+4HF Akagera Village, Akagera, Rwanda"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">Check-in Time</label>
            <input
              type="text"
              value={contact.check_in_time || ""}
              onChange={(e) => onChange("contact", { ...contact, check_in_time: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="Check-in 11:00"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-xl border-2 border-stone-200 p-4 bg-stone-50">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <Link className="h-4 w-4" /> Social Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">Section Title</label>
            <input
              type="text"
              value={social.title || ""}
              onChange={(e) => onChange("social", { ...social, title: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              placeholder="Follow Us"
            />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-stone-700">Social Links</label>
            <button onClick={addSocialLink} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700 transition">
              <Plus size={12} /> Add Social Link
            </button>
          </div>
          <div className="space-y-2">
            {(social.links || []).map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={link.icon || "link"}
                  onChange={(e) => updateSocialLink(index, "icon", e.target.value)}
                  className="rounded-lg border-2 border-stone-200 px-3 py-1.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">Youtube</option>
                  <option value="link">Other</option>
                </select>
                <input
                  type="text"
                  value={link.url || ""}
                  onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                  className="flex-1 rounded-lg border-2 border-stone-200 px-3 py-1.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  placeholder="https://..."
                />
                <button onClick={() => removeSocialLink(index)} className="text-rose-500 hover:text-rose-700">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="rounded-xl border-2 border-stone-200 p-4 bg-stone-50">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <Link className="h-4 w-4" /> Copyright
        </h3>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Copyright Text</label>
          <input
            type="text"
            value={copyright.text || ""}
            onChange={(e) => onChange("copyright", { ...copyright, text: e.target.value })}
            className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            placeholder="© 2026 Akagera Park Inn — All rights reserved."
          />
        </div>
      </div>
    </div>
  );
}

const sectionMeta = {
  footer: { label: "Footer", blurb: "Website footer content", icon: Sun },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function FooterSection() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [uploading, setUploading] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => { fetchFooterPage(); }, []);

  const fetchFooterPage = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { Accept: "application/json", ...(token && { Authorization: `Bearer ${token}` }) };
      const res = await fetch(`${API_URL}/footer`, { headers });
      const result = await res.json();
      
      if (result.success && result.data) {
        setPageData(result.data);
        const sections = Object.keys(result.data.content || {});
        if (sections.length > 0) setExpandedSections({ [sections[0]]: true });
      } else {
        setPageData({ 
          id: null, 
          slug: "footer", 
          name: "Footer", 
          content: DEFAULT_FOOTER_CONTENT, 
          seo: { title: "Footer - Akagera Park Inn", description: "Website footer.", keywords: "Footer, Akagera Park Inn" }, 
          is_active: true 
        });
        setExpandedSections({ footer: true });
      }
    } catch (err) { 
      console.error(err); 
      setError("Failed to load footer data"); 
    } finally { 
      setLoading(false); 
    }
  };

  const updateSection = (sectionName, field, value) => {
    setPageData((prev) => {
      const newContent = { ...prev.content };
      newContent[sectionName] = { ...newContent[sectionName], [field]: value };
      return { ...prev, content: newContent };
    });
    setHasChanges(true);
    setSaved(false);
    setError(null);
  };

  const handleImageUpload = (sectionName, file, index, field = "logo") => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) { setError("Please select a valid image (JPEG, PNG, WebP, SVG)"); return; }
    if (file.size > 2 * 1024 * 1024) { setError("Image size must be less than 2MB"); return; }

    const key = `${sectionName}_${index}_${field}`;
    setUploading((prev) => ({ ...prev, [key]: true }));
    const previewUrl = URL.createObjectURL(file);
    setPageData((prev) => {
      const newContent = { ...prev.content };
      const section = { ...newContent[sectionName] };
      const item = { ...section[field] };
      item[field] = file;
      item[field + "_preview"] = previewUrl;
      section[field] = item;
      newContent[sectionName] = section;
      return { ...prev, content: newContent };
    });
    setHasChanges(true);
    setSaved(false);
    setUploading((prev) => ({ ...prev, [key]: false }));
  };

  const removeImage = (sectionName, index, field = "logo") => {
    setPageData((prev) => {
      const newContent = { ...prev.content };
      const section = { ...newContent[sectionName] };
      if (section[field] && section[field][field + "_preview"]?.startsWith("blob:")) {
        URL.revokeObjectURL(section[field][field + "_preview"]);
      }
      section[field] = { ...section[field], [field]: null, [field + "_preview"]: null };
      newContent[sectionName] = section;
      return { ...prev, content: newContent };
    });
    setHasChanges(true);
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  const openPreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  const saveToBackend = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Please login first");
      const formData = new FormData();
      formData.append("slug", pageData.slug);
      formData.append("name", pageData.name);
      formData.append("is_active", "1");
      formData.append("seo", JSON.stringify(pageData.seo || {}));
      const cleanContent = {};
      for (const [sectionName, sectionData] of Object.entries(pageData.content)) {
        cleanContent[sectionName] = stripFilesForSubmit(sectionData, formData, [sectionName]);
      }
      formData.append("content", JSON.stringify(cleanContent));
      const isUpdate = Boolean(pageData.id);
      if (isUpdate) formData.append("_method", "PUT");
      const url = isUpdate ? `${API_URL}/admin/footer/pages/${pageData.id}` : `${API_URL}/admin/footer/pages`;
      const response = await fetch(url, { 
        method: "POST", 
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: "application/json" 
        }, 
        body: formData 
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setHasChanges(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await fetchFooterPage();
      } else if (result.errors) {
        setError(`Validation Error: ${Object.values(result.errors).flat().join(", ")}`);
      } else {
        setError(result.message || "Error saving footer");
      }
    } catch (err) { 
      console.error(err); 
      setError(err.message || "Failed to save footer"); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleReset = () => { 
    fetchFooterPage(); 
    setHasChanges(false); 
    setError(null); 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="text-center py-24">
        <p className="text-stone-500">No footer data found</p>
        <button onClick={fetchFooterPage} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800 transition">
          Retry
        </button>
      </div>
    );
  }

  const sections = Object.keys(pageData.content || {});

  return (
    <div className="min-h-screen bg-stone-100 pb-16">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');`}</style>
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-emerald-950 text-stone-50 shadow-lg shadow-emerald-950/10 rounded-b-3xl border-b-4 border-amber-400">
        <div className="mx-auto max-w-5xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Akagera Park Inn</p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-semibold text-white">
              Footer Manager
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
            <button
              onClick={saveToBackend}
              disabled={!hasChanges || saving}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                hasChanges && !saving
                  ? "bg-amber-500 text-emerald-950 hover:bg-amber-400"
                  : "cursor-not-allowed bg-emerald-900 text-emerald-400/60"
              }`}
            >
              {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-950 border-t-transparent" /> : <Save size={15} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={openPreview}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition bg-emerald-700 text-white hover:bg-emerald-800"
            >
              <Eye size={15} />
              View Preview
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pt-6 space-y-6">
        {error && (
          <div className="rounded-xl border-2 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Sections */}
        <div className="relative pl-14">
          <div className="absolute left-[27px] top-3 bottom-3 w-px bg-emerald-200" aria-hidden="true" />
          <div className="space-y-4">
            {sections.map((sectionName, idx) => {
              const isExpanded = expandedSections[sectionName] || false;
              const sectionData = pageData.content[sectionName];
              const meta = sectionMeta[sectionName] || { label: sectionName, blurb: "", icon: Sun };
              const Icon = meta.icon;
              if (!sectionData) return null;
              return (
                <div key={sectionName} className="relative">
                  <div
                    className={`absolute -left-14 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                      isExpanded ? "border-amber-500 bg-amber-50 text-amber-600" : "border-emerald-200 bg-white text-emerald-700"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition">
                    <button onClick={() => toggleSection(sectionName)} className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-stone-400">{String(idx + 1).padStart(2, "0")}</span>
                        <div>
                          <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="font-semibold text-stone-800">
                            {meta.label}
                          </p>
                          <p className="text-xs text-stone-400">{meta.blurb}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-stone-400">
                        {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-stone-100 p-6">
                        <FooterEditor
                          data={sectionData}
                          onChange={(field, value) => updateSection(sectionName, field, value)}
                          onImageUpload={(file, index, field) => handleImageUpload(sectionName, file, index, field)}
                          onRemoveImage={(index, field) => removeImage(sectionName, index, field)}
                          isUploading={(index, field) => Boolean(uploading[`${sectionName}_${index}_${field}`])}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertCircle size={16} className="text-amber-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Tips</p>
              <ul className="mt-1 space-y-1 text-xs text-amber-700">
                <li>• Expand the section to edit all footer content</li>
                <li>• Upload a logo image (JPG, PNG, WebP, SVG)</li>
                <li>• Add quick links and book section links</li>
                <li>• Update contact information and social links</li>
                <li>• Click "View Preview" to see how your footer looks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && <FooterPreview data={pageData.content} onClose={closePreview} />}
    </div>
  );
}