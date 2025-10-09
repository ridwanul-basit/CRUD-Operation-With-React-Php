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
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📢 Announcements</h2>
      {announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <ul className="space-y-3">
          {announcements.map((a) => (
            <li key={a.id} className="border-b border-gray-300 pb-2">
              <h3 className="font-semibold">{a.title}</h3>
              <p>{a.content}</p>
              <small className="text-gray-500">Posted: {a.created_at}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
