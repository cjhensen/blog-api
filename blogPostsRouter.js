'use strict';

// require express
const express = require('express');

// require bodyParser
// const bodyParser = require('body-parser');

// use jsonParser
// const jsonParser = bodyParser.json();

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


// GET: get all blog posts
router.get('/', (request, response) => {
  // response.send vs response.json?
  console.log('Getting all blog posts');
  response.json(BlogPosts.get());
});

// GET: get a single blog post by ID
router.get('/:id', (request, response) => {
  const id = request.params.id;
  console.log(`Getting Blog post for ID: ${id}`);
  response.json(BlogPosts.get(id));
});


// POST: adding a new blog post
router.post('/', (request, response) => {
});


// PUT: updating an existing blog post by id
router.put('/:id', (request, response) => {
});


// DELETE: delete a blog post by id
router.delete('/:id', (request, response) => {
});


// Export the router module
module.exports = router;