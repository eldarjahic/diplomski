import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PropertyList from "../components/PropertyList";

const DEBOUNCE_DELAY = 400;

const defaultFilterState = {
  type: "",
  bedrooms: "",
  bathrooms: "",
  areaMin: "",
  areaMax: "",
  parking: "",
  furnished: false,
  balcony: false,
  elevator: false,
  heating: false,
};

const propertyTypes = [
  { value: "", label: "All types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

const amenityFilters = [
  { key: "furnished", label: "Furnished" },
  { key: "balcony", label: "Balcony" },
  { key: "elevator", label: "Elevator" },
  { key: "heating", label: "Heating" },
];

function ForRent() {
  const location = useLocation();
  const locationState = useMemo(() => location.state || {}, [location.state]);

  const [city, setCity] = useState(locationState.city || "");
  const [neighborhood, setNeighborhood] = useState(locationState.neighborhood || "");
  const [minPrice, setMinPrice] = useState(locationState.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(locationState.maxPrice || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ...defaultFilterState,
    ...locationState.extraFilters,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    city,
    neighborhood,
    minPrice,
    maxPrice,
    ...filters,
  });
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => {
    setCity(locationState.city || "");
    setNeighborhood(locationState.neighborhood || "");
    setMinPrice(locationState.minPrice || "");
    setMaxPrice(locationState.maxPrice || "");
    setFilters({
      ...defaultFilterState,
      ...locationState.extraFilters,
    });
  }, [locationState]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setAppliedFilters({
        city,
        neighborhood,
        minPrice,
        maxPrice,
        ...filters,
      });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [city, neighborhood, minPrice, maxPrice, filters]);

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilterState);
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties for Rent</h1>
          <p className="mt-2 text-gray-600">
            Find the perfect rental property for you
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded border-gray-300 accent-black"
            />
            Only available
          </label>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:text-gray-900"
          >
            {showFilters ? "Hide filters" : "Additional filters"}
          </button>
        </div>
      </div>

      {showFilters && (
        <form
          onSubmit={(event) => event.preventDefault()}
          className="mb-8 rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Property type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              >
                {propertyTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Minimum bedrooms
              </label>
              <input
                type="number"
                min="0"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="remove-number-spinner w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Any"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Minimum bathrooms
              </label>
              <input
                type="number"
                min="0"
                name="bathrooms"
                value={filters.bathrooms}
                onChange={handleFilterChange}
                className="remove-number-spinner w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Any"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Area from (m²)
              </label>
              <input
                type="number"
                min="0"
                name="areaMin"
                value={filters.areaMin}
                onChange={handleFilterChange}
                className="remove-number-spinner w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Any"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Area to (m²)
              </label>
              <input
                type="number"
                min="0"
                name="areaMax"
                value={filters.areaMax}
                onChange={handleFilterChange}
                className="remove-number-spinner w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Any"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Parking spaces
              </label>
              <input
                type="number"
                min="0"
                name="parking"
                value={filters.parking}
                onChange={handleFilterChange}
                className="remove-number-spinner w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Any"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {amenityFilters.map((filter) => (
              <label
                key={filter.key}
                className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/60 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300"
              >
                <input
                  type="checkbox"
                  name={filter.key}
                  checked={filters[filter.key]}
                  onChange={handleFilterChange}
                  className="rounded border-gray-300"
                />
                {filter.label}
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:text-gray-900"
            >
              Clear filters
            </button>
          </div>
        </form>
      )}

      <PropertyList
        listingType="rent"
        city={appliedFilters.city}
        neighborhood={appliedFilters.neighborhood}
        minPrice={appliedFilters.minPrice}
        maxPrice={appliedFilters.maxPrice}
        propertyType={appliedFilters.type}
        minBedrooms={appliedFilters.bedrooms}
        minBathrooms={appliedFilters.bathrooms}
        minArea={appliedFilters.areaMin}
        maxArea={appliedFilters.areaMax}
        minParking={appliedFilters.parking}
        furnished={appliedFilters.furnished}
        balcony={appliedFilters.balcony}
        elevator={appliedFilters.elevator}
        heating={appliedFilters.heating}
        status={availableOnly ? "available" : ""}
      />
    </main>
  );
}

export default ForRent;
