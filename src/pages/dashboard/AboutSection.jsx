import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { SectionHeader, EditorCard, Field, ImageUploadField, useSaveToast } from './EditorPrimitives';

export default function AboutSection() {
  const { content, updateContent, resetSection } = useContent();
  const [form, setForm] = useState({ ...content.about });
  const [saved, toast] = useSaveToast();

  const hasChanges = JSON.stringify(form) !== JSON.stringify(content.about);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => { updateContent('about', form); toast(); };
  const handleReset = () => { resetSection('about'); setForm({ ...content.about }); };

  return (
    <div>
      <SectionHeader
        title="About Page"
        desc="Edit the text and images displayed on the About Us page."
        hasChanges={hasChanges}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      <div className="grid gap-5">
        <EditorCard title="Page Images">
          <div className="grid sm:grid-cols-2 gap-4">
            <ImageUploadField
              label="Hero Header Image"
              value={form.customHeroImage}
              onChange={v => set('customHeroImage', v)}
              placeholder="Uses built-in image. Upload to override."
            />
            <ImageUploadField
              label="Side Image (Next to Text)"
              value={form.customSideImage}
              onChange={v => set('customSideImage', v)}
              placeholder="Uses built-in image. Upload to override."
            />
          </div>
        </EditorCard>

        <EditorCard title="Page Content">
          <Field
            label="Main Heading"
            value={form.heading}
            onChange={v => set('heading', v)}
            placeholder="A peaceful hotel minutes from Akagera..."
          />
          <Field
            label="Paragraph 1 (Introduction)"
            value={form.p1}
            onChange={v => set('p1', v)}
            multiline
            rows={3}
          />
          <Field
            label="Paragraph 2 (Rooms & Amenities)"
            value={form.p2}
            onChange={v => set('p2', v)}
            multiline
            rows={3}
          />
          <Field
            label="Paragraph 3 (Services & Operations)"
            value={form.p3}
            onChange={v => set('p3', v)}
            multiline
            rows={3}
          />
        </EditorCard>
      </div>
    </div>
  );
}
