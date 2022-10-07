const userRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }

    if (username.length < 3 || password.length < 3) {
      return res
        .status(400)
        .json({ error: 'username and password must be at least 3 characters' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: 'username must be unique' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const savedUser = await new User({
      username,
      name,
      passwordHash,
    }).save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
