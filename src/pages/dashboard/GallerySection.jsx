import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { SectionHeader, EditorCard, Field, AddItemButton, ImageUploadField, useSaveToast } from './EditorPrimitives';

function uid() { return `g${Date.now()}${Math.random().toString(36).slice(2, 6)}`; }

export default function GallerySection() {
  const { content, updateContent, resetSection } = useContent();
  const [gallery, setGallery] = useState(content.gallery ? content.gallery.map(g => ({ ...g })) : []);
  const [saved, toast] = useSaveToast();

  const hasChanges = JSON.stringify(gallery) !== JSON.stringify(content.gallery || []);

  const update = (id, key, val) =>
    setGallery(prev => prev.map(g => g._id === id ? { ...g, [key]: val } : g));
  const remove = (id) => setGallery(prev => prev.filter(g => g._id !== id));
  const add = () => setGallery(prev => [...prev, { _id: uid(), alt: '', category: '', span: '', srcUrl: '' }]);

  const handleSave = () => { updateContent('gallery', gallery); toast(); };
  const handleReset = () => { resetSection('gallery'); setGallery(content.gallery.map(g => ({ ...g }))); };

  return (
    <div>
      <SectionHeader
        title="Gallery"
        desc="Manage images shown on the public Gallery page."
        hasChanges={hasChanges}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      <div className="grid gap-4">
        {gallery.map((item, idx) => (
          <EditorCard
            key={item._id}
            title={`Image ${idx + 1} - ${item.category || 'Uncategorized'}`}
            onDelete={gallery.length > 1 ? () => remove(item._id) : undefined}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Image"
                  value={item.srcUrl || ''}
                  onChange={v => update(item._id, 'srcUrl', v)}
                  placeholder={item._id?.startsWith('g') && !item._id.includes(Date.now().toString().slice(0, 5)) ? 'Uses built-in image. Enter URL or upload to override.' : 'https://example.com/image.jpg'}
                />
              </div>
              <Field
                label="Alt Text"
                value={item.alt || ''}
                onChange={v => update(item._id, 'alt', v)}
                placeholder="Description of the image..."
                className="sm:col-span-2"
              />
              <Field
                label="Category"
                value={item.category || ''}
                onChange={v => update(item._id, 'category', v)}
                placeholder="e.g. Rooms, Dining, Pool"
              />
              <Field
                label="Grid Span (Optional)"
                value={item.span || ''}
                onChange={v => update(item._id, 'span', v)}
                placeholder="e.g. lg:col-span-2 lg:row-span-2"
              />
            </div>
          </EditorCard>
        ))}
        <AddItemButton label="Add Image" onClick={add} />
      </div>
    </div>
  );
}
