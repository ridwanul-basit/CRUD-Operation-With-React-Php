import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CheckCircle, Edit3, Trash2, Plus, Eye } from "lucide-react";

export default function AdminAllPostCMS() {
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState("post"); // post | comment | all
  const [statusFilter, setStatusFilter] = useState("approved"); // approved | pending
  const navigate = useNavigate();

  // Fetch posts and comments
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
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setItems(combined);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [typeFilter, statusFilter]);

  // Add post
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
        if (data.success) Swal.fire("✅ Added", "Post added successfully", "success");
        else Swal.fire("❌ Error", data.message, "error");
        fetchItems();
      } catch (err) {
        Swal.fire("❌ Error", "Something went wrong", "error");
      }
    }
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
    if (data.success) Swal.fire("✅ Approved", "", "success");
    else Swal.fire("❌ Error", data.message, "error");
    fetchItems();
  };

  // Delete
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

  // Edit
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen rounded-2xl">
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div className="flex gap-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="post">Posts</option>
            <option value="comment">Comments</option>
            <option value="all">All</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button
          onClick={handleAddPost}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={16} /> Add Post
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Title / Comment</th>
              <th className="px-4 py-2">Content</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.type}-${item.id}`} className="border-b border-b-gray-300 hover:bg-gray-50">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.type === "post" ? item.title : "💬 Comment"}</td>
                <td className="px-4 py-2 truncate max-w-xs">{item.content}</td>
                <td className="px-4 py-2">{item.author_name}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  {item.status === "pending" && (
                    <button
                      onClick={() => handleApprove(item.id, item.type)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(item.id, item.type, item.content)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.type)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                  {item.type === "post" && (
                    <button
                      onClick={() => navigate(`/adminpanel/post/${item.id}`)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
