import { Phone, Mail, MapPin, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import BookingForm from '../components/BookingForm';
import { site } from '../data/site';
import { useContent } from '../contexts/ContentContext';
import roomOne from '../Assets/room one.jpeg';
const contact = [
    {
        icon: Phone,
        label: 'Call us',
        value: site.phones[0],
        href: `tel:${site.phones[0].replace(/\s/g, '')}`,
    },
    {
        icon: Phone,
        label: 'Alternate',
        value: site.phones[1],
        href: `tel:${site.phones[1].replace(/\s/g, '')}`,
    },
    {
        icon: Mail,
        label: 'Email',
        value: site.email,
        href: `mailto:${site.email}`,
    },
    {
        icon: MapPin,
        label: 'Find us',
        value: site.address,
        href: undefined,
    },
    {
        icon: Clock,
        label: 'Check-in / out',
        value: `${site.checkIn} · ${site.reception}`,
        href: undefined,
    },
];
export default function Book() {
    const [openFaq, setOpenFaq] = useState(0);
    const { content } = useContent();
    const faqs = content.faqs || [];
    return (<>
      <PageHeader eyebrow="Book Your Stay" title={<>
            Pick your room and dates.
            <span className="italic text-sand-200"> Receive instant confirmation.</span>
          </>} subtitle="Book online or send us an inquiry. All room bookings include breakfast for registered guests. You can also book restaurant, bar, or laundry without a room." image={roomOne}/>

      <section className="bg-sand-100 bg-grain py-24 sm:py-32">
        <div className="container-x">
          <div className="reveal mb-10 rounded-2xl border border-forest-700/20 bg-forest-700/5 p-6 text-center">
            <p className="text-sm leading-relaxed text-forest-800/85">
              <span className="font-semibold text-forest-900">Book online:</span>{' '}
              Reserve directly through our booking platform for instant confirmation by email.
            </p>
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 inline-flex">
              Book on akageraparkinn.com
            </a>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="eyebrow reveal">Contact</p>
              <h2 className="reveal mt-5 font-display text-3xl font-medium leading-tight text-forest-950 sm:text-4xl">
                Prefer to reach us directly?
              </h2>
              <p className="reveal mt-5 text-base leading-relaxed text-forest-800/80">
                Call, email, or send the form — our team is available{' '}
                {site.reception.toLowerCase()} to help with rooms, services, and
                airport transfers.
              </p>

              <div className="reveal mt-10 grid gap-4 sm:grid-cols-2">
                {contact.map((c) => {
            const inner = (<div className="flex items-start gap-4 rounded-2xl border border-forest-900/10 bg-sand-50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-600/40 hover:shadow-soft">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-700/10 text-forest-700">
                        <c.icon className="h-4 w-4" strokeWidth={1.5}/>
                      </span>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-forest-700/60">
                          {c.label}
                        </div>
                        <div className="mt-0.5 font-medium text-forest-950">{c.value}</div>
                      </div>
                    </div>);
            return c.href ? (<a key={c.label} href={c.href} className="block">
                      {inner}
                    </a>) : (<div key={c.label}>{inner}</div>);
        })}
              </div>

              <div className="reveal mt-8 rounded-2xl border-l-4 border-forest-600 bg-forest-700/5 p-5">
                <p className="text-sm leading-relaxed text-forest-800/85">
                  <span className="font-semibold text-forest-900">Getting here:</span>{' '}
                  {site.distances.driveFromKigali}. {site.distances.parkEntrance}.
                  Paid airport shuttle available on request.
                </p>
              </div>
            </div>

            <div className="reveal lg:col-span-7">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand-50 bg-grain py-24 sm:py-32">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow reveal justify-center">Good to know</p>
            <h2 className="reveal mt-5 font-display text-4xl font-medium leading-tight text-forest-950 sm:text-5xl">
              Questions, answered.
            </h2>
          </div>

          <div className="mx-auto mt-14 max-w-3xl space-y-4">
            {faqs.map((f, i) => {
            const open = openFaq === i;
            return (<div key={f.q} className="reveal overflow-hidden rounded-2xl border border-forest-900/10 bg-white" data-reveal-delay={`${i * 60}`}>
                  <button type="button" onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open}>
                    <span className="font-display text-lg font-semibold text-forest-950">
                      {f.q}
                    </span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-forest-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} strokeWidth={1.5}/>
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-base leading-relaxed text-forest-800/80">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>);
        })}
          </div>
        </div>
      </section>
    </>);
}
