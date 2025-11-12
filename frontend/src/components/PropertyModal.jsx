import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MessageModal from "./MessageModal";

function PropertyModal({ property, isOpen, onClose, isOwner = false, onEdit = () => {} }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !property) return null;

  const ownerId = property.owner?.id;
  const ownerName =
    property.owner?.username ||
    `${property.owner?.firstName || ""} ${property.owner?.lastName || ""}`.trim() ||
    property.owner?.email ||
    "Property owner";

  const isOwnerOfProperty = isOwner || (user && ownerId && user.id === ownerId);

  const handleContactOwner = () => {
    if (!ownerId) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsMessageModalOpen(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("bs-BA", {
      style: "currency",
      currency: "BAM",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image Gallery */}
          <div className="relative h-64 w-full bg-gray-100 md:h-96">
            {property.imageUrl ? (
              <img
                src={property.imageUrl}
                alt={property.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop";
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            {property.images && property.images.length > 0 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {property.images.slice(0, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Property ${idx + 1}`}
                    className="h-16 w-16 rounded-lg border-2 border-white object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {property.title}
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  {property.address}, {property.city}
                  {property.neighborhood && `, ${property.neighborhood}`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(property.price)}
                  {property.listingType === "rent" && (
                    <span className="text-lg font-normal text-gray-600">/mj</span>
                  )}
                </div>
                <span className="inline-block rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                  {property.listingType === "rent" ? "For Rent" : "For Sale"}
                </span>
              </div>
            </div>

            {/* Key Details */}
            <div className="mb-6 grid grid-cols-2 gap-4 border-y border-gray-200 py-6 md:grid-cols-4">
              <div>
                <div className="text-sm text-gray-600">Area</div>
                <div className="text-lg font-semibold text-gray-900">
                  {property.area} m²
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Bedrooms</div>
                <div className="text-lg font-semibold text-gray-900">
                  {property.bedrooms}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Bathrooms</div>
                <div className="text-lg font-semibold text-gray-900">
                  {property.bathrooms}
                </div>
              </div>
              {property.parking && (
                <div>
                  <div className="text-sm text-gray-600">Parking</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {property.parking} spaces
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Features
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {property.furnished && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Furnished
                  </div>
                )}
                {property.balcony && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Balcony
                  </div>
                )}
                {property.elevator && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Elevator
                  </div>
                )}
                {property.heating && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Heating
                  </div>
                )}
              </div>
            </div>

            {/* Property Info */}
            <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <div className="text-sm text-gray-600">Property Type</div>
                <div className="font-semibold text-gray-900 capitalize">
                  {property.type}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <div className="font-semibold text-gray-900 capitalize">
                  {property.status}
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 md:flex-row md:items-center md:justify-between">
              <div>
                {property.phone && (
                  <div className="mb-2">
                    <div className="text-sm text-gray-600">Contact</div>
                    <a
                      href={`tel:${property.phone}`}
                      className="font-semibold text-gray-900 hover:text-gray-600"
                    >
                      {property.phone}
                    </a>
                  </div>
                )}
                {property.googleMapsUrl && (
                  <a
                    href={property.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>
              {isOwnerOfProperty ? (
                <button
                  onClick={onEdit}
                  className="rounded-lg border border-gray-900 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100"
                >
                  Edit Property
                </button>
              ) : (
                <button
                  onClick={handleContactOwner}
                  disabled={!ownerId}
                  className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Contact Owner
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipientName={ownerName}
        recipientId={ownerId}
        property={property}
      />
    </>
  );
}

export default PropertyModal;

