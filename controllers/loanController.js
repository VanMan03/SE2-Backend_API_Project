const mongoose = require('mongoose');
const Loan = require('../models/loanModels');
const Book = require('../models/bookModels');
const Member = require('../models/memberModels'); // if needed

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

// Create loan (decrement book.copies)
exports.createLoan = async (req, res) => {
  const { memberId, bookId, loanedAt, dueAt } = req.body;
  if (!memberId || !bookId || !loanedAt || !dueAt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const book = await Book.findById(bookId).session(session);
    if (!book) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Book not found' });
    }
    if ((book.copies || 0) <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'No copies available' });
    }

    const loan = await Loan.create([{
      memberId, bookId, loanedAt, dueAt
    }], { session });

    // decrement copies
    book.copies = (book.copies || 0) - 1;
    await book.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await Loan.findById(loan[0]._id).populate('memberId').populate('bookId');
    return res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('createLoan error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Update loan (used for marking returned via PATCH /api/loans/:id)
exports.updateLoan = async (req, res) => {
  const { id } = req.params;
  const { returnedAt, ...rest } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const loan = await Loan.findById(id).session(session);
    if (!loan) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Loan not found' });
    }

    // If marking returned
    if (returnedAt) {
      if (loan.returnedAt) {
        await session.abortTransaction();
        return res.status(400).json({ error: 'Loan already returned' });
      }

      loan.returnedAt = returnedAt;
      await loan.save({ session });

      // increment book copies
      const book = await Book.findById(loan.bookId).session(session);
      if (book) {
        book.copies = (book.copies || 0) + 1;
        await book.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      const updated = await Loan.findById(id).populate('memberId').populate('bookId');
      return res.json(updated);
    }

    // generic partial update (not changing copies)
    Object.assign(loan, rest);
    await loan.save({ session });

    await session.commitTransaction();
    session.endSession();

    const updated = await Loan.findById(id).populate('memberId').populate('bookId');
    return res.json(updated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('updateLoan error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
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
