import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_AUTO_PLAY_INTERVAL = 5000;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const ImageCarousel = ({ autoPlayInterval = DEFAULT_AUTO_PLAY_INTERVAL }) => {
  const [properties, setProperties] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const carouselItems = useMemo(() => properties.slice(0, 5), [properties]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:8000/properties");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(shuffleArray(data));
      } catch (error) {
        console.error("Error loading properties for carousel", error);
        setProperties([]);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (!isPaused && carouselItems.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, carouselItems.length, autoPlayInterval]);

  const goToPrevious = () => {
    if (carouselItems.length === 0) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), autoPlayInterval * 2);
  };

  const goToNext = () => {
    if (carouselItems.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), autoPlayInterval * 2);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), autoPlayInterval * 2);
  };

  const handleCardClick = () => {
    const currentProperty = carouselItems[currentIndex];
    if (!currentProperty) return;
    navigate(`/properties/${currentProperty.id}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    } else if (event.key === "ArrowRight") {
      goToNext();
    } else if (event.key === "ArrowLeft") {
      goToPrevious();
    }
  };

  const currentProperty = carouselItems[currentIndex];

  return (
    <div
      className="relative h-64 w-full overflow-hidden rounded-2xl shadow-lg md:h-80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
      role="button"
      onKeyDown={handleKeyDown}
      aria-label="Featured properties carousel"
    >
      {/* Images Container */}
      <div className="relative h-full w-full">
        {carouselItems.map((property, index) => {
          const imageUrl = property?.imageUrl || property?.images?.[0] || FALLBACK_IMAGE;
          return (
            <div
              key={property.id}
              className={`absolute h-full w-full transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={imageUrl}
                alt={property.title || `Property ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-semibold drop-shadow">
                  {property.title || "Featured property"}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-white/90 drop-shadow">
                  {property.city}
                  {property.neighborhood ? `, ${property.neighborhood}` : ""}
                  {property.listingType ? ` • ${property.listingType}` : ""}
                </p>
                {property.price && (
                  <p className="mt-1 text-lg font-semibold text-white">
                    {new Intl.NumberFormat("bs-BA", {
                      style: "currency",
                      currency: "BAM",
                      minimumFractionDigits: 0,
                    }).format(property.price)}
                    {property.listingType === "rent" ? "/mj" : ""}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleCardClick}
                  className="mt-4 inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-white"
                >
                  View property
                </button>
              </div>
            </div>
          );
        })}

        {carouselItems.length === 0 && (
          <div className="flex h-full items-center justify-center bg-gray-200">
            <span className="text-gray-500">No properties to display</span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {carouselItems.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-900"
            aria-label="Previous property"
          >
            <svg
              className="h-6 w-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-900"
            aria-label="Next property"
          >
            <svg
              className="h-6 w-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {carouselItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {carouselItems.map((property, index) => (
            <button
              key={property.id}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;

