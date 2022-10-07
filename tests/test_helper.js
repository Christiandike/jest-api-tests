const Blog = require('../models/Blog');
const User = require('../models/User');

const initialBlogs = [
  {
    title: 'abc',
    author: 'abc',
    url: 'abc.com',
    likes: 2,
  },
  {
    title: 'xyz',
    author: 'xyz',
    url: 'xyz.com',
    likes: 4,
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs;
};

const usersInDB = async () => {
  const users = await User.find({});
  return users;
};

module.exports = {
  initialBlogs,
  blogsInDB,
  usersInDB,
};
