import { useNavigate } from "react-router-dom";
import PropertyForm from "../components/PropertyForm";
import { useAuth } from "../context/AuthContext";

function AddProperty() {
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const response = await fetch("http://localhost:8000/properties", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create property");
    }
  };

  const handleSuccess = () => {
    // Redirect to My Properties after successful creation
    navigate("/my-properties");
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

      <PropertyForm
        initialData={null}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        submitLabel="List Property"
        successMessage="Property listed successfully!"
        showStatusField
      />
    </main>
  );
}

export default AddProperty;
