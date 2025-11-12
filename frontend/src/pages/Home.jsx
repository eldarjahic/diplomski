import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ImageCarousel from "../components/ImageCarousel";
import { BOSNIA_MAIN_CITIES, CITY_NEIGHBORHOODS } from "../data/locations";

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchLocation, setSearchLocation] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [listingType, setListingType] = useState("rent");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const filteredCities = useMemo(() => {
    const input = searchLocation.trim().toLowerCase();
    if (!input) return BOSNIA_MAIN_CITIES;
    return BOSNIA_MAIN_CITIES.filter((city) =>
      city.toLowerCase().includes(input)
    );
  }, [searchLocation]);

  const neighborhoodsForCity = useMemo(() => {
    const normalizedCity = searchLocation.trim();
    return CITY_NEIGHBORHOODS[normalizedCity] || [];
  }, [searchLocation]);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedCity = searchLocation.trim();
    const targetPath = listingType === "buy" ? "/buy" : "/rent";

    navigate(targetPath, {
      state: {
        city: trimmedCity,
        neighborhood: selectedNeighborhood,
        minPrice,
        maxPrice,
        extraFilters: {},
      },
    });
  };

  const handleCitySelect = (city) => {
    setSearchLocation(city);
    setSelectedNeighborhood("");
    setIsLocationDropdownOpen(false);
  };

  const showNeighborhoodDropdown =
    neighborhoodsForCity.length > 0 && searchLocation.trim().length > 0;

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
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-3 md:flex-row"
              >
                <div className="relative flex w-full flex-col gap-2 md:w-64">
                  <div className="flex rounded-md border border-gray-200 focus-within:border-gray-400">
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(event) => {
                        setSearchLocation(event.target.value);
                        setIsLocationDropdownOpen(true);
                      }}
                      onFocus={() => setIsLocationDropdownOpen(true)}
                      placeholder="Location (e.g. Sarajevo)"
                      className="w-full rounded-l-md border-none px-3 py-2 text-sm outline-none"
                      aria-label="Search by location"
                    />
                    <button
                      type="button"
                      onClick={() => setIsLocationDropdownOpen((prev) => !prev)}
                      className="flex items-center justify-center rounded-r-md border-l border-gray-200 px-3 text-gray-500 transition hover:text-gray-700"
                      aria-label="Toggle location suggestions"
                    >
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isLocationDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                  {isLocationDropdownOpen && filteredCities.length > 0 && (
                    <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      <ul className="divide-y divide-gray-100">
                        {filteredCities.map((city) => (
                          <li key={city}>
                            <button
                              type="button"
                              onClick={() => handleCitySelect(city)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                            >
                              {city}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <select
                  value={listingType}
                  onChange={(event) => setListingType(event.target.value)}
                  className="w-full rounded-md border h-fit border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 md:w-32"
                  aria-label="Select listing type"
                >
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
                {showNeighborhoodDropdown && (
                  <select
                    value={selectedNeighborhood}
                    onChange={(event) =>
                      setSelectedNeighborhood(event.target.value)
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 md:w-48"
                    aria-label="Select neighborhood"
                  >
                    <option value="">All neighborhoods</option>
                    {neighborhoodsForCity.map((neighborhood) => (
                      <option key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </option>
                    ))}
                  </select>
                )}
                <div className="flex w-full flex-col gap-2 md:w-64">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(event) => setMinPrice(event.target.value)}
                      placeholder="Price from (BAM)"
                      className="remove-number-spinner w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                      aria-label="Minimum price"
                    />
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      placeholder="Price to (BAM)"
                      className="remove-number-spinner w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                      aria-label="Maximum price"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Real Estate Image Carousel */}
          <div>
            <ImageCarousel autoPlayInterval={5000} />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Verified Listings",
            "Smart Filters",
            "Direct Contact",
            "Saved Searches",
          ].map((title, index) => {
            const descriptions = [
              "Regularly reviewed to ensure quality and accuracy.",
              "Refine by price, area, bedrooms, and more.",
              "Message owners or agents without friction.",
              "Get alerts when new properties match your needs.",
            ];
            const icons = [
              "M12 6v6l4 2",
              "M4 12h16M4 6h16M4 18h16",
              "M3 8l9 6 9-6",
              "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
            ];
            return (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/40 p-6 backdrop-blur-xl shadow-lg transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/60 text-gray-900 shadow">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={icons[index]}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-700">
                      {descriptions[index]}
                    </p>
                  </div>
                  <div className="mt-auto text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Learn more →
                  </div>
                </div>
              </div>
            );
          })}
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
