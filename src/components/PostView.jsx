import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Edit3, Trash2 } from "lucide-react";

export default function PostView() {
  const { postId } = useParams(); // get post id from URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch all posts and find the one we need
  const fetchPost = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_posts.php", { credentials: "include" });
      const data = await res.json();
      if (!data.success) return Swal.fire("❌ Error", data.message || "Failed to fetch posts", "error");

      const selectedPost = data.posts.find(p => p.id == postId);
      if (!selectedPost) return Swal.fire("❌ Error", "Post not found", "error");

      setPost(selectedPost);
      setComments(selectedPost.comments || []);
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Something went wrong while fetching the post", "error");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // Add a comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return Swal.fire("⚠️ Warning", "Comment cannot be empty", "warning");

    try {
      const res = await fetch("http://localhost/college_api/add_comment.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, content: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("✅ Added", "Comment added successfully", "success");
        setNewComment("");
        fetchPost();
      } else {
        Swal.fire("❌ Error", data.message, "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit comment
  const handleEditComment = async (id, content) => {
    const { value } = await Swal.fire({
      title: "Edit Comment",
      input: "textarea",
      inputValue: content,
      showCancelButton: true,
      confirmButtonText: "Save",
    });
    if (!value) return;

    try {
      const res = await fetch("http://localhost/college_api/edit.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "comment", content: value }),
      });
      const data = await res.json();
      if (data.success) Swal.fire("✏️ Updated", "Comment updated successfully", "success");
      else Swal.fire("❌ Error", data.message, "error");
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this comment? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("http://localhost/college_api/delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "comment" }),
      });
      const data = await res.json();
      if (data.success) Swal.fire("🗑️ Deleted", "Comment deleted successfully", "success");
      else Swal.fire("❌ Error", data.message, "error");
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return <p className="p-8 text-center text-gray-500">Loading post...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen rounded-2xl">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 underline">
        ← Back
      </button>

      {/* Post Content */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-2">{post.content}</p>
        <p className="text-sm text-gray-500">
          Author: {post.author_name} ({post.author_type})
        </p>
        <p className="text-sm text-gray-500">
          Posted: {new Date(post.created_at).toLocaleString()}
        </p>
      </div>

      {/* Comments Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>

        {comments.length === 0 && <p className="text-gray-500 italic">No comments yet.</p>}

        {comments.map((c) => (
          <div key={c.id} className="border-b border-gray-200 py-2 flex justify-between items-center">
            <div>
              <strong>{c.author_name} ({c.author_type})</strong>: {c.content}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEditComment(c.id, c.content)} className="text-yellow-600">
                <Edit3 size={16} />
              </button>
              <button onClick={() => handleDeleteComment(c.id)} className="text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Comment */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button onClick={handleAddComment} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
