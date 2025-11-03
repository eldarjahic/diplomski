import { useAuth } from "../context/AuthContext";
import ImageCarousel from "../components/ImageCarousel";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Find a perfect property to suit your lifestyle
            </h1>
            <p className="mt-4 max-w-prose text-gray-600">
              Discover curated homes for rent and for sale across top
              neighborhoods. Compare, shortlist, and contact owners or agents in
              one place.
            </p>

            {/* Search Bar */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <form className="flex flex-col gap-3 md:flex-row">
                <input
                  type="text"
                  placeholder="Location (e.g. Sarajevo)"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
                <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 md:w-40">
                  <option>For Rent</option>
                  <option>For Buy</option>
                </select>
                <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 md:w-40">
                  <option>Any Price</option>
                  <option>Up to €500</option>
                  <option>€500 - €1,000</option>
                  <option>€1,000 - €2,000</option>
                  <option>€2,000+</option>
                </select>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Real Estate Image Carousel */}
          <div>
            <ImageCarousel
              images={[
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
              ]}
              autoPlayInterval={5000}
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900">
              Verified Listings
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Regularly reviewed to ensure quality and accuracy.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900">
              Smart Filters
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Refine by price, area, bedrooms, and more.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900">
              Direct Contact
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Message owners or agents without friction.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900">
              Saved Searches
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Get alerts when new properties match your needs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA - Only show when not logged in */}
      {!isAuthenticated && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ready to get started?
              </h3>
              <p className="text-sm text-gray-600">
                Create an account to save favorites and get instant alerts.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/register"
                className="rounded-lg border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Create account
              </a>
              <a
                href="/rent"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900"
              >
                Browse rentals
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Home;
