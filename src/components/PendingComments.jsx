import React, { useEffect, useState } from "react";

const PendingComments = () => {
  const [comments, setComments] = useState([]);

  const fetchPendingComments = async () => {
    try {
      const res = await fetch("http://localhost/college_api/admin_pending_comments.php", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingComments();
  }, []);

  const approveComment = async (id) => {
    try {
      const res = await fetch("http://localhost/college_api/approve.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "comment" }),
      });
      const data = await res.json();
      if (data.success) setComments(comments.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Comments</h2>
      {comments.length === 0 && <p>No pending comments</p>}
      {comments.map((comment) => (
        <div key={comment.id} className="border border-gray-300 p-4 mb-3 rounded">
          <p>{comment.content}</p>
          <p className="text-sm text-gray-500">
            Comment by {comment.author_type === "admin" ? "🛡️ Admin" : `🎓 ${comment.author_name}`} 
            {comment.author_id ? ` (ID: ${comment.author_id})` : ""} on Post ID: {comment.post_id}
          </p>
          <button
            onClick={() => approveComment(comment.id)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default PendingComments;
