import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { suites as staticSuites } from '../../data/suites';
import { SectionHeader, EditorCard, Field, TagsField, ImageUploadField, useSaveToast } from './EditorPrimitives';

export default function RoomsSection() {
  const { content, updateContent, resetSection } = useContent();
  const [suites, setSuites] = useState(content.suites.map(s => ({ ...s })));
  const [saved, toast] = useSaveToast();

  const hasChanges = JSON.stringify(suites) !== JSON.stringify(content.suites);

  const updateSuite = (slug, key, val) =>
    setSuites(prev => prev.map(s => s.slug === slug ? { ...s, [key]: val } : s));

  const handleSave = () => { updateContent('suites', suites); toast(); };
  const handleReset = () => { resetSection('suites'); setSuites(content.suites.map(s => ({ ...s }))); };

  return (
    <div>
      <SectionHeader
        title="Rooms"
        desc="Edit the text content and amenities for each room type."
        hasChanges={hasChanges}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      <div className="grid gap-6">
        {suites.map((suite) => {
          const staticSuite = staticSuites.find(s => s.slug === suite.slug);
          return (
            <EditorCard key={suite.slug} className="overflow-hidden !p-0">
              {/* Room image header */}
              <div className="relative h-36 overflow-hidden rounded-t-2xl">
                {(suite.customImage || staticSuite?.image) && (
                  <img
                    src={suite.customImage || staticSuite.image}
                    alt={suite.name}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <p className="font-display text-xl font-semibold text-white">{suite.name}</p>
                  <p className="text-xs text-sand-200/70 mt-0.5">{suite.tagline}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <ImageUploadField
                  label="Room Cover Image"
                  value={suite.customImage}
                  onChange={v => updateSuite(suite.slug, 'customImage', v)}
                  placeholder="Uses built-in image. Enter URL or upload to override."
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Room Name" value={suite.name} onChange={v => updateSuite(suite.slug, 'name', v)} />
                  <Field label="Tagline" value={suite.tagline} onChange={v => updateSuite(suite.slug, 'tagline', v)} />
                </div>
                <Field label="Short Description" value={suite.desc} onChange={v => updateSuite(suite.slug, 'desc', v)} multiline rows={2} />
                <Field label="Full Description" value={suite.longDesc} onChange={v => updateSuite(suite.slug, 'longDesc', v)} multiline rows={4} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Room Size" value={suite.size} onChange={v => updateSuite(suite.slug, 'size', v)} placeholder="20 m²" />
                  <Field label="View" value={suite.view} onChange={v => updateSuite(suite.slug, 'view', v)} placeholder="Garden" />
                  <Field label="Max Guests" value={String(suite.guests ?? '')} onChange={v => updateSuite(suite.slug, 'guests', Number(v))} type="number" />
                </div>
                <TagsField
                  label="Amenities"
                  value={suite.amenities}
                  onChange={v => updateSuite(suite.slug, 'amenities', v)}
                />
              </div>
            </EditorCard>
          );
        })}
      </div>
    </div>
  );
}
