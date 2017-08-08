const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog API', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });


  it('should list all blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(response) {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.be.at.least(1);
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        response.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });        
      });
  });

  it('should list a single blog post with a specified ID on GET', function() {
    let testId;
    return chai.request(app)
      .get('/blog-posts')
      .then(function(response) {
        testId = response.body[0].id;
        return chai.request(app)
          .get(`/blog-posts/${testId}`);
      })
      .then(function(response) {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        expectedKeys.forEach(function(key) {
          response.body.should.have.own.property(key);
        });
      });
  });

  it('should add a new blog post on POST', function() {
    const newBlogPost = {
      title: "New post",
      content: "New post content",
      author: "Author Name",
    };

    return chai.request(app)
      .post('/blog-posts')
        .send(newBlogPost)
        .then(function(response) {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
          response.body.id.should.not.be.null;
          response.body.should.deep.equal(Object.assign(newBlogPost, {id: response.body.id, publishDate: response.body.publishDate}));
        });
  });

  it('should update an existing blog post on PUT', function() {
    const updateData = {
      title: "updated title",
      content: "updated content",
      author: "updated author",
    };

    return chai.request(app)
      .get('/blog-posts')
      .then(function(response) {
        updateData.id = response.body[0].id; 
        updateData.publishDate = response.body[0].publishDate;    

        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
      })
      .then(function(response) {
        response.should.have.status(204);
        response.body.should.be.a('object');
        // ? deep equal?
      });
  });

  it('should delete an existing blog post on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(response) {
        return chai.request(app)
          .delete(`/blog-posts/${response.body[0].id}`);
      })
      .then(function(response) {
        response.should.have.status(204);
      });
  });

});