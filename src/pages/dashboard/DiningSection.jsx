import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { SectionHeader, EditorCard, Field, TagsField, AddItemButton, ImageUploadField, useSaveToast } from './EditorPrimitives';

function uid() { return `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`; }

export default function DiningSection() {
  const { content, updateContent, resetSection } = useContent();
  const [menu, setMenu] = useState(content.menu.map(m => ({ ...m })));
  const [philosophy, setPhilosophy] = useState(content.diningPhilosophy.map(p => ({ ...p })));
  const [saved, toast] = useSaveToast();

  const menuChanged = JSON.stringify(menu) !== JSON.stringify(content.menu);
  const philChanged = JSON.stringify(philosophy) !== JSON.stringify(content.diningPhilosophy);
  const hasChanges = menuChanged || philChanged;

  const updateMenuItem = (id, key, val) =>
    setMenu(prev => prev.map(m => m._id === id ? { ...m, [key]: val } : m));
  const deleteMenuItem = (id) => setMenu(prev => prev.filter(m => m._id !== id));
  const addMenuItem = () =>
    setMenu(prev => [...prev, { _id: uid(), course: 'New', name: '', desc: '', price: '—', tags: [] }]);

  const updatePhilosophy = (id, key, val) =>
    setPhilosophy(prev => prev.map(p => p._id === id ? { ...p, [key]: val } : p));
  const deletePhilosophy = (id) => setPhilosophy(prev => prev.filter(p => p._id !== id));
  const addPhilosophy = () =>
    setPhilosophy(prev => [...prev, { _id: uid(), title: '', body: '' }]);

  const handleSave = () => {
    if (menuChanged) updateContent('menu', menu);
    if (philChanged) updateContent('diningPhilosophy', philosophy);
    toast();
  };
  const handleReset = () => {
    resetSection('menu');
    resetSection('diningPhilosophy');
    setMenu(content.menu.map(m => ({ ...m })));
    setPhilosophy(content.diningPhilosophy.map(p => ({ ...p })));
  };

  return (
    <div>
      <SectionHeader
        title="Dining & Menu"
        desc="Manage menu items and the dining philosophy displayed on the Restaurant page."
        hasChanges={hasChanges}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      {/* Menu items */}
      <h2 className="font-display text-base font-semibold text-forest-900 mb-4">Menu Items</h2>
      <div className="grid gap-4 mb-8">
        {menu.map((item) => (
          <EditorCard key={item._id} onDelete={() => deleteMenuItem(item._id)}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Dish Image"
                  value={item.customImage}
                  onChange={v => updateMenuItem(item._id, 'customImage', v)}
                />
              </div>
              <Field label="Dish / Category Name" value={item.name} onChange={v => updateMenuItem(item._id, 'name', v)} />
              <Field label="Course / Category" value={item.course} onChange={v => updateMenuItem(item._id, 'course', v)} placeholder="e.g. Breakfast, African, Bar" />
            </div>
            <Field label="Description" value={item.desc} onChange={v => updateMenuItem(item._id, 'desc', v)} multiline rows={2} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Price" value={item.price} onChange={v => updateMenuItem(item._id, 'price', v)} placeholder="e.g. RWF 5,000 or —" />
              <TagsField label="Tags" value={item.tags} onChange={v => updateMenuItem(item._id, 'tags', v)} />
            </div>
          </EditorCard>
        ))}
        <AddItemButton label="Add Menu Item" onClick={addMenuItem} />
      </div>

      {/* Dining philosophy */}
      <h2 className="font-display text-base font-semibold text-forest-900 mb-4">Dining Philosophy</h2>
      <div className="grid gap-4">
        {philosophy.map((p) => (
          <EditorCard key={p._id} onDelete={() => deletePhilosophy(p._id)}>
            <Field label="Title" value={p.title} onChange={v => updatePhilosophy(p._id, 'title', v)} />
            <Field label="Body" value={p.body} onChange={v => updatePhilosophy(p._id, 'body', v)} multiline rows={2} />
          </EditorCard>
        ))}
        <AddItemButton label="Add Philosophy Item" onClick={addPhilosophy} />
      </div>
    </div>
  );
}
