const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  copies: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);