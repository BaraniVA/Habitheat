import React, { useEffect, useState } from "react";
import { fetchBlogs, postBlog ,likeBlog,commentOnBlog} from "../utils/api";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  likes?: string[]; // Array of user IDs
  comments?: {
    _id?: string;
    user: {
      _id: string;
      username: string;
    };
    text: string;
    createdAt?: string;
  }[];
  createdAt?: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const loadBlogs = async () => {
    try {
      const data = await fetchBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  };

  const handlePost = async () => {
    if (!title || !content) return alert("Title and Content are required!");

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in to post a blog.");

      const newBlog = await postBlog({ title, content }, token);
      setBlogs([newBlog, ...blogs]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error posting blog:", error);
      alert("Failed to post blog.");
    }
  };

const handleLike = async (blogId: string) => {
  try {
    await likeBlog(blogId);
    loadBlogs();
  } catch (err) {
    console.error("Like failed:", err);
  }
};

const handleComment = async (blogId: string, comment: string) => {
    console.log("Received blogId:", blogId); // Check this
  if (!comment) return;

  try {
    await commentOnBlog({blogId, comment});
    setCommentInputs({ ...commentInputs, [blogId]: "" });
    loadBlogs();
  } catch (err) {
    console.error("Comment failed:", err);
  }
};

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
  <div className="p-6 max-w-7xl mx-auto">
    {/* 📝 Blog Writing Form */}
    <div className="border-2 border-orange-500 rounded-xl p-6 mb-10 shadow-md bg-white">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-4">Write a Blog</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-400"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        className="w-full p-3 mb-4 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-orange-400"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handlePost}
        className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
      >
        🚀 Post Blog
      </button>
    </div>

    {/* 🗂 Blog Cards */}
    <h2 className="text-2xl font-bold mb-6 text-gray-800">All Blogs</h2>
    {blogs.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="border rounded-xl p-5 shadow-md bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
            <p className="text-gray-700 mb-3">{blog.content}</p>
            <p className="text-sm text-gray-500 mb-2">
              Posted by: <b>{blog.author?.username || "Unknown"}</b>
            </p>

            {/* Likes */}
            <button
              onClick={() => handleLike(blog._id)}
              className="text-sm text-blue-600 underline mb-2"
            >
              👍 Like ({blog.likes?.length || 0})
            </button>

            {/* Comments */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Comments</h4>
              {blog.comments?.length ? (
                blog.comments.map((comment, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    <b>{comment.user?.username || "User"}:</b> {comment.text}
                  </p>
                ))
              ) : (
                <p className="text-sm italic text-gray-400">No comments yet</p>
              )}
              {/* Add Comment */}
              <input
                type="text"
                className="w-full mt-3 p-2 border rounded focus:ring-1 focus:ring-blue-500"
                placeholder="Add a comment..."
                value={commentInputs[blog._id] || ""}
                onChange={(e) =>
                  setCommentInputs({ ...commentInputs, [blog._id]: e.target.value })
                }
              />
              <button
                onClick={() => handleComment(blog._id, commentInputs[blog._id] || "")}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                💬 Submit
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 italic">No blogs available.</p>
    )}
  </div>
);
}

export default Blogs;
