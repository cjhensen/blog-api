'use strict';

// require express
const express = require('express');

// use express router for modular routes
const router = express.Router();

// create new app
const app = express();

// require the blogPostsRouter to route requests
const blogPostsRouter = require('./blogPostsRouter');

// setting up public directory
app.use(express.static('public'));

// using our blogPostsRouter for routing requests
app.use('/blog-posts', blogPostsRouter);

// serve app to port
app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080}`));