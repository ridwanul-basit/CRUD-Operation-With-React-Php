import { useEffect, useState } from "react";

export default function StudentDocuments() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch("http://localhost/college_api/get_documents.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDocs(data.documents);
      });
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📄 Documents</h2>
      <ul>
        {docs.length === 0 ? (
          <p>No documents available.</p>
        ) : (
          docs.map((doc) => (
            <li
              key={doc.id}
              className="flex justify-between items-center p-3 bg-gray-100 rounded mb-2"
            >
              <span>{doc.title}</span>
              <a
                href={`http://localhost/college_api/${doc.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-primary"
              >
                View
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
