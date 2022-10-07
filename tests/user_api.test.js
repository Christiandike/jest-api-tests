const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const helper = require('./test_helper');

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('secret', 10);
  await new User({ username: 'root', passwordHash }).save();
});

describe('creation of a user:', () => {
  test('succeeds with valid data', async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      name: 'chris dike',
      username: 'chrisdike',
      password: 'secret',
    };

    await api.post('/api/users').send(newUser).expect(201);

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
  });

  test('fails with statuscode 400 if username is too short', async () => {
    const newUser = {
      username: 'ab',
      password: 'abcdef',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });

  test('fails with statuscode 400 if password is too short', async () => {
    const newUser = {
      username: 'abcdef',
      password: 'ab',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });

  test('fails with statuscode 400 if username is missing', async () => {
    const newUser = {
      name: 'abc def',
      password: 'abcdef',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });

  test('fails with statuscode 400 if password is missing', async () => {
    const newUser = {
      username: 'abcdef',
      name: 'abc def',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });

  test('fails with statuscode 400 if username is not unique', async () => {
    const newUser = {
      username: 'root',
      password: 'secret',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });
});

afterAll(() => mongoose.connection.close());
