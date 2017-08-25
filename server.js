'use strict';

// require express
const express = require('express');

// require mongoose
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

// use express router for modular routes
const router = express.Router();

// create new app
const app = express();

// require the blogPostsRouter to route requests
const blogPostsRouter = require('./blogPostsRouter');

// setting up public directory
app.use(express.static('public'));

// using our blogPostsRouter for routing requests
app.use('/posts', blogPostsRouter);

// serve app to port
// app.listen(process.env.PORT || 8080, () => console.log(
  // `Your app is listening on port ${process.env.PORT || 8080}`));

app.use('*', function(request, response) {
  response.status(404).json({message: 'Not found'});
});


let server;

// serve app to port
// function runServer() {
//   const port = process.env.PORT || 8080;
//   return new Promise((resolve, reject) => {
//     server = app.listen(port, () => {
//       console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
//       resolve(server);
//     }).on('error', err => {
//       reject(err);
//     });
//   });
// }

// connect to the database then start the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// function closeServer() {
//   return new Promise((resolve, reject) => {
//     console.log('Closing server');
//     server.close(err => {
//       if(err) {
//         reject(err);
//         return;
//       }
//       resolve();
//     });
//   });
// }

// close the server and return a promise. Promise used in integration tests
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// runServer if called by node server.js, but if testing, don't run server 
//automatically because of asynch stuff
if(require.main === module) {
  runServer().catch(err => console.log(err));
};

module.exports = {
  app, 
  runServer, 
  closeServer
};