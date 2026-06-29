import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { SectionHeader, EditorCard, Field, StarRating, AddItemButton, useSaveToast } from './EditorPrimitives';

function uid() { return `t${Date.now()}${Math.random().toString(36).slice(2, 6)}`; }

export default function ReviewsSection() {
  const { content, updateContent, resetSection } = useContent();
  const [items, setItems] = useState(content.testimonials.map(t => ({ ...t })));
  const [saved, toast] = useSaveToast();

  const hasChanges = JSON.stringify(items) !== JSON.stringify(content.testimonials);

  const update = (id, key, val) =>
    setItems(prev => prev.map(t => t._id === id ? { ...t, [key]: val } : t));
  const remove = (id) => setItems(prev => prev.filter(t => t._id !== id));
  const add = () => setItems(prev => [
    ...prev,
    { _id: uid(), quote: '', name: 'Guest Review', detail: 'Akagera Park Inn', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', rating: 5 },
  ]);

  const handleSave = () => { updateContent('testimonials', items); toast(); };
  const handleReset = () => { resetSection('testimonials'); setItems(content.testimonials.map(t => ({ ...t }))); };

  return (
    <div>
      <SectionHeader
        title="Guest Reviews"
        desc="Manage testimonials shown on the Reviews page and homepage."
        hasChanges={hasChanges}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      <div className="grid gap-5">
        {items.map((t, idx) => (
          <EditorCard
            key={t._id}
            title={idx === 0 ? 'Featured Review (shown first)' : `Review ${idx + 1}`}
            onDelete={items.length > 1 ? () => remove(t._id) : undefined}
          >
            <div className="flex items-start gap-4">
              {t.avatar && (
                <img
                  src={t.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover border-2 border-forest-100 shrink-0"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="flex-1 space-y-4">
                <Field
                  label="Quote"
                  value={t.quote}
                  onChange={v => update(t._id, 'quote', v)}
                  multiline
                  rows={3}
                  placeholder="What the guest said..."
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Guest Name" value={t.name} onChange={v => update(t._id, 'name', v)} placeholder="Guest Review" />
                  <Field label="Detail / Subtitle" value={t.detail} onChange={v => update(t._id, 'detail', v)} placeholder="Akagera Park Inn" />
                </div>
                <Field
                  label="Avatar Image URL"
                  value={t.avatar}
                  onChange={v => update(t._id, 'avatar', v)}
                  placeholder="https://..."
                />
                <StarRating value={t.rating} onChange={v => update(t._id, 'rating', v)} />
              </div>
            </div>
          </EditorCard>
        ))}
        <AddItemButton label="Add Guest Review" onClick={add} />
      </div>
    </div>
  );
}
