import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const fetchAnnouncements = async () => {
    const res = await fetch("http://localhost/college_api/get_announcements.php", { credentials: "include" });
    const data = await res.json();
    if (data.success) setAnnouncements(data.announcements);
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleAdd = async () => {
    if (!title || !message) return Swal.fire("Error", "All fields required", "error");
    const res = await fetch("http://localhost/college_api/insert_announcement.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message }),
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire("Success", data.message, "success");
      setTitle(""); setMessage("");
      fetchAnnouncements();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost/college_api/delete_announcement.php?id=${id}`, { credentials: "include" });
    const data = await res.json();
    if (data.success) {
      Swal.fire("Deleted", data.message, "success");
      fetchAnnouncements();
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">📢 Announcements</h2>

      <div className="mb-4 flex flex-col gap-2">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="input input-bordered w-full" />
        <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} className="textarea textarea-bordered w-full"></textarea>
        <button onClick={handleAdd} className="btn btn-primary">Add Announcement</button>
      </div>

      <ul className="space-y-3">
        {announcements.map(a => (
          <li key={a.id} className="bg-white p-4 rounded-lg shadow flex justify-between">
            <div>
              <h3 className="font-bold">{a.title}</h3>
              <p>{a.message}</p>
              <small className="text-gray-500">{a.created_at}</small>
            </div>
            <button onClick={() => handleDelete(a.id)} className="btn btn-error">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
