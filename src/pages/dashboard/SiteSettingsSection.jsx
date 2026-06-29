import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { SectionHeader, EditorCard, Field, useSaveToast } from './EditorPrimitives';

export default function SiteSettingsSection() {
  const { content, updateContent, resetSection } = useContent();
  const [form, setForm] = useState({ ...content.site });
  const [saved, toast] = useSaveToast();

  const hasChanges = JSON.stringify(form) !== JSON.stringify(content.site);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateContent('site', form);
    toast();
  };

  const handleReset = () => {
    resetSection('site');
    setForm({ ...content.site });
  };

  return (
    <div>
      <SectionHeader
        title="Site Settings"
        desc="Core hotel information displayed across all pages of the website."
        hasChanges={hasChanges}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      <div className="grid gap-5">
        <EditorCard title="Basic Information">
          <Field label="Hotel Name" value={form.name} onChange={v => set('name', v)} />
          <Field label="Tagline" value={form.tagline} onChange={v => set('tagline', v)} placeholder="Short punchy tagline" />
          <Field label="Description" value={form.description} onChange={v => set('description', v)} multiline rows={4} placeholder="Hotel description shown on the About page and meta tags" />
        </EditorCard>

        <EditorCard title="Contact Details">
          <Field label="Email Address" value={form.email} onChange={v => set('email', v)} type="email" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Primary Phone" value={form.phone1} onChange={v => set('phone1', v)} />
            <Field label="Secondary Phone" value={form.phone2} onChange={v => set('phone2', v)} />
          </div>
        </EditorCard>

        <EditorCard title="Location">
          <Field label="Full Address" value={form.address} onChange={v => set('address', v)} />
          <Field label="Region" value={form.region} onChange={v => set('region', v)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Distance to Park" value={form.distPark} onChange={v => set('distPark', v)} placeholder="e.g. 2–3 km to park entrance" />
            <Field label="Drive from Kigali" value={form.distKigali} onChange={v => set('distKigali', v)} placeholder="e.g. Approx. 2.5 hours" />
          </div>
          <Field label="Distance to Airport" value={form.distAirport} onChange={v => set('distAirport', v)} placeholder="e.g. 79 km from Kigali Airport" />
        </EditorCard>

        <EditorCard title="Operations">
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Check-in Time" value={form.checkIn} onChange={v => set('checkIn', v)} placeholder="11:00" />
            <Field label="Check-out Time" value={form.checkOut} onChange={v => set('checkOut', v)} placeholder="11:00" />
            <Field label="Room Count" value={form.roomCount} onChange={v => set('roomCount', v)} type="number" />
          </div>
          <Field label="Reception Hours" value={form.reception} onChange={v => set('reception', v)} placeholder="24-hour reception" />
        </EditorCard>
      </div>
    </div>
  );
}
