import express from 'express';
import { createBlog, getBlogs,likeBlog,commentOnBlog } from '../controllers/blogController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/writeBlogs', authMiddleware, createBlog);
router.get('/blogs', getBlogs);

router.post('/:id/like', authMiddleware, likeBlog);
router.post('/:id/comment', authMiddleware, commentOnBlog);


export default router;
