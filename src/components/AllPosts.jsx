import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MessageSquare, User, Shield, Send, Plus, Edit2, Trash2 } from "lucide-react";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [filter, setFilter] = useState("all"); // all | admin | my
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
      if (filter === "my") url = "http://localhost/college_api/get_my_posts.php";

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
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Post",
      preConfirm: () => {
        const title = document.getElementById("swal-title").value;
        const content = document.getElementById("swal-content").value;
        if (!title || !content) {
          Swal.showValidationMessage("Please enter both title and content");
          return false;
        }
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
    <div className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">🌍 Posts</h2>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            <option value="all">All Posts</option>
            <option value="admin">Admin Posts</option>
            <option value="my">My Posts</option>
          </select>

          <button
            onClick={handleAddPost}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={16} /> Add Post
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 italic">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 border border-gray-100"
            >
              {/* Post Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      post.author_type === "admin"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {post.author_type === "admin" ? <Shield size={20} /> : <User size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      {post.author_type === "admin"
                        ? "🛡️ Admin"
                        : `🎓 ${post.author_name || "Student"}`}
                    </p>
                  </div>
                </div>

                {filter === "my" && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {post.status === "pending" ? "Pending" : "Approved"}
                  </span>
                )}
              </div>

              {/* Post Content */}
              <p className="text-gray-700 leading-relaxed mb-4 border-l-4 border-blue-200 pl-4">
                {post.content}
              </p>

              {/* Actions */}
              {post.author_name === currentStudent?.name && (
                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() => handleEdit(post.id, "post", post.content)}
                    className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, "post")}
                    className="text-red-600 hover:underline flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}

              {/* Comments */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={18} className="text-gray-600" />
                  <h4 className="font-semibold text-gray-700">Comments</h4>
                </div>

                {post.comments.length > 0 ? (
                  <div className="space-y-2">
                    {post.comments.map((c) => {
                      const isMine =
                        currentStudent &&
                        c.author_type === "student" &&
                        c.author_id === currentStudent.id;

                      return (
                        <div
                          key={c.id}
                          className="bg-white p-2 px-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
                        >
                          <p className="text-sm">
                            <strong className="text-gray-800">{c.author_name}</strong>:{" "}
                            <span className="text-gray-700">{c.content}</span>
                          </p>

                          {isMine && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(c.id, "comment", c.content)}
                                className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                              >
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(c.id, "comment")}
                                className="text-red-600 hover:underline flex items-center gap-1 text-xs"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No comments yet.</p>
                )}

                {/* Add Comment */}
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText({ ...commentText, [post.id]: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm"
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
          ))
        )}
      </div>
    </div>
  );
}
