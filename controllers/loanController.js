const Loan = require('../models/loanModels');
const Member = require('../models/memberModels');
const Book = require('../models/bookModels');

// Get all loans
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('memberId', 'name email') // Get member info
      .populate('bookId', 'title author'); // Get book info
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get loan by ID
exports.getLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('memberId', 'name email')
      .populate('bookId', 'title author');
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a loan
exports.createLoan = async (req, res) => {
  try {
    const { memberId, bookId, dueAt } = req.body;

    // Checks if member exists
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    // Checks if book exists
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Check if book copies are available
    if (book.copies < 1) return res.status(400).json({ error: 'No copies available' });

    // Create loan
    const newLoan = await Loan.create({ memberId, bookId, dueAt });
    
    
    book.copies -= 1;
    await book.save();

    res.status(201).json(newLoan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a loan 
exports.updateLoan = async (req, res) => {
  try {
    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLoan) return res.status(404).json({ error: 'Loan not found' });
    res.json(updatedLoan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a loan
exports.deleteLoan = async (req, res) => {
  try {
    const deletedLoan = await Loan.findByIdAndDelete(req.params.id);
    if (!deletedLoan) return res.status(404).json({ error: 'Loan not found' });

    // increment book copies back
    const book = await Book.findById(deletedLoan.bookId);
    if (book) {
      book.copies += 1;
      await book.save();
    }

    res.json({ message: 'Loan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
