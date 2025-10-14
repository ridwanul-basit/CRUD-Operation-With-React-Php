import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { MessageSquare, User, Shield, Send, Plus, Edit2, Trash2 } from "lucide-react";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [filter, setFilter] = useState("all");
  const [currentStudent, setCurrentStudent] = useState(null);

  const fetchCurrentStudent = async () => {
    try {
      const res = await fetch("http://localhost/college_api/student_dashboard.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setCurrentStudent(data.student);
    } catch (err) {
      console.error(err);
    }  
  };

  const fetchPosts = async () => {
    try { 
      let url = "http://localhost/college_api/get_posts.php";
      if (filter != "all" && filter !="admin") url = "http://localhost/college_api/get_my_posts.php";

      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (!data.success) return setPosts([]);

      let fetchedPosts = data.posts;
      if (filter === "admin") {
        fetchedPosts = fetchedPosts.filter((p) => p.author_type === "admin");
      }
      setPosts(fetchedPosts);
    } catch (err) {
      console.error(err);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchCurrentStudent();
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handleAddPost = async () => {
    const { value: formValues } = await Swal.fire({
      title: "✏️ Create a Post",
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Title">
        <textarea id="swal-content" class="swal2-textarea" placeholder="Write your post..."></textarea>
        <input type="file" id="swal-image" class="swal2-file" accept="image/*">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Post",
      preConfirm: () => {
        const title = document.getElementById("swal-title").value;
        const content = document.getElementById("swal-content").value;
        const image = document.getElementById("swal-image").files[0];
        if (!title || !content) {
          Swal.showValidationMessage("Please enter both title and content");
          return false;
        }
        return { title, content, image };
      },
    });

    if (formValues) {
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("content", formValues.content);
      if (formValues.image) formData.append("image", formValues.image);

      try {
        const res = await fetch("http://localhost/college_api/add_post.php", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("✅ Success", data.message, "success");
          fetchPosts();
        } else Swal.fire("Error", data.message, "error");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText[postId] || !commentText[postId].trim()) {
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
        fetchPosts();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (id, type, currentContent) => {
    const { value: content } = await Swal.fire({
      title: `Edit ${type === "post" ? "Post" : "Comment"}`,
      input: "textarea",
      inputValue: currentContent,
      showCancelButton: true,
      confirmButtonText: "Save",
    });
    if (!content) return;

    try {
      const res = await fetch("http://localhost/college_api/student_edit.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, content }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("✏️ Updated", data.message, "success");
        fetchPosts();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, type) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("http://localhost/college_api/student_delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Deleted!", data.message, "success");
        fetchPosts();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          🗞️ Community Posts
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white shadow-sm"
          >
            <option value="all">All Posts</option>
            <option value="admin">Admin Posts</option>
            <option value="my">My Posts</option>
          </select>

          <button
            onClick={handleAddPost}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-xl"
          >
            <Plus size={16} /> New Post
          </button>
        </div>
      </div>

      {/* Post Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 italic">
            No posts yet.
          </p>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 flex flex-col transition-all"
            >
              {/* Header */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      post.author_type === "admin"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {post.author_type === "admin" ? <Shield size={20} /> : <User size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      {post.author_type === "admin" ? "🛡️ Admin" : `🎓 ${post.author_name || "Student"}`}
                    </p>
                  </div>
                </div>
                {filter === "my" && (
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      post.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {post.status}
                  </span>
                )}
              </div>

              {/* Scrollable content + image + comments */}
              <div className="px-5 flex-1 overflow-y-auto max-h-[450px] space-y-3">
                <p className="text-gray-700 leading-relaxed border-l-4 border-indigo-200 pl-3">
                  {post.content}
                </p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-lg mt-3 object-cover max-h-64"
                  />
                )}

                {/* Comments */}
                <div className="bg-gray-50 border-t border-gray-100 p-2 space-y-2">
                  {post.comments.length > 0 ? (
                    post.comments.map((c) => {
                      const isMine = currentStudent && c.author_id === currentStudent.id;
                      return (
                        <div
                          key={c.id}
                          className="bg-white border border-gray-200 rounded-lg p-2 flex justify-between items-center text-sm shadow-sm"
                        >
                          <p>
                            <strong className="text-gray-800">{c.author_name}</strong>: {c.content}
                          </p>
                          {isMine && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(c.id, "comment", c.content)}
                                className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1"
                              >
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(c.id, "comment")}
                                className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 italic">No comments yet.</p>
                  )}
                </div>
              </div>

              {/* Add Comment Input */}
              <div className="p-4 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText({ ...commentText, [post.id]: e.target.value })
                  }
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none text-sm"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Send size={16} /> Comment
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
