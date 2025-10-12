import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  CheckCircle,
  Edit3,
  Trash2,
  Plus,
  Eye,
  Search,
  FileDown,
} from "lucide-react";

export default function AdminAllPost() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("post");
  const [statusFilter, setStatusFilter] = useState("approved");
  const navigate = useNavigate();

  // Fetch posts + comments
  const fetchItems = async () => {
    try {
      const postsEndpoint =
        statusFilter === "pending"
          ? "http://localhost/college_api/admin_pending_posts.php"
          : "http://localhost/college_api/get_posts.php";
      const commentsEndpoint =
        statusFilter === "pending"
          ? "http://localhost/college_api/admin_pending_comments.php"
          : "http://localhost/college_api/get_all_comments.php";

      const [postsRes, commentsRes] = await Promise.all([
        fetch(postsEndpoint, { credentials: "include" }),
        fetch(commentsEndpoint, { credentials: "include" }),
      ]);

      const postsData = await postsRes.json();
      const commentsData = await commentsRes.json();

      let combined = [];
      if (typeFilter === "all" || typeFilter === "post") {
        if (postsData.success)
          combined = postsData.posts.map((p) => ({ ...p, type: "post" }));
      }
      if (typeFilter === "all" || typeFilter === "comment") {
        if (commentsData.success)
          combined = [
            ...combined,
            ...commentsData.comments.map((c) => ({ ...c, type: "comment" })),
          ];
      }

      combined.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setItems(combined);
      setFilteredItems(combined);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [typeFilter, statusFilter]);

  // Search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.author_name?.toLowerCase().includes(term) ||
        item.title?.toLowerCase().includes(term) ||
        item.content?.toLowerCase().includes(term) ||
        item.author_email?.toLowerCase().includes(term)
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  // Selection logic
  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) setSelectedItems([]);
    else setSelectedItems(filteredItems.map((i) => i.id));
  };

  // Bulk Delete
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0)
      return Swal.fire("Info", "Select at least one item", "info");

    const confirm = await Swal.fire({
      title: "Delete Selected?",
      text: `Are you sure you want to delete ${selectedItems.length} selected items?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
    });
    if (!confirm.isConfirmed) return;

    for (const id of selectedItems) {
      await fetch("http://localhost/college_api/delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: typeFilter === "all" ? "post" : typeFilter }),
      });
    }

    Swal.fire("Deleted!", "Selected items removed.", "success");
    setSelectedItems([]);
    fetchItems();
  };

  // Export CSV
  const handleExportSelected = () => {
    if (selectedItems.length === 0)
      return Swal.fire("Info", "Select at least one item", "info");

    const exportData = filteredItems.filter((i) =>
      selectedItems.includes(i.id)
    );
    const csv = [
      "ID,Type,Title,Author,Email,Status,Created_At",
      ...exportData.map(
        (i) =>
          `${i.id},${i.type},${i.title || "-"},${i.author_name || "-"},${
            i.author_email || "-"
          },${i.status},${i.created_at}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    Swal.fire("Exported!", "CSV downloaded successfully.", "success");
  };

  // Approve/Edit/Delete (single)
  const handleApprove = async (id, type) => {
    const res = await fetch("http://localhost/college_api/approve.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    const data = await res.json();
    if (data.success) Swal.fire("✅ Approved", "", "success");
    else Swal.fire("❌ Error", data.message, "error");
    fetchItems();
  };

  const handleDelete = async (id, type) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this ${type}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;
    const res = await fetch("http://localhost/college_api/delete.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    const data = await res.json();
    if (data.success) Swal.fire("🗑️ Deleted", "", "success");
    else Swal.fire("❌ Error", data.message, "error");
    fetchItems();
  };

  const handleEdit = async (id, type, currentContent) => {
    const { value } = await Swal.fire({
      title: `Edit ${type}`,
      input: "textarea",
      inputValue: currentContent,
      showCancelButton: true,
      confirmButtonText: "Save",
    });
    if (!value) return;
    const res = await fetch("http://localhost/college_api/edit.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type, content: value }),
    });
    const data = await res.json();
    if (data.success) Swal.fire("✏️ Updated", "", "success");
    else Swal.fire("❌ Error", data.message, "error");
    fetchItems();
  };

  // Add Post
  const handleAddPost = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Post",
      html: `
        <input type="text" id="title" class="swal2-input" placeholder="Title">
        <textarea id="content" class="swal2-textarea" placeholder="Content"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Add Post",
      preConfirm: () => {
        const title = Swal.getPopup().querySelector("#title").value;
        const content = Swal.getPopup().querySelector("#content").value;
        if (!title || !content)
          Swal.showValidationMessage("Both title and content are required");
        return { title, content };
      },
    });

    if (formValues) {
      try {
        const res = await fetch("http://localhost/college_api/add_post.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        const data = await res.json();
        if (data.success)
          Swal.fire("✅ Added", "Post added successfully", "success");
        else Swal.fire("❌ Error", data.message, "error");
        fetchItems();
      } catch {
        Swal.fire("❌ Error", "Something went wrong", "error");
      }
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen rounded-2xl">
      {/* Header and controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 drop-shadow-sm">
          📰 Manage Posts & Comments
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-400 rounded-xl bg-white shadow-sm"
          >
            <option value="post">Posts</option>
            <option value="comment">Comments</option>
            <option value="all">All</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-400 rounded-xl bg-white shadow-sm"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>

          <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-1 shadow-sm">
            <Search className="text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search name, title, content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none px-2 py-1 bg-transparent"
            />
          </div>

          <button
            onClick={handleAddPost}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md"
          >
            <Plus size={16} /> Add Post
          </button>
        </div>
      </div>

      {/* Selected actions */}
      {selectedItems.length > 0 && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleDeleteSelected}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 shadow-md"
          >
            🗑 Delete Selected ({selectedItems.length})
          </button>
          <button
            onClick={handleExportSelected}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 shadow-md flex items-center gap-2"
          >
            <FileDown size={16} /> Export Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-200">
        <table className="min-w-full text-left">
          <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === filteredItems.length &&
                    filteredItems.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title / Type</th>
              <th className="px-4 py-3">Content</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={`${item.type}-${item.id}`}
                className={`border-t border-t-gray-300 hover:bg-indigo-50 transition ${
                  selectedItems.includes(item.id) ? "bg-indigo-100" : ""
                }`}
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                  />
                </td>
                <td className="px-4 py-2 font-semibold">{item.id}</td>
                <td className="px-4 py-2">
                  {item.type === "post" ? (
                    <span className="font-semibold text-indigo-700">
                      {item.title}
                    </span> 
                  ) : (
                    <span className="text-gray-500 italic">💬 Comment</span>
                  )}
                </td>
                <td className="px-4 py-2 max-w-xs truncate text-gray-700">
                  {item.content}
                </td>
                <td className="px-4 py-2 text-gray-700">{item.author_name}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  {item.status === "pending" && (
                    <button
                      onClick={() => handleApprove(item.id, item.type)}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-500"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(item.id, item.type, item.content)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.type)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                  {item.type === "post" && (
                    <button
                      onClick={() => navigate(`/adminpanel/post/${item.id}`)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
