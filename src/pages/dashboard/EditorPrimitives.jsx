// Shared editor primitives used across all CMS sections
import { useState } from 'react';
import { CheckCircle2, RotateCcw, Save } from 'lucide-react';

/** Top-of-section header with save/reset controls */
export function SectionHeader({ title, desc, hasChanges, saved, onSave, onReset }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-950 flex items-center gap-2">
          {title}
          {hasChanges && (
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400 ml-1" title="Unsaved changes" />
          )}
        </h1>
        {desc && <p className="mt-1 text-sm text-forest-700/60">{desc}</p>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {saved && (
          <span className="flex items-center gap-1.5 rounded-full bg-forest-50 border border-forest-200 px-3 py-1.5 text-xs font-semibold text-forest-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Saved successfully
          </span>
        )}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-xl border border-forest-900/15 bg-white px-3.5 py-2 text-xs font-semibold text-forest-700 hover:bg-forest-50 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset defaults
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!hasChanges}
          className="flex items-center gap-1.5 rounded-xl bg-forest-700 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <Save className="h-3.5 w-3.5" /> Save Changes
        </button>
      </div>
    </div>
  );
}

/** Wrapping card for a group of fields */
export function EditorCard({ title, children, onDelete, className = '' }) {
  return (
    <div className={`rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm ${className}`}>
      {(title || onDelete) && (
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h3 className="font-display text-sm font-semibold text-forest-800 uppercase tracking-wider">
              {title}
            </h3>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/** Labeled input/textarea field */
export function Field({ label, value, onChange, multiline = false, type = 'text', placeholder, rows = 3 }) {
  const base =
    'w-full rounded-xl border border-forest-900/12 bg-forest-50/50 px-4 py-2.5 text-sm text-forest-950 placeholder-forest-700/35 transition-all focus:border-forest-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/15';
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest-700/60">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={`${base} resize-y`}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          className={base}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

/** Tag list editor — array rendered as comma-separated string */
export function TagsField({ label, value = [], onChange }) {
  const str = Array.isArray(value) ? value.join(', ') : value;
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest-700/60">
        {label}
        <span className="ml-1.5 font-normal normal-case text-forest-700/40">(comma-separated)</span>
      </label>
      <input
        type="text"
        className="w-full rounded-xl border border-forest-900/12 bg-forest-50/50 px-4 py-2.5 text-sm text-forest-950 placeholder-forest-700/35 transition-all focus:border-forest-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/15"
        value={str}
        onChange={e => onChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
      />
    </div>
  );
}

/** Star rating picker */
export function StarRating({ value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest-700/60">
        Rating
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`text-2xl leading-none transition-colors ${n <= value ? 'text-amber-400' : 'text-forest-900/20 hover:text-amber-300'}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

/** Dashed "Add new" row button */
export function AddItemButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border-2 border-dashed border-forest-900/15 py-4 text-sm font-semibold text-forest-600 hover:border-forest-500 hover:bg-forest-50/60 transition-all"
    >
      + {label}
    </button>
  );
}

/** Hook: returns [isSaved, triggerSave] — shows saved state for 2.5s */
export function useSaveToast() {
  const [saved, setSaved] = useState(false);
  const triggerToast = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return [saved, triggerToast];
}

/** Image Upload Field with Client-side compression */
export function ImageUploadField({ label, value, onChange, placeholder = 'Or enter image URL...' }) {
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.6 quality to save localStorage space
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        onChange(dataUrl);
        setIsCompressing(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest-700/60">
        {label}
      </label>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="w-full rounded-xl border border-forest-900/12 bg-forest-50/50 px-4 py-2.5 text-sm text-forest-950 placeholder-forest-700/35 transition-all focus:border-forest-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/15"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <div className="flex items-center gap-3">
          <label className="cursor-pointer rounded-xl border border-forest-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-forest-700 hover:bg-forest-50 transition-colors">
            {isCompressing ? 'Compressing...' : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isCompressing}
            />
          </label>
          <span className="text-[10px] text-forest-700/50">Images are auto-compressed to save space</span>
        </div>
      </div>
    </div>
  );
}
