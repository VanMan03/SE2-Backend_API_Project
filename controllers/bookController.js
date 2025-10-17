const Book = require('../models/bookModels');
// Get all books
exports.getBooks = async (req, res) => {
try {
const books = await Book.find();
res.json(books);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
// Get book by ID
exports.getBook = async (req, res) => {
try {
const book = await Book.findById(req.params.id);
if (!book) return res.status(404).json({ error: 'Book not found' });
res.json(book);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
// Create book entry
exports.createBook = async (req, res) => {
try {
const newBook = await Book.create(req.body);
res.status(201).json(newBook);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
// Update book entry
exports.updateBook = async (req, res) => {
try {
const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true
});
res.json(updatedBook);
} catch (err) {
res.status(500).json({ error: err.message });
}
};

// Delete book entry
exports.deleteBook = async (req, res) => {
try {
await Book.findByIdAndDelete(req.params.id);
res.json({ message: 'Book deleted' });
} catch (err) {
res.status(500).json({ error: err.message });
}
};