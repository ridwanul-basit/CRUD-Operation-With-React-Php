import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AdminAllPost() {
  const [items, setItems] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch posts + comments
  const fetchItems = async () => {
    let postsEndpoint = "http://localhost/college_api/get_posts.php";
    let commentsEndpoint = "http://localhost/college_api/get_all_comments.php";

    if (statusFilter === "pending") {
      postsEndpoint = "http://localhost/college_api/admin_pending_posts.php";
      commentsEndpoint = "http://localhost/college_api/admin_pending_comments.php";
    }

    try {
      const [postsRes, commentsRes] = await Promise.all([
        fetch(postsEndpoint, { credentials: "include" }),
        fetch(commentsEndpoint, { credentials: "include" }),
      ]);

      const postsData = await postsRes.json();
      const commentsData = await commentsRes.json();

      let combined = [];

      if (typeFilter === "all" || typeFilter === "post") {
        if (postsData.success) {
          combined = postsData.posts.map((p) => ({ ...p, type: "post" }));
        }
      }

      if (typeFilter === "all" || typeFilter === "comment") {
        if (commentsData.success) {
          combined = [
            ...combined,
            ...commentsData.comments.map((c) => ({ ...c, type: "comment" })),
          ];
        }
      }

      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setItems(combined);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [typeFilter, statusFilter]);

  // Add comment
  const handleAddComment = async (postId) => {
    if (!commentText[postId] || commentText[postId].trim() === "") {
      Swal.fire("⚠️ Warning", "Comment cannot be empty", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost/college_api/add_comment.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, content: commentText[postId] }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("✅ Success", data.message, "success");
        setCommentText({ ...commentText, [postId]: "" });
        fetchItems();
      } else Swal.fire("❌ Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  // Approve pending post/comment
  const handleApprove = async (id, type) => {
    try {
      const res = await fetch("http://localhost/college_api/approve.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("✅ Approved", "Item verified successfully", "success");
        fetchItems();
      } else Swal.fire("❌ Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete post/comment
  const handleDelete = async (id, type) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this ${type}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("http://localhost/college_api/delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("🗑️ Deleted", `${type} removed successfully`, "success");
        fetchItems();
      } else Swal.fire("❌ Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  // Edit post/comment
  const handleEdit = async (id, type, content) => {
    if (!content || content.trim() === "") {
      Swal.fire("⚠️ Warning", "Content cannot be empty", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost/college_api/edit.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, content }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("✏️ Updated", `${type} edited successfully`, "success");
        fetchItems();
      } else Swal.fire("❌ Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-bold">🌍 Admin Dashboard</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="mr-2 font-semibold">Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="all">All</option>
            <option value="post">Posts</option>
            <option value="comment">Comments</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {items.length === 0 && <p>No items found</p>}

      {/* Display posts and comments */}
      {items.map((item) => (
        <div
          key={`${item.type}-${item.id}`}
          className="bg-white p-4 rounded shadow space-y-2 border border-gray-200"
        >
          {/* POST */}
          {item.type === "post" ? (
            <>
              <h3 className="font-semibold">{item.title}</h3>
              <p>{item.content}</p>
            </>
          ) : (
            <>
              <p>{item.content}</p>
              <p className="text-sm text-gray-500">On Post ID: {item.post_id}</p>
            </>
          )}

          <p className="text-sm text-gray-500">
            {item.type === "post" ? "Posted by" : "Comment by"}{" "}
            {item.author_type === "admin" ? "🛡️ Admin" : `🎓 ${item.author_name}`}{" "}
            {item.author_id ? `(ID: ${item.author_id})` : ""} | Status:{" "}
            <span
              className={`font-semibold ${
                item.status === "approved" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {item.status}
            </span>
          </p>

          {/* Admin Buttons */}
          <div className="flex flex-wrap gap-2 mt-2">
            {item.status === "pending" && (
              <button
                onClick={() => handleApprove(item.id, item.type)}
                className="btn btn-success"
              >
                ✅ Approve
              </button>
            )}
            <button onClick={() => handleDelete(item.id, item.type)} className="btn btn-error">
              🗑️ Delete
            </button>
            <button
              onClick={() =>
                Swal.fire({
                  title: `Edit ${item.type}`,
                  input: "textarea",
                  inputValue: item.content,
                  showCancelButton: true,
                  confirmButtonText: "Save",
                }).then((result) => {
                  if (result.isConfirmed) handleEdit(item.id, item.type, result.value);
                })
              }
              className="btn btn-warning"
            >
              ✏️ Edit
            </button>
          </div>

          {/* Comments under posts */}
          {item.type === "post" && item.comments && (
            <div className="space-y-1 mt-2">
              <h4 className="font-semibold">Comments:</h4>
              {item.comments.map((c) => (
                <div
                  key={c.id}
                  className="pl-2 border-l-2 border-gray-300 flex justify-between items-center"
                >
                  <p>
                    <strong>{c.author_name}</strong> ({c.author_type}): {c.content} |{" "}
                    <span
                      className={`font-semibold ${
                        c.status === "approved" ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </p>

                  <div className="flex gap-2">
                    {c.status === "pending" && (
                      <button
                        onClick={() => handleApprove(c.id, "comment")}
                        className="btn btn-success"
                      >
                        ✅ Approve
                      </button>
                    )}
                    <button onClick={() => handleDelete(c.id, "comment")} className="btn btn-error">
                      🗑️
                    </button>
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Edit Comment",
                          input: "textarea",
                          inputValue: c.content,
                          showCancelButton: true,
                          confirmButtonText: "Save",
                        }).then((result) => {
                          if (result.isConfirmed) handleEdit(c.id, "comment", result.value);
                        })
                      }
                      className="btn btn-warning"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add comment input */}
          {item.type === "post" && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText[item.id] || ""}
                onChange={(e) => setCommentText({ ...commentText, [item.id]: e.target.value })}
                className="border p-1 rounded flex-1"
              />
              <button onClick={() => handleAddComment(item.id)} className="btn btn-primary">
                💬 Comment
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
