export default function PageHeader({ eyebrow, title, subtitle, image, align = 'left', }) {
    return (<header className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="eager"/>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/75 via-forest-950/55 to-forest-950/80"/>
      </div>

      <div className={`container-x relative flex min-h-[60vh] flex-col justify-end pb-16 pt-32 sm:min-h-[65vh] sm:pb-20 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
        <p className={`eyebrow animate-fade-in-up text-sand-200/90 opacity-0 ${align === 'center' ? 'justify-center' : ''}`} style={{ animationDelay: '0.1s' }}>
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.08] text-sand-50 opacity-0 animate-fade-in-up sm:text-5xl lg:text-6xl" style={{ animationDelay: '0.25s' }}>
          {title}
        </h1>
        {subtitle && (<p className={`mt-6 max-w-2xl text-lg leading-relaxed text-sand-100/85 opacity-0 animate-fade-in-up ${align === 'center' ? 'mx-auto' : ''}`} style={{ animationDelay: '0.45s' }}>
            {subtitle}
          </p>)}
      </div>
    </header>);
}
