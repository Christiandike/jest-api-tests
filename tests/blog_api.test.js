const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/Blog');
const User = require('../models/User');
const api = supertest(app);
const helper = require('./test_helper');
const bcrypt = require('bcryptjs');

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    await new Blog(blog).save();
  }

  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('secret', 10);
  await new User({ username: 'root', passwordHash }).save();
});

describe('when fetching saved blogs:', () => {
  test('blogs are returned in JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blogs return ID property', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe('addition of new blog:', () => {
  test('succeeds with valid data and token authentication', async () => {
    const login = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' });

    const token = login.body.token;

    const newBlog = {
      title: 'antifragile',
      author: 'nassim taleb',
      url: 'www.incerto.com',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const authors = blogsAtEnd.map((b) => b.author);
    expect(authors).toContain('nassim taleb');
  });

  test('fails with statuscode 400 if data is invalid', async () => {
    const newBlog = {
      author: 'nassim taleb',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('defaults like property to zero', async () => {
    const login = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' });

    const token = login.body.token;

    const newBlog = {
      title: 'antifragile',
      author: 'nassim taleb',
      url: 'www.incerto.com',
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`);

    expect(response.body.likes).toBe(0);
  });

  test('fails with statuscode 401 if token is missing', async () => {
    await api
      .post('/api/blogs')
      .send({ title: 'antifragile', url: 'www.incerto.com' })
      .expect(401);
  });
});

describe('deletion of a blog:', () => {
  test('succeeds with statuscode 204 if id is valid', async () => {
    const blogs = await api.get('/api/blogs');
    const idToDelete = blogs.body[0].id;

    await api.delete(`/api/blogs/${idToDelete}`).expect(204);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  });
});

describe('updating a blog:', () => {
  test('succeeds with statuscode 200 if id is valid', async () => {
    const blogs = await api.get('/api/blogs');
    const idToUpdate = blogs.body[0].id;
    const updatedItem = {
      likes: 150,
    };

    const response = await api
      .put(`/api/blogs/${idToUpdate}`)
      .send(updatedItem)
      .expect(200);

    expect(response.body.likes).toBe(updatedItem.likes);
  });
});
afterAll(() => mongoose.connection.close());
