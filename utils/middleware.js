const logger = require('./logger');
const jwt = require('jsonwebtoken');
const config = require('./config');

const reqLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:', req.path);
  logger.info('Body:', req.body);
  next();
};

const userExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    req.user = jwt.verify(token, config.SECRET);
  }
  next();
};

const errHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  }

  next(err);
};

const unknownEndpoint = (req, res) =>
  res.status(404).json({ error: 'unknown endpoint' });

module.exports = {
  reqLogger,
  errHandler,
  unknownEndpoint,
  userExtractor,
};
