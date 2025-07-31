import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = new Blog({ title, content, author });
    await blog.save();

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username")
    .populate("comments.user", "username");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const userId = req.user.id;

    if (blog.likes.includes(userId)) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ likes: blog.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Error liking blog", error });
  }
};

export const commentOnBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const newComment = {
      user: req.user.id,
      text: req.body.comment,
    };
    console.log("comment:",newComment)
    blog.comments.push(newComment);
    await blog.save();
    const populatedBlog = await blog.populate('comments.user', 'username');
    res.json(populatedBlog.comments);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

