import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [commentText, setCommentText] = useState({}); // key = postId

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_my_posts.php", { credentials: "include" });
      const data = await res.json();
      if(data.success) setPosts(data.posts);
    } catch(err){
      console.error(err);
      Swal.fire("Error","Failed to fetch posts","error");
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch("http://localhost/college_api/add_post.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      });
      const data = await res.json();
      if(data.success){
        Swal.fire("Success", data.message, "success");
        setNewPost({ title: "", content: "" });
        fetchPosts();
      } else Swal.fire("Error", data.message, "error");
    } catch {
      Swal.fire("Error","Something went wrong","error");
    }
  };

  const handleAddComment = async (postId) => {
    if(!commentText[postId]) return;
    try{
      const res = await fetch("http://localhost/college_api/add_comment.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, author_name: "Admin", content: commentText[postId] })
      });
      const data = await res.json();
      if(data.success){
        Swal.fire("Success", data.message, "success");
        setCommentText({ ...commentText, [postId]: "" });
        fetchPosts();
      } else Swal.fire("Error", data.message, "error");
    } catch {
      Swal.fire("Error","Something went wrong","error");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-bold">📝 Posts</h2>

      {/* Create Post */}
      <form onSubmit={handleCreatePost} className="flex flex-col gap-2">
        <input type="text" placeholder="Title" value={newPost.title} onChange={e => setNewPost({...newPost, title:e.target.value})} className="input input-bordered" />
        <textarea placeholder="Content" value={newPost.content} onChange={e => setNewPost({...newPost, content:e.target.value})} className="textarea textarea-bordered" />
        <button className="btn btn-primary w-1/4">Post</button>
      </form>

      {/* List of Posts */}
      {posts.map(post => (
        <div key={post.id} className="bg-white p-4 rounded shadow space-y-2">
          <h3 className="font-semibold">{post.title}</h3>
          <p>{post.content}</p>
          <div className="space-y-1">
            <h4 className="font-semibold">Comments:</h4>
            {post.comments.map(c => (
              <p key={c.id} className="pl-2 border-l-2 border-gray-300">{c.author_name}: {c.content}</p>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input type="text" placeholder="Add comment..." value={commentText[post.id] || ""} onChange={e => setCommentText({...commentText, [post.id]: e.target.value})} className="input input-bordered flex-1"/>
            <button type="button" onClick={() => handleAddComment(post.id)} className="btn btn-secondary">Comment</button>
          </div>
        </div>
      ))}
    </div>
  );
}
