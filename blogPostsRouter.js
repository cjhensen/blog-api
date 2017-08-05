'use strict';

// require express
const express = require('express');

// use express router for modular routes
const router = express.Router();

// bring in the BlogPosts model
const {BlogPosts} = require('./models');

// create a few blog posts
BlogPosts.create(
  'My First Blog Post',
  'This is the content of my first blog post',
  'Christian Hensen'
  );
BlogPosts.create(
  'My Second Blog Post',
  'This is the content of my second blog post',
  'Christian Hensen'
  );
BlogPosts.create(
  'My Third Blog Post',
  'This is the content of my third blog post',
  'Christian Hensen'
  );

// GET
// get all blog posts on /blog-posts endpoint
router.get('/', (request, response) => {
  // response.send vs response.json?
  response.json(BlogPosts.get());
});

// POST
router.post('/', (request, response) => {
});

// PUT
router.put('/', (request, response) => {
});

// DELETE
router.delete('/', (request, response) => {
});

// Export the router module
module.exports = router;