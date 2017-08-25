const mongoose = require('mongoose');


const blogpostSchema = mongoose.Schema({
  title: String,
  author: {
    firstName: String,
    lastName: String
  },
  content: String
});

blogpostSchema.virtual('authorNameString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogpostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    author: this.authorNameString,
    content: this.content
  }
}

const Blogpost = mongoose.model('Blogpost', blogpostSchema);


module.exports = {Blogpost};