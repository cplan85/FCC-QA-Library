/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    const randomNumber = Math.floor(Math.random() * 1000) + 1;

    suite('POST /api/books with title => create book object/expect book object', function() {
      this.timeout(5000);
      
      const book_title = "test_title" + randomNumber;
      
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .keepOpen()
        .post('/api/books')
        .send({
          "title": book_title,
        })
        .end(function (err, res) {
          assert.equal(res.type,'application/json');
          assert.equal(res.body.title, book_title);
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .keepOpen()
        .post('/api/books')
        .send({
        })
        .end(function (err, res) {
          console.log(res.type, "resType")
          assert.equal(res.type,'text/plain');
          assert.equal(res.text, 'missing required field title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        
        chai
        .request(server)
        .keepOpen()
        .get('/api/books')
        .end(function (err, res) {
          assert.equal(res.type,'application/json');
          assert.isArray(res.body, "the body response is an array of books")
          assert.isAtLeast(res.body.length, 1);
          done();
        } )

      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const falseID = '661111fe1f3cc625d84b1111'
        chai
        .request(server)
        .keepOpen()
        .get(`/api/books/${falseID}`)
        .end(function (err, res) {
          assert.equal(res.type,'text/plain');
          assert.equal(res.text, 'no book exists');
          done();
        } )

      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){

        let request_id;
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books`)
          .end(function (err, res) {
            if (err) {
              done(err);
              return;
            }
            request_id = res.body[0]._id;
      
            chai
              .request(server)
              .keepOpen()
              .get(`/api/books/${request_id}`)
              .end(function (err, res) {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(res.type, 'application/json');
                assert.isNotNull(res.body.title);
                assert.equal(res.body._id, request_id);
                done();
              });
          });

      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
       
        let request_id;
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books`)
          .end(function (err, res) {
            if (err) {
              done(err);
              return;
            }
            request_id = res.body[0]._id;
      
            chai
              .request(server)
              .keepOpen()
              .post(`/api/books/${request_id}`)
              .send({
                "comment": "test_comment",
              })
              .end(function (err, res) {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(res.type, 'application/json');
                assert.isNotNull(res.body.title);
                assert.equal(res.body._id, request_id);
                assert.isAtLeast(res.body.comments.length, 1);
                done();
              });
          });

      });

      test('Test POST /api/books/[id] without comment field', function(done){
        
        let request_id;
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books`)
          .end(function (err, res) {
            if (err) {
              done(err);
              return;
            }
            request_id = res.body[0]._id;
      
            chai
              .request(server)
              .keepOpen()
              .post(`/api/books/${request_id}`)
              .end(function (err, res) {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(res.type,'text/plain');
                assert.equal(res.text, 'missing required field comment');
                done();
              });
          });

      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        
        const falseID = '661111fe1f3cc625d84b1111'
        chai
        .request(server)
        .keepOpen()
        .post(`/api/books/${falseID}`)
        .send({
          "comment": "test_comment",
        })
        .end(function (err, res) {
          assert.equal(res.type,'text/plain');
          assert.equal(res.text, 'no book exists');
          done();
        } )

      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        
        let request_id;
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books`)
          .end(function (err, res) {
            if (err) {
              done(err);
              return;
            }
            request_id = res.body[0]._id;
      
            chai
              .request(server)
              .keepOpen()
              .delete(`/api/books/${request_id}`)
              .end(function (err, res) {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(res.type,'text/plain');
                assert.equal(res.text, 'delete successful');
                done();
              });
          });

      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        
        const falseID = '661111fe1f3cc625d84b1111'
        chai
        .request(server)
        .keepOpen()
        .delete(`/api/books/${falseID}`)
        .end(function (err, res) {
          assert.equal(res.type,'text/plain');
          assert.equal(res.text, 'no book exists');
          done();
        })

      });

    });

  });

});
