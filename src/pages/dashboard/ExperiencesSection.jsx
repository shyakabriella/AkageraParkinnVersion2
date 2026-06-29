import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { experiences as staticExperiences } from '../../data/experiences';
import { SectionHeader, EditorCard, Field, TagsField, ImageUploadField, useSaveToast } from './EditorPrimitives';

export default function ExperiencesSection() {
  const { content, updateContent, resetSection } = useContent();
  const [items, setItems] = useState(content.experiences.map(e => ({ ...e })));
  const [saved, toast] = useSaveToast();

  const hasChanges = JSON.stringify(items) !== JSON.stringify(content.experiences);

  const update = (slug, key, val) =>
    setItems(prev => prev.map(e => e.slug === slug ? { ...e, [key]: val } : e));

  const handleSave = () => { updateContent('experiences', items); toast(); };
  const handleReset = () => { resetSection('experiences'); setItems(content.experiences.map(e => ({ ...e }))); };

  return (
    <div>
      <SectionHeader
        title="Services & Experiences"
        desc="Edit the text for each service shown on the Services page."
        hasChanges={hasChanges}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      <div className="grid gap-5">
        {items.map((exp) => {
          const staticExp = staticExperiences.find(e => e.slug === exp.slug);
          return (
            <EditorCard key={exp.slug} className="overflow-hidden !p-0">
              {/* Image header */}
              <div className="relative h-28 overflow-hidden rounded-t-2xl">
                {(exp.customImage || staticExp?.image) && (
                  <img src={exp.customImage || staticExp.image} alt={exp.title} className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 to-transparent" />
                <div className="absolute bottom-3 left-5">
                  <p className="font-display text-lg font-semibold text-white">{exp.title}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <ImageUploadField
                  label="Service Image"
                  value={exp.customImage}
                  onChange={v => update(exp.slug, 'customImage', v)}
                  placeholder="Uses built-in image. Enter URL or upload to override."
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Service Title" value={exp.title} onChange={v => update(exp.slug, 'title', v)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Duration" value={exp.duration} onChange={v => update(exp.slug, 'duration', v)} />
                    <Field label="When Available" value={exp.when} onChange={v => update(exp.slug, 'when', v)} />
                  </div>
                </div>
                <Field label="Short Description (card)" value={exp.body} onChange={v => update(exp.slug, 'body', v)} multiline rows={2} />
                <Field label="Full Description (detail page)" value={exp.longDesc} onChange={v => update(exp.slug, 'longDesc', v)} multiline rows={4} />
                <TagsField
                  label="What's Included"
                  value={exp.included}
                  onChange={v => update(exp.slug, 'included', v)}
                />
              </div>
            </EditorCard>
          );
        })}
      </div>
    </div>
  );
}
