import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loaded, setLoaded] = useState(false);

  // Load favorites for the current user
  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!isAuthenticated) {
        if (isMounted) {
          setFavoriteIds(new Set());
          setLoaded(true);
        }
        return;
      }
      try {
        setLoaded(false);
        const res = await fetch(`${API_URL}/favorites/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load favorites");
        const ids = new Set(Array.isArray(data) ? data.map((p) => p.id) : []);
        if (isMounted) {
          setFavoriteIds(ids);
        }
      } catch (e) {
        // Non-fatal for UI; keep empty set
        console.error("Failed to load favorites", e);
      } finally {
        if (isMounted) setLoaded(true);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const isFavorite = (propertyId) => favoriteIds.has(propertyId);

  const addFavorite = async (propertyId) => {
    const res = await fetch(`${API_URL}/favorites/${propertyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to add favorite");
    }
    setFavoriteIds((prev) => new Set(prev).add(propertyId));
  };

  const removeFavorite = async (propertyId) => {
    const res = await fetch(`${API_URL}/favorites/${propertyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to remove favorite");
    }
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.delete(propertyId);
      return next;
    });
  };

  const toggleFavorite = async (propertyId) => {
    if (favoriteIds.has(propertyId)) {
      await removeFavorite(propertyId);
    } else {
      await addFavorite(propertyId);
    }
  };

  const value = useMemo(
    () => ({ favoriteIds, loaded, isFavorite, addFavorite, removeFavorite, toggleFavorite }),
    [favoriteIds, loaded]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}


