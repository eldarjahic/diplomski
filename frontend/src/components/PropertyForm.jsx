import { useEffect, useMemo, useState } from "react";

const defaultValues = {
  title: "",
  description: "",
  type: "apartment",
  listingType: "rent",
  city: "",
  address: "",
  neighborhood: "",
  price: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  parking: "",
  furnished: false,
  balcony: false,
  elevator: false,
  heating: false,
  phone: "",
  status: "available",
};

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
  { value: "pending", label: "Pending" },
];

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

const listingTypes = [
  { value: "rent", label: "For Rent" },
  { value: "buy", label: "For Sale" },
];

const mapInitialValues = (initialData) => {
  if (!initialData) {
    return defaultValues;
  }

  return {
    title: initialData.title ?? defaultValues.title,
    description: initialData.description ?? defaultValues.description,
    type: initialData.type ?? defaultValues.type,
    listingType: initialData.listingType ?? defaultValues.listingType,
    city: initialData.city ?? defaultValues.city,
    address: initialData.address ?? defaultValues.address,
    neighborhood: initialData.neighborhood ?? defaultValues.neighborhood,
    price:
      initialData.price !== undefined && initialData.price !== null
        ? String(initialData.price)
        : defaultValues.price,
    area:
      initialData.area !== undefined && initialData.area !== null
        ? String(initialData.area)
        : defaultValues.area,
    bedrooms:
      initialData.bedrooms !== undefined && initialData.bedrooms !== null
        ? String(initialData.bedrooms)
        : defaultValues.bedrooms,
    bathrooms:
      initialData.bathrooms !== undefined && initialData.bathrooms !== null
        ? String(initialData.bathrooms)
        : defaultValues.bathrooms,
    parking:
      initialData.parking !== undefined && initialData.parking !== null
        ? String(initialData.parking)
        : defaultValues.parking,
    furnished: Boolean(initialData.furnished),
    balcony: Boolean(initialData.balcony),
    elevator: Boolean(initialData.elevator),
    heating: Boolean(initialData.heating),
    phone: initialData.phone ?? defaultValues.phone,
    status: initialData.status ?? defaultValues.status,
  };
};

const readFilesAsDataUrls = (files) =>
  Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );

function PropertyForm({
  initialData,
  onSubmit,
  onSuccess,
  submitLabel = "Save Property",
  successMessage = "Property saved successfully!",
  showStatusField = false,
}) {
  const mappedInitialValues = useMemo(
    () => mapInitialValues(initialData),
    [initialData]
  );

  const initialImages = useMemo(() => {
    if (!initialData) {
      return [];
    }
    if (Array.isArray(initialData.images) && initialData.images.length > 0) {
      return [...initialData.images];
    }
    if (initialData.imageUrl) {
      return [initialData.imageUrl];
    }
    return [];
  }, [initialData]);

  const [formData, setFormData] = useState(mappedInitialValues);
  const [uploadedImages, setUploadedImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setFormData(mappedInitialValues);
  }, [mappedInitialValues]);

  useEffect(() => {
    setUploadedImages(initialImages);
  }, [initialImages]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    try {
      const fileList = Array.from(files);
      const dataUrls = await readFilesAsDataUrls(fileList);
      setUploadedImages((prev) => [...prev, ...dataUrls]);
    } catch (uploadError) {
      console.error("Failed to process images", uploadError);
      setError("Failed to process selected images. Please try again.");
    }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (uploadedImages.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      area: Number(formData.area),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      parking:
        formData.parking !== "" && formData.parking !== null
          ? Number(formData.parking)
          : null,
      images: uploadedImages,
      imageUrl: uploadedImages[0],
    };

    try {
      setLoading(true);
      await onSubmit(payload);
      setSuccess(successMessage);
      onSuccess?.();
    } catch (submitError) {
      console.error("Property submission error", submitError);
      setError(
        submitError?.message || "Failed to save property. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Basic Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

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
            placeholder="Modern 2BR Apartment in City Center"
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
              {propertyTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
              {listingTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4 border-t border-gray-200 pt-6">
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
            placeholder="Sarajevo"
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
      </section>

      {/* Property Details */}
      <section className="space-y-4 border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>

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

        {showStatusField && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-900">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* Images & Contact */}
      <section className="space-y-4 border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-900">Images & Contact</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-900">
            Upload Images *
          </label>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="property-images"
              className="inline-flex w-fit cursor-pointer items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
            >
              Choose Images
            </label>
            <input
              id="property-images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-500">
              You can upload multiple images. The first image will be used as the cover photo.
            </p>
          </div>
        </div>

        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {uploadedImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="group relative overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="h-32 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-gray-700 opacity-0 transition group-hover:opacity-100"
                >
                  ✕
                </button>
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-1 text-xs font-semibold text-white">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

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
      </section>

      <div className="flex gap-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PropertyForm;
