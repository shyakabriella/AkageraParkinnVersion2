import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { SectionHeader, EditorCard, Field, ImageUploadField, useSaveToast } from './EditorPrimitives';

export default function HeroSection() {
  const { content, updateContent, resetSection } = useContent();
  const [form, setForm] = useState({ ...content.hero });
  const [saved, toast] = useSaveToast();

  const hasChanges = JSON.stringify(form) !== JSON.stringify(content.hero);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => { updateContent('hero', form); toast(); };
  const handleReset = () => { resetSection('hero'); setForm({ ...content.hero }); };

  return (
    <div>
      <SectionHeader
        title="Hero Section"
        desc="The large banner on the homepage that visitors see first."
        hasChanges={hasChanges}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      {/* Live preview */}
      <div className="mb-6 rounded-2xl overflow-hidden border border-forest-900/10 shadow-sm">
        <div
          className="relative flex flex-col justify-end h-44 px-8 py-6"
          style={{ background: 'linear-gradient(135deg, #091f0d 0%, #235825 100%)' }}
        >
          <p className="text-xs uppercase tracking-widest text-sand-300/70 mb-2">Preview</p>
          <h2 className="font-display text-2xl font-medium text-sand-50 leading-tight">
            {form.headline}{' '}
            <span className="italic text-sand-300">{content.site?.name || 'Akagera Park Inn'}.</span>
          </h2>
          <p className="mt-2 max-w-lg text-sm text-sand-200/70 leading-relaxed line-clamp-2">
            {form.subtitle}
          </p>
        </div>
      </div>

      <EditorCard title="Hero Content">
        <Field
          label="Headline (first line)"
          value={form.headline}
          onChange={v => set('headline', v)}
          placeholder="e.g. Welcome back to"
        />
        <p className="text-xs text-forest-700/50 -mt-2">
          The hotel name is automatically appended in italics after the headline.
        </p>
        <Field
          label="Subtitle / Tagline"
          value={form.subtitle}
          onChange={v => set('subtitle', v)}
          multiline
          rows={3}
          placeholder="Descriptive paragraph shown below the headline"
        />
        <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-forest-900/10">
          <ImageUploadField
            label="Background Image 1"
            value={form.bgImage1}
            onChange={v => set('bgImage1', v)}
          />
          <ImageUploadField
            label="Background Image 2"
            value={form.bgImage2}
            onChange={v => set('bgImage2', v)}
          />
          <ImageUploadField
            label="Background Image 3"
            value={form.bgImage3}
            onChange={v => set('bgImage3', v)}
          />
          <ImageUploadField
            label="Background Image 4"
            value={form.bgImage4}
            onChange={v => set('bgImage4', v)}
          />
        </div>
      </EditorCard>
    </div>
  );
}
