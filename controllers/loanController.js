const mongoose = require('mongoose');
const Loan = require('../models/loanModels');
const Book = require('../models/bookModels');

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate('memberId').populate('bookId');
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('memberId').populate('bookId');
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

exports.replaceLoan = async (req, res) => {
  try {
    const updated = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('memberId').populate('bookId');
    if (!updated) return res.status(404).json({ error: 'Loan not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

    if (returnedAt) {
      if (loan.returnedAt) {
        await session.abortTransaction();
        return res.status(400).json({ error: 'Loan already returned' });
      }

      loan.returnedAt = returnedAt;
      await loan.save({ session });

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

exports.deleteLoan = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const loan = await Loan.findById(req.params.id).session(session);
    if (!loan) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Loan not found' });
    }

    const book = await Book.findById(loan.bookId).session(session);
    if (book && loan.returnedAt === null || loan.returnedAt === undefined) {
      book.copies = (book.copies || 0) + 1;
      await book.save({ session });
    }

    await Loan.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Loan deleted' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('deleteLoan error:', err);
    res.status(500).json({ error: err.message });
  }
};