import { useState, useEffect, useRef } from "react";

const ImageCarousel = ({ images = [], autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Default placeholder images if none provided
  const defaultImages = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
  ];

  const carouselImages = images.length > 0 ? images : defaultImages;

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused && carouselImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, carouselImages.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), autoPlayInterval * 2);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), autoPlayInterval * 2);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), autoPlayInterval * 2);
  };

  return (
    <div
      className="relative h-48 w-full overflow-hidden rounded-2xl shadow-lg md:h-64"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Images Container */}
      <div className="relative h-full w-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute h-full w-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Property ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* Overlay gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {carouselImages.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-900"
            aria-label="Previous image"
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

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-900"
            aria-label="Next image"
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
      {carouselImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
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

