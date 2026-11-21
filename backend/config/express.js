/**
 * @file express.js
 * Builds and configures the Express app: CORS, request logging and
 * JSON body parsing. Mounts all API routes under /api, forwards unknown
 * URLs to a 404, and defines the central error handler that turns errors
 * into JSON responses with the right status code.
 */

const express = require('express');
var createError = require('http-errors');
var logger = require('morgan');
var cors = require('cors');

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const apiRouter = require('../app/routers');
app.use('/api', apiRouter);
app.get('/', (req, res) => res.json({ success: true, name: 'UniCon API' }));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  if (err.name === 'ValidationError') status = 400;
  if (err.name === 'CastError') status = 400;
  if (err.code === 11000) status = 409;
  res.status(status).json({
    success: false,
    message: err.message
  });
});

module.exports = app;