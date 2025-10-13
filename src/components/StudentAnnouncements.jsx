import { useEffect, useState } from "react";

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("http://localhost/college_api/get_announcements.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnnouncements(data.announcements);
      });
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">📢 Announcements</h2>

      {announcements.length === 0 ? (
        <p className="text-gray-500 italic">No announcements yet.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((a) => (
            <li
              key={a.id}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100"
            >
              <h3 className="font-bold text-lg text-gray-800 mb-1">{a.title}</h3>
              <p className="text-gray-700 mb-2">{a.content}</p>
              <small className="text-gray-400 text-sm">📅 Posted: {new Date(a.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
