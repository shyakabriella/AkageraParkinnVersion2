import { useParams } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { Link } from '../components/Link';
import { offers } from '../data/offers';
import { site } from '../data/site';
import NotFound from './NotFound';

export default function OfferDetail() {
    const { id } = useParams();
    const offer = offers.find(o => o.id === id);
    
    if (!offer) return <NotFound />;

    return (
        <>
            <header className="relative isolate overflow-hidden">
                <div className="absolute inset-0">
                    <img src={offer.image} alt={offer.title} className="h-full w-full object-cover" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/40 to-forest-950/80" />
                </div>
                <div className="container-x relative flex min-h-[60vh] flex-col justify-end pb-16 pt-32">
                    <Link to="/offers" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-sand-200/80 transition-colors hover:text-sand-50">
                        <ArrowLeft className="h-4 w-4" /> All Offers
                    </Link>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-sand-50/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sand-50 backdrop-blur-sm">
                            VALID: {offer.validity}
                        </span>
                    </div>
                    <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-tight text-sand-50 sm:text-5xl lg:text-6xl animate-fade-in-up">
                        {offer.title}
                    </h1>
                </div>
            </header>

            <section className="bg-sand-50 bg-grain py-24 sm:py-32">
                <div className="container-x">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-7">
                            <p className="eyebrow reveal">The offer</p>
                            <h2 className="reveal mt-5 font-display text-3xl font-medium leading-tight text-forest-950 sm:text-4xl">
                                {offer.description}
                            </h2>
                            <p className="reveal mt-6 text-lg leading-relaxed text-forest-800/85">
                                {offer.longDescription}
                            </p>
                        </div>

                        <aside className="lg:col-span-5">
                            <div className="reveal sticky top-28 rounded-3xl border border-forest-900/10 bg-white p-7 shadow-soft">
                                <h3 className="font-display text-2xl font-semibold text-forest-950">
                                    Direct Booking Benefits
                                </h3>
                                <ul className="mt-5 space-y-3">
                                    {offer.benefits.map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-forest-800/85">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-700/10 text-forest-700">
                                                <Check className="h-3.5 w-3.5" strokeWidth={2} />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <a 
                                    href={site.bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary mt-7 w-full text-center block"
                                >
                                    Claim This Offer
                                </a>
                                <p className="mt-4 text-center text-xs text-forest-700/60">
                                    Offers are subject to availability and terms & conditions.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
}
