import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import PropertyModal from "./PropertyModal";

function PropertyList({
  listingType,
  city = "",
  neighborhood = "",
  minPrice = "",
  maxPrice = "",
  propertyType = "",
  minBedrooms = "",
  minBathrooms = "",
  minArea = "",
  maxArea = "",
  minParking = "",
  furnished = false,
  balcony = false,
  elevator = false,
  heating = false,
}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [
    listingType,
    city,
    neighborhood,
    minPrice,
    maxPrice,
    propertyType,
    minBedrooms,
    minBathrooms,
    minArea,
    maxArea,
    minParking,
    furnished,
    balcony,
    elevator,
    heating,
  ]);

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("listingType", listingType);
      params.append("status", "available");

      const trimmedCity = city?.trim();
      if (trimmedCity) params.append("city", trimmedCity);
      const trimmedNeighborhood = neighborhood?.trim();
      if (trimmedNeighborhood) params.append("neighborhood", trimmedNeighborhood);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (propertyType) params.append("type", propertyType);
      if (minBedrooms) params.append("bedrooms", minBedrooms);
      if (minBathrooms) params.append("bathrooms", minBathrooms);
      if (minArea) params.append("areaMin", minArea);
      if (maxArea) params.append("areaMax", maxArea);
      if (minParking) params.append("parking", minParking);
      if (furnished) params.append("furnished", "true");
      if (balcony) params.append("balcony", "true");
      if (elevator) params.append("elevator", "true");
      if (heating) params.append("heating", "true");

      const response = await fetch(
        `http://localhost:8000/properties?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-lg text-gray-600">
          No properties found for {listingType === "rent" ? "rent" : "sale"}.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => (window.location.href = `/properties/${property.id}`)}
          />
        ))}
      </div>

      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default PropertyList;

