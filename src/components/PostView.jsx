import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Edit3, Trash2, ArrowLeft, MessageSquarePlus } from "lucide-react";

export default function PostView() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchPost = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_posts.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success)
        return Swal.fire("❌ Error", data.message || "Failed to fetch posts", "error");

      const selectedPost = data.posts.find((p) => p.id == postId);
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

  const handleAddComment = async () => {
    if (!newComment.trim())
      return Swal.fire("⚠️ Warning", "Comment cannot be empty", "warning");

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

  if (!post)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Loading post...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100  p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Post Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">{post.title}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
          <div className="flex justify-between text-sm text-gray-500 border-t border-t-gray-300 pt-3">
            <span>
              🧑‍💻 {post.author_name} ({post.author_type})
            </span>
            <span>{new Date(post.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <MessageSquarePlus size={22} /> Comments
          </h3>

          {comments.length === 0 ? (
            <p className="text-gray-500 italic text-center py-6">
              No comments yet. Be the first to share your thoughts 💬
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-start bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {c.author_name}{" "}
                      <span className="text-sm text-gray-500">({c.author_type})</span>
                    </div>
                    <p className="text-gray-700 mt-1">{c.content}</p>
                  </div>
                  <div className="flex gap-2 text-gray-500">
                    <button
                      onClick={() => handleEditComment(c.id, c.content)}
                      className="hover:text-yellow-600 transition"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="hover:text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Input */}
          <div className="mt-6 flex gap-3">
            <input
              type="text"
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition transform hover:scale-105"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
