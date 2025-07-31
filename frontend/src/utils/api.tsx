const API_BASE_URL = "http://localhost:5000/api/blogs";

// ✅ Fetch blogs
export const fetchBlogs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs`);
    if (!res.ok) throw new Error("Failed to fetch blogs");
    return await res.json();
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return [];
  }
};

// ✅ Post a blog
export const postBlog = async ({ title, content }: { title: string; content: string }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_BASE_URL}/writeBlogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) throw new Error("Failed to post blog");
    return await res.json();
  } catch (err) {
    console.error("Error posting blog:", err);
    throw err;
  }
};

// ✅ Like a blog
export const likeBlog = async (blogId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_BASE_URL}/${blogId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to like blog");
    return await res.json(); // returns { likes: count }
  } catch (err) {
    console.error("Error liking blog:", err);
    throw err;
  }
};

// ✅ Comment on a blog
export const commentOnBlog = async ({ blogId, comment }: { blogId: string; comment: string }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${blogId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ comment }),
    });

    if (!res.ok) throw new Error("Failed to comment");
    return await res.json();
  } catch (err) {
    console.error("Error commenting on blog:", err);
    throw err;
  }
};
