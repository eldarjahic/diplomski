import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MessageModal from "./MessageModal";

function PropertyCard({ property, onClick }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("bs-BA", {
      style: "currency",
      currency: "BAM",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const ownerId = property.owner?.id;
  const ownerName =
    property.owner?.username ||
    `${property.owner?.firstName || ""} ${property.owner?.lastName || ""}`.trim() ||
    property.owner?.email ||
    "Property owner";
  const isOwner = user && ownerId && user.id === ownerId;

  const handleMessageClick = (event) => {
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsMessageModalOpen(true);
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
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
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
            {property.listingType === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <span className="ml-2 text-xl font-bold text-gray-900">
            {formatPrice(property.price)}
            {property.listingType === "rent" && (
              <span className="text-sm font-normal text-gray-600">/mj</span>
            )}
          </span>
        </div>

        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
          {property.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {property.area} m²
          </span>
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              {property.bedrooms} bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              {property.bathrooms} bath
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm text-gray-600">
            {property.city}
            {property.neighborhood ? `, ${property.neighborhood}` : ""}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {property.type}
          </span>
        </div>

        {!isOwner && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleMessageClick}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-gray-400 hover:text-gray-900"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-2-2H8a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2h-3l-2 2z" />
              </svg>
              Message owner
            </button>
          </div>
        )}
      </div>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipientName={ownerName}
        recipientId={ownerId}
        property={property}
      />
    </div>
  );
}

export default PropertyCard;

