import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function StudentAddPost() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [commentText, setCommentText] = useState({}); // key = postId

  // Fetch student's posts + their own pending comments
  const fetchMyPosts = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_my_posts.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setPosts(data.posts);
      else Swal.fire("Error", data.message, "error");
    } catch (err) {
      Swal.fire("Error", "Failed to fetch posts", "error");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim())
      return Swal.fire("Error", "Title and content required", "error");

    try {
      const res = await fetch("http://localhost/college_api/add_post.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", data.message, "success");
        setNewPost({ title: "", content: "" });
        fetchMyPosts();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
      console.error(err);
    }
  };

  // Edit post or comment
  const handleEdit = async (id, type, currentContent) => {
    const { value: newContent } = await Swal.fire({
      title: `Edit ${type}`,
      input: "textarea",
      inputValue: currentContent,
      showCancelButton: true,
      confirmButtonText: "Save",
    });

    if (newContent !== undefined) {
      if (!newContent.trim()) return Swal.fire("Error", "Content cannot be empty", "error");

      try {
        const res = await fetch("http://localhost/college_api/student_edit.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, type, content: newContent }),
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Success", `${type} updated`, "success");
          fetchMyPosts();
        } else Swal.fire("Error", data.message, "error");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Delete post or comment
  const handleDelete = async (id, type) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this ${type}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
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
        Swal.fire("Deleted", `${type} removed`, "success");
        fetchMyPosts();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  // Add comment
  const handleAddComment = async (postId) => {
    if (!commentText[postId] || !commentText[postId].trim())
      return Swal.fire("Error", "Comment cannot be empty", "error");

    try {
      const res = await fetch("http://localhost/college_api/add_comment.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, content: commentText[postId] }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", data.message, "success");
        setCommentText({ ...commentText, [postId]: "" });
        fetchMyPosts();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-2xl shadow space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">📝 My Posts</h2>

      {/* Create New Post */}
      <form onSubmit={handleCreatePost} className="flex flex-col gap-2 mb-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Post Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="input input-bordered w-full"
        />
        <textarea
          placeholder="Post Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="textarea textarea-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-1/4">
          Add Post
        </button>
      </form>

      {/* List of My Posts */}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded shadow space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p>{post.content}</p>
                <p className="text-sm text-gray-500">
                  Posted on: {new Date(post.created_at).toLocaleString()} | Status:{" "}
                  <span className={post.status === "approved" ? "text-green-600" : "text-yellow-600"}>
                    {post.status}
                  </span>
                </p>
              </div>

              {/* Edit/Delete Post Buttons */}
              <div className="flex flex-col gap-1">
                <button onClick={() => handleEdit(post.id, "post", post.content)} className="btn btn-warning">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(post.id, "post")} className="btn btn-error">
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-2 space-y-1">
              <h4 className="font-semibold">Comments:</h4>
              {post.comments.length === 0 ? (
                <p className="text-gray-500 pl-2">No comments yet.</p>
              ) : (
                post.comments.map((c) => (
                  <div key={c.id} className="pl-2 border-l-2 border-gray-300 flex justify-between items-center">
                    <p>
                      <span className="font-semibold">{c.author_name}</span>: {c.content} |{" "}
                      <span className={c.status === "approved" ? "text-green-600" : "text-yellow-600"}>{c.status}</span>
                    </p>

                    {/* Edit/Delete Comment */}
                    <div className="flex gap-2">
                      {c.author_type === "student" && (
                        <>
                          <button onClick={() => handleEdit(c.id, "comment", c.content)} className="btn btn-warning">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(c.id, "comment")} className="btn btn-error">
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add comment..."
                value={commentText[post.id] || ""}
                onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                className="input input-bordered flex-1"
              />
              <button onClick={() => handleAddComment(post.id)} className="btn btn-secondary">
                Comment
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
