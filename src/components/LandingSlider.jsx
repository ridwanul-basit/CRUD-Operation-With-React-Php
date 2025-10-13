import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // Fetch slider images
  const fetchSlides = async () => {
    try {
      const res = await fetch("http://localhost/college_api/slider_crud.php");
      const data = await res.json();
      if (data.success) setSlides(data.images);
    } catch (err) {
      console.error("Failed to fetch slides:", err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Auto slide every 5 sec
  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-xl shadow-lg">
      <AnimatePresence>
        {slides.map((slide, index) =>
          index === current ? (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={slide.image_url}
                alt={slide.description}
                className="w-full h-full   "
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                <h2 className="text-white text-2xl md:text-4xl font-bold text-center">
                  {slide.description}
                </h2>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-gray-800 rounded-full p-2"
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
      >
        &#10094;
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-gray-800 rounded-full p-2"
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}
