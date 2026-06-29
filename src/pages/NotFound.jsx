import { Link } from '../components/Link';
export default function NotFound() {
    return (<section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-forest-950 text-sand-50">
      <div className="absolute inset-0">
        <img src="https://images.pexels.com/photos/2098405/pexels-photo-2098405.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" loading="eager"/>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/70 to-forest-950/90"/>
      </div>
      <div className="container-x relative text-center">
        <p className="font-display text-7xl font-medium text-sand-200 sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-3xl font-medium sm:text-4xl">
          This trail leads nowhere.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sand-100/80">
          The page you are looking for has wandered off into the bush. Let
          us guide you back to familiar ground.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
          <Link to="/stays" className="btn-ghost">
            Browse Stays
          </Link>
        </div>
      </div>
    </section>);
}
