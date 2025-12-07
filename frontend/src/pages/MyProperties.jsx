import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertyModal from "../components/PropertyModal";
import { useAuth } from "../context/AuthContext";

function MyProperties() {
  const { isAuthenticated, user, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("http://localhost:8000/properties/my", {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to load your properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error("Error fetching user properties", err);
        setError("Failed to load your properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [isAuthenticated, getAuthHeaders]);

  const openModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setIsModalOpen(false);
  };

  const handleEditProperty = () => {
    if (!selectedProperty) return;
    closeModal();
    navigate(`/properties/${selectedProperty.id}/edit`);
  };

  const handleDeleteSelected = async () => {
    if (!selectedProperty) return;
    const id = selectedProperty.id;
    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const response = await fetch(`http://localhost:8000/properties/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete property");
      }

      setProperties((prev) => prev.filter((p) => p.id !== id));
      closeModal();
    } catch (err) {
      console.error("Error deleting property", err);
      alert(err.message || "Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please log in to view your listings
          </h1>
          <p className="mt-2 text-gray-600">
            You need to be logged in to manage your property listings.
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
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="mt-1 text-gray-600">
            Manage the listings you have created with your LD Nekretnine
            account.
          </p>
        </div>
        <button
          onClick={() => navigate("/add-property")}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
        >
          + Add New Property
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
            <p className="text-gray-600">Loading your properties...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-lg text-gray-600">
            You haven't listed any properties yet.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Create your first listing to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="relative">
              <PropertyCard
                property={property}
                onClick={() => openModal(property)}
              />
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/properties/${property.id}/edit`);
                }}
                className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 shadow hover:bg-white"
              >
                Edit
              </button>
              <button
                onClick={async (event) => {
                  event.stopPropagation();
                  setSelectedProperty(property);
                  await handleDeleteSelected();
                }}
                disabled={deletingId === property.id}
                className="absolute right-3 top-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-600 shadow hover:bg-white disabled:opacity-60"
              >
                {deletingId === property.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={closeModal}
        isOwner={selectedProperty?.owner?.id === user?.id}
        onEdit={handleEditProperty}
        onDelete={handleDeleteSelected}
      />
    </main>
  );
}

export default MyProperties;
