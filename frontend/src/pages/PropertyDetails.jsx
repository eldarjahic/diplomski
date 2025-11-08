import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropertyModal from "../components/PropertyModal";
import { useAuth } from "../context/AuthContext";

function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`http://localhost:8000/properties/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load property");
        }

        setProperty(data);
      } catch (err) {
        console.error("Error loading property", err);
        setError(err.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
          <p className="text-gray-600">Loading property...</p>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
          {error || "Property not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-12">
      <PropertyModal
        property={property}
        isOpen
        onClose={() => window.history.back()}
        isOwner={property.owner?.id === user?.id}
        onEdit={() => window.location.assign(`/properties/${property.id}/edit`)}
      />
    </main>
  );
}

export default PropertyDetails;
