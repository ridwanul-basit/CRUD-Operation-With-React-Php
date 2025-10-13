import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, FileDown, Edit3 } from "lucide-react";

export default function SliderAdmin() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [selected, setSelected] = useState([]);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Fetch slides from backend
  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/college_api/slider_crud.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setSlides(data.images);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch slides", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // ✅ Select logic
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    if (selected.length === filteredSlides.length) setSelected([]);
    else setSelected(filteredSlides.map((s) => s.id));
  };

  // ✅ Delete slides
  const handleDeleteSelected = async (ids = selected) => {
    if (ids.length === 0)
      return Swal.fire("No selection", "Select at least one slider", "info");

    const confirm = await Swal.fire({
      title: `Delete ${ids.length} slider(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    for (const id of ids) {
      await fetch("http://localhost/college_api/slider_crud.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "delete", ids: id.toString() }),
      });
    }

    Swal.fire("Deleted!", "Slider(s) removed", "success");
    setSelected([]);
    fetchSlides();
  };

  // ✅ Export CSV
  const handleExportSelected = () => {
    if (selected.length === 0)
      return Swal.fire("No selection", "Select at least one slider", "info");
    const exportData = slides.filter((s) => selected.includes(s.id));
    const csv = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((s) =>
        [s.id, s.description, s.image_path, s.created_at].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "slides.csv";
    link.click();
  };

  // ✅ Add / Edit modal
  const handleEdit = (slide) => {
    setEditSlide(slide);
    setDescription(slide.description);
    setImageFile(null);
    setModalOpen(true);
  };
  const handleAdd = () => {
    setEditSlide(null);
    setDescription("");
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) return Swal.fire("Error", "Description required", "error");

    const formData = new FormData();
    formData.append("action", editSlide ? "update" : "add");
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);
    if (editSlide) formData.append("id", editSlide.id);

    const res = await fetch("http://localhost/college_api/slider_crud.php", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire("Success", data.message, "success");
      setModalOpen(false);
      fetchSlides();
    } else Swal.fire("Error", data.message, "error");
  };

  // ✅ Filter slides by search
  const filteredSlides = slides.filter((s) =>
    s.description.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-indigo-600">
        Loading slides...
      </div>
    );

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          🖼️ Slider Management
        </h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search slides..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="input input-bordered px-3 py-2 rounded-lg border shadow"
          />
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-500 shadow-md"
          >
            Add New
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-4"
        >
          <button
            onClick={() => handleDeleteSelected(selected)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-500"
          >
            <Trash2 size={16} /> Delete ({selected.length})
          </button>
          <button
            onClick={handleExportSelected}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-500"
          >
            <FileDown size={16} /> Export
          </button>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto bg-white/90 rounded-2xl shadow-2xl backdrop-blur border border-gray-200"
      >
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    selected.length === filteredSlides.length &&
                    filteredSlides.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              {["ID", "Image", "Description", "Created At", "Actions"].map(
                (h) => (
                  <th key={h} className="p-3 font-semibold uppercase text-xs">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredSlides.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`transition hover:bg-indigo-50 ${
                  selected.includes(s.id)
                    ? "bg-indigo-100"
                    : i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                }`}
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={() => toggleSelect(s.id)}
                  />
                </td>
                <td className="p-2 font-semibold text-gray-700">{s.id}</td>
                <td className="p-2">
                  <img
                    src={`http://localhost/college_api/uploads/${s.image_path}`}
                    alt={s.description || "Slider Image"}
                    className="w-24 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-2">{s.description}</td>
                <td className="p-2">{s.created_at}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400"
                    onClick={() => handleEdit(s)}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                    onClick={() => handleDeleteSelected([s.id])}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
            {filteredSlides.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-gray-500 italic">
                  No slides found 💤
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-200"
            >
              <h3 className="text-2xl font-bold mb-4 text-center text-indigo-600">
                {editSlide ? "Edit Slider" : "Add Slider"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="file-input w-full"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  required
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                  >
                    {editSlide ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
