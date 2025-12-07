import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { useFavorites } from "../context/FavoritesContext";

const API_URL = "http://localhost:8000";

function Favorites() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_URL}/favorites/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load favorites");
        setProperties(data);
      } catch (e) {
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Reflect removals instantly when favoriteIds change
  useEffect(() => {
    setProperties((prev) => prev.filter((p) => favoriteIds.has(p.id)));
  }, [favoriteIds]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-gray-600">Loading favorites…</div>
      </div>
    );
  }

  if (error) {
    return <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>;
  }

  if (!properties.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-lg text-gray-600">No favorites yet.</p>
        <p className="mt-2 text-sm text-gray-500">Tap the heart on a listing to save it here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} onClick={() => (window.location.href = `/properties/${p.id}`)} />
      ))}
    </div>
  );
}

export default Favorites;


