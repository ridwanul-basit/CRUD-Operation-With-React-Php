import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_announcements.php", { credentials: "include" });
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleAdd = async () => {
    if (!title || !message) return Swal.fire("Error", "All fields required", "error");

    try {
      const res = await fetch("http://localhost/college_api/insert_announcement.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", data.message, "success");
        setTitle("");
        setMessage("");
        fetchAnnouncements();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the announcement.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost/college_api/delete_announcement.php?id=${id}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Deleted", data.message, "success");
        fetchAnnouncements();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="p-6  min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">📢 Announcements</h2>

      {/* Add Announcement */}
      <div className="mb-6 bg-white p-4 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-2 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
        >
          Add Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-gray-500 italic text-center">No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100 flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-1">{a.title}</h3>
                <p className="text-gray-700 mb-2">{a.message}</p>
                <small className="text-gray-400 text-sm">📅 {new Date(a.created_at).toLocaleString()}</small>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
