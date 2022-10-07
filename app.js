const express = require('express');
// require('express-async-errors')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogRouter = require('./controllers/blogController');
const middleware = require('./utils/middleware');
const userRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginController')

mongoose
  .connect(config.MONGO_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch(() => logger.error('failed to connect to MongoDB'));

app.use(cors())
app.use(express.json());
app.use(middleware.reqLogger);

app.use('/api/blogs', middleware.userExtractor, blogRouter);
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint);
app.use(middleware.errHandler);

module.exports = app;
