import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  const fetchPosts = async () => {
    const res = await fetch("http://localhost/college_api/get_posts.php", { credentials: "include" });
    const data = await res.json();
    if (data.success) setPosts(data.posts);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleAddComment = async (postId) => {
    const res = await fetch("http://localhost/college_api/add_comment.php", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, content: commentText[postId] })
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire("Success", data.message, "success");
      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } else Swal.fire("Error", data.message, "error");
  };

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-bold">🌍 All Posts</h2>

      {posts.map(post => (
        <div key={post.id} className="bg-white p-4 rounded shadow space-y-2">
          <h3 className="font-semibold">{post.title}</h3>
          <p>{post.content}</p>
          <p className="text-sm text-gray-500">
            Posted by {post.author_type === 'admin' ? '🛡️ Admin' : `🎓 ${post.author_name}`} (ID: {post.author_id})
          </p>

          <div className="space-y-1 mt-2">
            <h4 className="font-semibold">Comments:</h4>
            {post.comments.map(c => (
              <p key={c.id} className="pl-2 border-l-2 border-gray-300">
                <strong>{c.author_name}</strong> ({c.author_type}): {c.content}
              </p>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <input type="text" placeholder="Add a comment..."
              value={commentText[post.id] || ""}
              onChange={e => setCommentText({ ...commentText, [post.id]: e.target.value })}
              className="input input-bordered flex-1" />
            <button onClick={() => handleAddComment(post.id)} className="btn btn-secondary">Comment</button>
          </div>
        </div>
      ))}
    </div>
  );
}
