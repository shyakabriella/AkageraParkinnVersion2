import { useState } from 'react';
import { Check, CalendarDays, Users, BedDouble } from 'lucide-react';
import { suites } from '../data/suites';
import { site } from '../data/site';
const suiteOptions = [
    ...suites.map((s) => s.name),
    'Not sure yet — help me choose',
];
const today = new Date().toISOString().split('T')[0];
export default function BookingForm() {
    const [status, setStatus] = useState('idle');
    function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = String(form.get('name') ?? '').trim();
        const email = String(form.get('email') ?? '').trim();
        const phone = String(form.get('phone') ?? '').trim();
        const checkIn = String(form.get('check_in') ?? '');
        const checkOut = String(form.get('check_out') ?? '');
        const guests = String(form.get('guests') ?? '2');
        const suite = String(form.get('suite') ?? '');
        const message = String(form.get('message') ?? '').trim();
        const body = [
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            checkIn ? `Check-in: ${checkIn}` : null,
            checkOut ? `Check-out: ${checkOut}` : null,
            `Guests: ${guests}`,
            suite ? `Room preference: ${suite}` : null,
            message ? `\nMessage:\n${message}` : null,
        ]
            .filter(Boolean)
            .join('\n');
        const subject = encodeURIComponent(`Booking Inquiry — ${name}`);
        const bodyEncoded = encodeURIComponent(body);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${bodyEncoded}`;
        setStatus('success');
        e.target.reset();
    }
    if (status === 'success') {
        return (<div className="flex h-full flex-col items-center justify-center rounded-3xl border border-forest-700/20 bg-sand-50 p-10 text-center shadow-soft">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-700 text-sand-50">
          <Check className="h-8 w-8" strokeWidth={2}/>
        </span>
        <h3 className="mt-6 font-display text-3xl font-semibold text-forest-950">
          Your email client is opening.
        </h3>
        <p className="mt-3 max-w-md text-forest-800/75">
          Your inquiry has been prepared — just hit send in your email app. Our
          reservations team will reply within 24 hours with availability and a
          tailored plan for your stay.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-outline mt-8">
          Send another request
        </button>
      </div>);
    }
    return (<form onSubmit={handleSubmit} className="rounded-3xl border border-forest-900/10 bg-sand-50 p-7 shadow-soft sm:p-9" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">
            Full name
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" placeholder="Amara Uwase" className="field"/>
        </div>
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="field"/>
        </div>
        <div>
          <label className="field-label" htmlFor="phone">
            Phone <span className="font-normal normal-case text-forest-700/50">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+250 7XX XXX XXX" className="field"/>
        </div>
        <div>
          <label className="field-label" htmlFor="suite">
            Preferred room
          </label>
          <div className="relative">
            <BedDouble className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600" strokeWidth={1.5}/>
            <select id="suite" name="suite" className="field appearance-none pl-9" defaultValue={suiteOptions[0]}>
              {suiteOptions.map((s) => (<option key={s} value={s}>
                  {s}
                </option>))}
            </select>
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="check_in">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5}/> Check-in
            </span>
          </label>
          <input id="check_in" name="check_in" type="date" min={today} className="field"/>
        </div>
        <div>
          <label className="field-label" htmlFor="check_out">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5}/> Check-out
            </span>
          </label>
          <input id="check_out" name="check_out" type="date" min={today} className="field"/>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="guests">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" strokeWidth={1.5}/> Travellers
            </span>
          </label>
          <input id="guests" name="guests" type="number" min={1} max={12} defaultValue={2} className="field"/>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="message">
            Anything you would love us to know?
          </label>
          <textarea id="message" name="message" rows={4} placeholder="Dietary needs, a special occasion, a dream you are chasing…" className="field resize-none"/>
        </div>
      </div>

      <button type="submit" className="btn-primary mt-7 w-full">
        Send Booking Inquiry
      </button>
      <p className="mt-4 text-center text-xs text-forest-700/60">
        No payment required to inquire. We will hold your dates for 48 hours
        once confirmed.
      </p>
    </form>);
}
