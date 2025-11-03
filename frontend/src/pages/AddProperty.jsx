import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AddProperty() {
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "apartment",
    listingType: "rent",
    city: "",
    address: "",
    neighborhood: "",
    latitude: "",
    longitude: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    furnished: false,
    balcony: false,
    elevator: false,
    heating: false,
    imageUrl: "",
    images: "",
    googleMapsUrl: "",
    phone: "",
    status: "available",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImagesChange = (e) => {
    const imagesString = e.target.value;
    // Split by comma and trim each URL
    const imagesArray = imagesString
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 0);
    setFormData((prev) => ({
      ...prev,
      images: imagesArray,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isAuthenticated) {
      setError("You must be logged in to list a property");
      setLoading(false);
      return;
    }

    try {
      // Convert string numbers to actual numbers and handle images
      const imagesArray =
        typeof formData.images === "string"
          ? formData.images
              .split(",")
              .map((img) => img.trim())
              .filter((img) => img.length > 0)
          : Array.isArray(formData.images)
          ? formData.images
          : [];

      const submitData = {
        ...formData,
        price: Number(formData.price),
        area: Number(formData.area),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        parking: formData.parking ? Number(formData.parking) : null,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        images: imagesArray.length > 0 ? imagesArray : null,
        neighborhood: formData.neighborhood || null,
        phone: formData.phone || null,
        googleMapsUrl: formData.googleMapsUrl || null,
      };

      const response = await fetch("http://localhost:8000/properties", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // Show detailed error message
        const errorMsg =
          data.error || data.message || "Failed to create property";
        setError(errorMsg);
        console.error("Property creation error:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error. Please try again. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please log in to list a property
          </h1>
          <p className="mt-2 text-gray-600">
            You need to be logged in to add a property listing.
          </p>
          <a
            href="/login"
            className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Go to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below to add your property listing
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
          Property listed successfully! Redirecting...
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Basic Information
          </h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="e.g., Modern 2BR Apartment in City Center"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="Describe your property..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Property Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Listing Type *
              </label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              >
                <option value="rent">For Rent</option>
                <option value="buy">For Buy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900">Location</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="e.g., Sarajevo"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Neighborhood
            </label>
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="Neighborhood name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="43.8563"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="18.4131"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Google Maps URL
            </label>
            <input
              type="url"
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Property Details
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Price (€) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Area (m²) *
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="75"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Bedrooms *
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Bathrooms *
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="1"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Parking Spaces
              </label>
              <input
                type="number"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="furnished"
                checked={formData.furnished}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Furnished</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="balcony"
                checked={formData.balcony}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Balcony</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="elevator"
                checked={formData.elevator}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Elevator</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="heating"
                checked={formData.heating}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Heating</span>
            </label>
          </div>
        </div>

        {/* Images & Contact */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Images & Contact
          </h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Main Image URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Additional Images (comma-separated URLs)
            </label>
            <input
              type="text"
              onChange={handleImagesChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple URLs with commas
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Contact Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="+387 61 123 456"
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Listing Property..." : "List Property"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddProperty;
