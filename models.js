// require uuid for generating ID's
const uuid = require('uuid');


// StorageException
function StorageException(message) {
  this.message = messsage;
  this.name = "StorageException";
}


// blog posts model
const BlogPosts = {
  create: function(title, content, author, publishDate) {
    const post = {
      id: uuid.v4(),
      title: title,
      content: content,
      author: author,
      publishDate: publishDate || Date.now()
    };
    this.posts.push(post);
    return post;
  },
  get: function(id=null) {
    // if the id is passed in, retrieve a single post,
    // otherwise the default id is null and we retrieve all posts
    if(id !== null) {
      // for each post in posts, check the ids and return the mathing post
      return this.posts.find((post) => post.id === id);
    }

    // if id is null
    // return all posts in descending order
    return this.posts.sort(function(a,b) {
      return b.publishDate - a.publishDate;
    });
  },
  delete: function(id) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if(postIndex > -1) {
      this.posts.splice(postIndex, 1);
    }
  },
  update: function(updatedPost) {
    const {id} = updatedPost;
    const postIndex = this.posts.findIndex((post) => post.id === updatedPost.id);
    if(postIndex === -1) {
      throw StorageException(`Can't update item \`${id}\` because doesn't exist.`);
    }
    // used the passed in body data to overwrite the existing post
    this.posts[postIndex] = Object.assign(this.posts[postIndex], updatedPost);
    return this.posts[postIndex];
  }
};

function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}

module.exports = {BlogPosts: createBlogPostsModel()};