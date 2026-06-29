import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { SectionHeader, EditorCard, Field, AddItemButton, useSaveToast } from './EditorPrimitives';

function uid() { return `f${Date.now()}${Math.random().toString(36).slice(2, 6)}`; }

export default function FAQsSection() {
  const { content, updateContent, resetSection } = useContent();
  const [faqs, setFaqs] = useState(content.faqs.map(f => ({ ...f })));
  const [saved, toast] = useSaveToast();

  const hasChanges = JSON.stringify(faqs) !== JSON.stringify(content.faqs);

  const update = (id, key, val) =>
    setFaqs(prev => prev.map(f => f._id === id ? { ...f, [key]: val } : f));
  const remove = (id) => setFaqs(prev => prev.filter(f => f._id !== id));
  const add = () => setFaqs(prev => [...prev, { _id: uid(), q: '', a: '' }]);

  const handleSave = () => { updateContent('faqs', faqs); toast(); };
  const handleReset = () => { resetSection('faqs'); setFaqs(content.faqs.map(f => ({ ...f }))); };

  return (
    <div>
      <SectionHeader
        title="FAQs"
        desc="Frequently asked questions shown on the Book / Contact page."
        hasChanges={hasChanges}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      <div className="grid gap-4">
        {faqs.map((faq, idx) => (
          <EditorCard
            key={faq._id}
            title={`Question ${idx + 1}`}
            onDelete={faqs.length > 1 ? () => remove(faq._id) : undefined}
          >
            <Field
              label="Question"
              value={faq.q}
              onChange={v => update(faq._id, 'q', v)}
              placeholder="e.g. Is breakfast included with rooms?"
            />
            <Field
              label="Answer"
              value={faq.a}
              onChange={v => update(faq._id, 'a', v)}
              multiline
              rows={3}
              placeholder="Full answer to the question..."
            />
          </EditorCard>
        ))}
        <AddItemButton label="Add FAQ" onClick={add} />
      </div>
    </div>
  );
}
