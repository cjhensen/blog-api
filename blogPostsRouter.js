'use strict';

// require express
const express = require('express');

// require bodyParser
const bodyParser = require('body-parser');

// use jsonParser: gives access to the request bodu
const jsonParser = bodyParser.json();

// use express router for modular routes
const router = express.Router();

// bring in the BlogPosts model
// const {BlogPosts} = require('./models');

const {Blogpost} = require('./models2');


// HTTP Status Codes:
// 200 OK
// 201 Created
// 204 No content to respond with
// 202 Accepted
// 400 Bad request
// 500 Internal Server Error

// get all posts
router.get('/', (request, response) => {
  Blogpost
    .find()
    // ? exec
    .exec()
    .then(blogposts => {
      // console.log('blogposts', blogposts);
      response.json({
        blogposts: blogposts.map(
          (blogpost) => blogpost.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

// get posts by id
router.get('/:id', (request, response) => {
  console.log('id', request.params.id);
  Blogpost
    .findById(request.params.id)
    .exec()
    .then(blogpost => response.json(blogpost.apiRepr()))
    .catch(err => {
      console.error(err);
      response.status(500).json({message: 'Internal server error'});
    });
});

// create a new blog post
router.post('/', jsonParser, (request, response) => {
  const requiredFields = ['title', 'content', 'author'];
  for(let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in request.body)){
      const message = `Missing \'${field}\' in request body`;
      console.error(message);
      return response.status(400).send(message);
    }
  }

  Blogpost
    .create({
      title: request.body.title,
      content: request.body.content,
      author: request.body.author
    })
    .then(
      blogpost => response.status(201).json(blogpost.apiRepr()))
    .catch(err => {
      console.error(err);
      response.status(500).json({message: 'Internal server error'});
    });
});

// update an existing blog post with id
router.put('/:id', jsonParser, (request, response) => {
  console.log('PUT');
  console.log('body', request.body);
  if(request.params.id !== request.body.id) {
    const message = (`Request path id (${request.params.id} and request body id (${request.body.id} must match`);
    console.error(message);
    response.status(400).json({message: message});
  }

  const fieldsToUpdate = {};
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if(field in request.body) {
      fieldsToUpdate[field] = request.body[field];
    }
  });

  Blogpost
    .findByIdAndUpdate(request.params.id, {$set: fieldsToUpdate}, {new: true})
    .exec()
    .then(blogpost => response.status(204).end())
    .catch(err => response.status(500).json({message: 'Internal server error'}));
});


router.delete('/:id', (request, response) => {
  Blogpost
    .findByIdAndRemove(request.params.id)
    .exec()
    .then(blogpost => response.status(204).end())
    .catch(err => response.status(500).json({message: 'Internal server error'}));
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// GET: get all blog posts
// router.get('/', (request, response) => {
//   // response.send vs response.json?
//   console.log('Getting all blog posts');
//   response.json(BlogPosts.get());
// });

// // GET: get a single blog post by ID
// router.get('/:id', (request, response) => {
//   const id = request.params.id;
//   console.log(`Getting Blog post for ID: ${id}`);
//   response.json(BlogPosts.get(id));
// });


// POST: adding a new blog post
// jsonParser gives access to request.body
// router.post('/', jsonParser, (request, response) => {
//   // make sure that these fields are in the request
//   const requiredFields = ['title', 'content', 'author'];
//   for(let i = 0; i < requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if(!(field in request.body)) {
//       const errorMessage = `Field ${field} is missing from request body.`;
//       console.log(errorMessage);
//       // 400: bad request
//       return response.status(400).send(errorMessage);
//     } 
//   }

  // must do this outside of the for loop
  // const item = BlogPosts.create(request.body.title, request.body.content, request.body.author);
  // response.status(201).json(item);
  // ? Why use .json and not .send
    // response.status(200).send(item);
// });


// PUT: updating an existing blog post by id
// router.put('/:id', jsonParser, (request, response) => {
//   // make sure that these fields are in the request
//   const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
//   for(let i = 0; i < requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if(!(field in request.body)) {
//       const errorMessage = `Field ${field} is missing from request body.`;
//       console.log(errorMessage);
//       // 400: bad request
//       return response.status(400).send(errorMessage);
//     }
//   }

  // Check to make sure the request id and body id match
//   if(request.params.id !== request.body.id) {
//     const errorMessage = `Request id: ${request.params.id} and body id: ${request.body.id} must match`;
//     // 400: bad request
//     return response.status(400).send(errorMessage);
//   }

//   console.log(`Updating recipe: ${request.params.id}`);
//   BlogPosts.update({
//     id: request.params.id,
//     title: request.body.title,
//     content: request.body.content,
//     author: request.body.author,
//     publishDate: request.body.publishDate
//   });

//   // 204: successful and no content to return with
//   response.status(204).end();
//   // ? Why no return here
// });


// DELETE: delete a blog post by id
// router.delete('/:id', (request, response) => {
//   BlogPosts.delete(request.params.id);
//   console.log(`Deleted blog post with id: ${request.params.id}`);
//   // 204: successful and no content to return with
//   response.status(204).end();
// });


// Export the router module
module.exports = router;