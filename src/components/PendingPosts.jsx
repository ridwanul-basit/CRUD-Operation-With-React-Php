import React, { useEffect, useState } from "react";

const PendingPosts = () => {
  const [posts, setPosts] = useState([]);

  const fetchPendingPosts = async () => {
    try {
      const res = await fetch("http://localhost/college_api/admin_pending_posts.php", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const approvePost = async (id) => {
    try {
      const res = await fetch("http://localhost/college_api/approve.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "post" }),
      });
      const data = await res.json();
      if (data.success) setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Posts</h2>
      {posts.length === 0 && <p>No pending posts</p>}
      {posts.map((post) => (
        <div key={post.id} className="border border-gray-300 p-4 mb-3 rounded">
          <h3 className="font-semibold">{post.title}</h3>
          <p>{post.content}</p>
          <p className="text-sm text-gray-500">
            Posted by {post.author_type === "admin" ? "🛡️ Admin" : `🎓 ${post.author_name}`} 
            {post.author_id ? ` (ID: ${post.author_id})` : ""}
          </p>
          <button
            onClick={() => approvePost(post.id)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default PendingPosts;
