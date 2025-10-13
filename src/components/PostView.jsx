import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Edit3,
  Trash2,
  ArrowLeft,
  MessageSquarePlus,
  UserCircle2,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      if (data.success) fetchPost();
      else Swal.fire("❌ Error", data.message, "error");
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
      if (data.success) fetchPost();
      else Swal.fire("❌ Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  if (!post)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg animate-pulse">
        Loading post...
      </div>
    );

  return (
    <div className="min-h-screen  py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Post Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg border border-white/30"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 via-transparent to-pink-100 opacity-70"></div>
          <div className="relative p-8">
            <h1 className="text-4xl font-extrabold mb-3 text-gray-900 leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-line">
              {post.content}
            </p>

            <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center gap-2">
                <UserCircle2 size={18} />
                {post.author_name} ({post.author_type})
              </div>
              <span>{new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Comments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/40"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
            <MessageSquarePlus size={24} /> Comments
          </h3>

          <AnimatePresence>
            {comments.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-500 italic text-center py-6"
              >
                No comments yet — be the first to share your thoughts 💬
              </motion.p>
            ) : (
              comments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group flex justify-between items-start bg-gray-50/60 hover:bg-white transition border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold">
                      {c.author_name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {c.author_name}{" "}
                        <span className="text-sm text-gray-500">({c.author_type})</span>
                      </div>
                      <p className="text-gray-700 mt-1 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEditComment(c.id, c.content)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Comment Input */}
          <div className="sticky bottom-0 mt-8 bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl flex items-center gap-3 px-4 py-3 shadow-lg">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleAddComment}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition flex items-center gap-1"
            >
              <Send size={16} /> Post
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
