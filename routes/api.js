
'use strict';
const Book = require('../models/book.model');
let bodyParser = require('body-parser');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      getAllBooks(res);
    })
    
    .post(function (req, res){
      let title = req.body.title;
      createAndSaveBook(title, res );
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      removeAllBooks(res);
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      findOneBookById(bookid, res);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      postCommentToABook(bookid, comment, res)
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      removeById(bookid, res);
    });
  
};


var createAndSaveBook = function(book_title, res ) {

    if (!book_title) {
      res.status(200)
      .type('text')
      .send('missing required field title');
      return;
    }

    var newBook = new Book({title: book_title });

  
    newBook.save(function(err) {
      if (err) return console.error(err);

      let returnedBook = {_id: newBook._id, title: book_title };

      res.json(returnedBook);
      
    });

};

const getAllBooks = (res) => {
  Book.find()
  .then((doc) => {
    let result = [];
    doc.forEach(book => {
      result.push({
        title: book.title,
        _id: book._id,
        commentcount: book.comments.length
      })
    })
    res.json(result)
    
  })
  .catch((err) => {
    console.error(err);
  });
};

const findOneBookById = (_id, res) => {

  Book.findOne({_id: _id})
  .then((doc) => {

    if (!doc) {
      res.status(200)
      .type('text')
      .send('no book exists');
      return;
    }
    let resultObj = {
      title: doc.title,
      _id: doc._id,
      comments: doc.comments
    }
    
    res.json(resultObj);
  })
  .catch((err) => {
    console.error(err);
  });
};

const postCommentToABook = (_id, newComment, res) => {
  if (!newComment){
    res.status(200)
    .type('text')
    .send('missing required field comment');
    return;
  }
  Book.findById(_id)
  .then((doc) => {
    if (!doc) {
      res.status(200)
      .type('text')
      .send('no book exists');
      return;
    }
    let updatedComments = doc.comments;
    updatedComments.push(newComment);
    doc.comments = updatedComments;

    doc.save();

    let resultObj = {
      title: doc.title,
      _id: doc._id,
      comments: updatedComments
    }
    
    res.json(resultObj);
  })
  .catch((err) => {
    console.error(err);
  });
};

const removeById = (bookId, res) => {
  Book.findOneAndRemove({ _id: bookId }, function(err, book) {
    if(!book) {
      res.status(200)
      .type('text')
      .send('no book exists');
      return
    }
    if (err) return console.error(err);
    res.status(200)
    .type('text')
    .send('delete successful');
  })
};

const removeAllBooks = (res) => {
  Book.find({ }, function(err, book) {
    if (err) return console.error(err);
    Book.remove({ }, function(err, book) {
      if (err) return console.error(err);
      res.status(200)
      .type('text')
      .send('complete delete successful');
    });
  })
};