const blogRouter = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

blogRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

blogRouter.post('/', async (req, res, next) => {
  try {
    const { author, title, url, likes } = req.body;
    const user = req.user;

    if (!title || !url) {
      return res.status(400).json({ error: 'title and url required' });
    }

    if (!user) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const userInDb = await User.findById(user.id);

    const savedBlog = await new Blog({
      author,
      title,
      url,
      likes: likes === undefined ? 0 : likes,
      user: userInDb._id,
    }).save();

    userInDb.blogs = userInDb.blogs.concat(savedBlog._id);
    await userInDb.save();

    res.status(201).json(savedBlog);
  } catch (err) {
    next(err);
  }
});

blogRouter.delete('/:id', async (req, res, next) => {
  try {
    const user = req.user;

    // if unaccompanied by a token, do nothing further
    if (!user.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const blogToDelete = await Blog.findById(req.params.id);

    if (user.id !== blogToDelete.user.toString()) {
      return res.status(401).json({ error: 'unauthorized user' });
    }

    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).json({ success: 'deleted successfully' });
  } catch (err) {
    next(err);
  }
});

blogRouter.put('/:id', async (req, res, next) => {
  try {
    const updatedItem = {
      likes: req.body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedItem,
      { new: true }
    );

    res.json(updatedBlog);
  } catch (err) {
    next(err);
  }
});

module.exports = blogRouter;
