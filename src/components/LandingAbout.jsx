import { useState, useEffect } from "react";

export default function LandingAbout() {
  const [about, setAbout] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const fetchAbout = async () => {
    try {
      const res = await fetch("http://localhost/college_api/about_us_crud.php", {
        credentials: "include"
      });
      const data = await res.json();
      if (data.success && data.about) {
        setAbout(data.about);
      }
    } catch (err) {
      console.error("Failed to fetch About Us:", err);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // Cycle images every 3 seconds
  useEffect(() => {
    if (about?.images?.length > 1) {
      const timer = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % about.images.length);
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(timer);
    }
  }, [about]);

  if (!about) return <div className="text-center py-10">No About Us info found</div>;

  return (
    <div  className="px-5 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-9 items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-4 p-6">
          <h2 className="text-3xl font-bold text-indigo-700">{about.short_description}</h2>
          <p className="text-gray-700">{about.description}</p>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {about.images && about.images.length > 0 ? (
            <img
              key={about.images[currentImage].id}
              src={`http://localhost/college_api/uploads/about_us/${about.images[currentImage].image_path}`}
              alt="About us"
              className="w-full h-96 object-cover rounded shadow"
            />
          ) : (
            <div className="text-gray-400">No images available</div>
          )}
        </div>
      </div>
    </div>
  );
}
