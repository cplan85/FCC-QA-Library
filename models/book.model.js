const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    comments: {
      type: [String]
    }

  });
  module.exports =  mongoose.model('Book', bookSchema);