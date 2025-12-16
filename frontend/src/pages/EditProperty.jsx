import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropertyForm from "../components/PropertyForm";
import { useAuth } from "../context/AuthContext";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, getAuthHeaders } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [property, setProperty] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const response = await fetch(`${API_URL}/properties/${id}`, {
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load property");
        }

        if (data.owner?.id !== user?.id) {
          throw new Error("You can only edit properties you created");
        }

        setProperty(data);
      } catch (err) {
        console.error("Error loading property", err);
        setError(err.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isAuthenticated, getAuthHeaders, user]);

  const handleSubmit = async (payload) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update property");
    }
  };

  const handleSuccess = () => {
    navigate("/my-properties");
  };

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please log in to edit your listings
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

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
        <p className="mt-2 text-gray-600">
          Update the details of your property listing below
        </p>
      </div>

      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        submitLabel="Save Changes"
        successMessage="Property updated successfully!"
        showStatusField
      />
    </main>
  );
}

export default EditProperty;
