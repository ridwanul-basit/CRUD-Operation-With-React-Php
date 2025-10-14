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
import { motion } from "framer-motion";

export default function AdminAllPost() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("post");
  const [statusFilter, setStatusFilter] = useState("approved");
  const navigate = useNavigate();

  // Fetch posts/comments
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
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
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

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredItems(
      items.filter(
        (i) =>
          i.author_name?.toLowerCase().includes(term) ||
          i.title?.toLowerCase().includes(term) ||
          i.content?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, items]);

  // Select / deselect
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
    if (!selectedItems.length)
      return Swal.fire("Info", "Select at least one item", "info");

    const confirm = await Swal.fire({
      title: "Delete Selected?",
      text: `Are you sure you want to delete ${selectedItems.length} items?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    for (const id of selectedItems) {
      await fetch("http://localhost/college_api/delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          type: typeFilter === "all" ? "post" : typeFilter,
        }),
      });
    }

    Swal.fire("Deleted!", "Selected items removed.", "success");
    setSelectedItems([]);
    fetchItems();
  };

  // Bulk Export
  const handleExportSelected = () => {
    if (!selectedItems.length)
      return Swal.fire("Info", "Select at least one item", "info");

    const exportData = filteredItems.filter((i) =>
      selectedItems.includes(i.id)
    );
    const csv = [
      "ID,Type,Title,Author,Status,Created_At",
      ...exportData.map(
        (i) =>
          `${i.id},${i.type},${i.title || "-"},${i.author_name || "-"},${
            i.status
          },${i.created_at}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    Swal.fire("Exported!", "CSV downloaded successfully.", "success");
  };

  // Approve
  const handleApprove = async (id, type) => {
    const res = await fetch("http://localhost/college_api/approve.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    const data = await res.json();
    data.success
      ? Swal.fire("✅ Approved", "", "success")
      : Swal.fire("❌ Error", data.message, "error");
    fetchItems();
  };

  // Delete single
  const handleDelete = async (id, type) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    await fetch("http://localhost/college_api/delete.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    Swal.fire("Deleted!", "", "success");
    fetchItems();
  };

  // Edit post/comment
  const handleEdit = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit ${item.type}`,
      html: `
        <input id="title" class="swal2-input" placeholder="Title" value="${item.title || ''}" ${item.type === 'comment' ? 'disabled' : ''}>
        <textarea id="content" class="swal2-textarea" placeholder="Content">${item.content}</textarea>
        ${item.type === 'post' ? `<input id="image" type="file" class="swal2-file"><br>
          ${item.image ? `<img src="${item.image}" class="mt-2 w-32 h-32 object-cover rounded-md" />` : ''}` : ''}
      `,
      focusConfirm: false,
      preConfirm: () => {
        const content = Swal.getPopup().querySelector("#content").value;
        let image = null;
        if (item.type === "post") {
          image = Swal.getPopup().querySelector("#image").files[0] || null;
        }
        return { content, image };
      },
    });

    if (formValues) {
      const formData = new FormData();
      formData.append("id", item.id);
      formData.append("type", item.type);
      formData.append("content", formValues.content);
      if (formValues.image) formData.append("image", formValues.image);

      const res = await fetch("http://localhost/college_api/edit.php", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        Swal.fire("Updated!", "", "success");
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, content: formValues.content, image: data.image || i.image }
              : i
          )
        );
      } else {
        Swal.fire("Error", data.message, "error");
      }
    }
  };

  // Add new post
  const handleAddPost = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Post",
      html: `
        <input id="title" class="swal2-input" placeholder="Title">
        <textarea id="content" class="swal2-textarea" placeholder="Content"></textarea>
        <input id="image" type="file" class="swal2-file">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const title = Swal.getPopup().querySelector("#title").value;
        const content = Swal.getPopup().querySelector("#content").value;
        const image = Swal.getPopup().querySelector("#image").files[0];
        if (!title || !content)
          Swal.showValidationMessage("Title and content required");
        return { title, content, image };
      },
    });

    if (formValues) {
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("content", formValues.content);
      if (formValues.image) formData.append("image", formValues.image);

      await fetch("http://localhost/college_api/add_post.php", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      Swal.fire("Added!", "", "success");
      fetchItems();
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          📰 Manage Posts & Comments
        </h1>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow bg-white"
          >
            <option value="post">Posts</option>
            <option value="comment">Comments</option>
            <option value="all">All</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow bg-white"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
          <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow border">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 outline-none bg-transparent"
            />
          </div>
          <button
            onClick={handleAddPost}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
          >
            <Plus size={16} /> Add Post
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-4"
        >
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
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white sticky top-0">
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
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Title / Type</th>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Content</th>
                <th className="px-4 py-3 font-semibold">Author</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`transition-all hover:bg-indigo-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } ${selectedItems.includes(item.id) ? "bg-indigo-100" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {item.id}
                  </td>
                  <td className="px-4 py-3">
                    {item.type === "post" ? (
                      <span className="font-semibold text-indigo-600">
                        {item.title}
                      </span>
                    ) : (
                      <span className="italic text-gray-500">💬 Comment</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt="post"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                    {item.content}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.author_name || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    {item.status === "pending" && (
                      <button
                        onClick={() => handleApprove(item.id, item.type)}
                        className="p-2 bg-green-600 text-white rounded hover:bg-green-500"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-400"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.type)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                    {item.type === "post" && (
                      <button
                        onClick={() => navigate(`/adminpanel/post/${item.id}`)}
                        className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400 italic">
                    No posts or comments found 💤
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
