'use strict';

// require express
const express = require('express');

// create new app
const app = express();

// setting up public directory
app.use(express.static('public'));

// serve app to port
app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080}`));