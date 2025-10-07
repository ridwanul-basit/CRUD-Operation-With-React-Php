import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  // Fetch all documents from backend
  const fetchDocs = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_documents.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setDocs(data.documents);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch documents", "error");
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      return Swal.fire("Error", "Title and file are required", "error");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost/college_api/upload_document.php", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", data.message, "success");
        setTitle("");
        setFile(null);
        fetchDocs(); // Refresh list after upload
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">📄 Documents</h2>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input file-input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-1/3">
          Upload
        </button>
      </form>

      {/* Documents List */}
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <span>{doc.title}</span>
            <a
              href={`http://localhost/college_api/${doc.file_path}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              View
            </a>
          </li>
        ))}
        {docs.length === 0 && <p>No documents uploaded yet.</p>}
      </ul>
    </div>
  );
}
