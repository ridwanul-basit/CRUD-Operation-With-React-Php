import { useEffect, useState } from "react";
import { User, Shield, Clock, MessageSquare, Send } from "lucide-react";
import Swal from "sweetalert2";

export default function PostSection() {
  const [posts, setPosts] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [commentText, setCommentText] = useState({});

  // ✅ Fetch current logged-in student (if any)
  const fetchCurrentStudent = async () => {
    try {
      const res = await fetch("http://localhost/college_api/student_dashboard.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setCurrentStudent(data.student);
      else setCurrentStudent(null);
    } catch (err) {
      console.error("Error fetching student:", err);
      setCurrentStudent(null);
    }
  };

  // ✅ Fetch posts dynamically based on login state
  const fetchPosts = async (isLoggedIn) => {
    const url = isLoggedIn
      ? "http://localhost/college_api/get_posts.php"
      : "http://localhost/college_api/posts_fetch.php";
    try {
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCurrentStudent();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (currentStudent) fetchPosts(true);
    else fetchPosts(false);
  }, [currentStudent]);

  // ✅ Handle comment action
  const handleAddComment = async (postId) => {
    if (!currentStudent) {
      Swal.fire({
        icon: "warning",
        title: "Login Required ⚠️",
        text: "You must log in before commenting.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    if (!commentText[postId] || !commentText[postId].trim()) {
      Swal.fire("⚠️ Warning", "Comment cannot be empty", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost/college_api/add_comment.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          content: commentText[postId],
        }),
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire("✅ Success", data.message, "success");
        setCommentText({ ...commentText, [postId]: "" });
        fetchPosts(true);
      } else {
        Swal.fire("❌ Error", data.message, "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (posts.length === 0)
    return (
      <div className="text-center text-gray-500 py-16 text-lg">
        No approved posts yet 📭
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-12">
          Latest Posts
        </h2>

        <div className="space-y-10">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl animate-fadeIn ${
                post.author_type === "admin"
                  ? "border-indigo-300 bg-indigo-50/70"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Author Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {post.author_type === "admin" ? (
                    <Shield className="text-indigo-600" />
                  ) : (
                    <User className="text-gray-500" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {post.author_name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {post.author_type === "admin" && (
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-medium">
                    Admin
                  </span>
                )}
              </div>

              {/* Post Content */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Comments */}
              <div className="mt-6 border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="text-indigo-500" size={18} />
                  <h4 className="font-semibold text-gray-700">
                    Comments ({post.comments.length})
                  </h4>
                </div>

                {post.comments.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {post.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-2 bg-gray-50 rounded-md border border-gray-200 text-sm"
                      >
                        <p className="font-medium text-gray-800">
                          {c.author_name}
                        </p>
                        <p className="text-gray-600">{c.content}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(c.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No comments yet.</p>
                )}

                {/* Add Comment */}
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder={
                      currentStudent
                        ? "Add a comment..."
                        : "Login first to comment"
                    }
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [post.id]: e.target.value,
                      })
                    }
                    disabled={!currentStudent}
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                  >
                    <Send size={16} /> Comment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in-out;
        }
      `}</style>
    </section>
  );
}
