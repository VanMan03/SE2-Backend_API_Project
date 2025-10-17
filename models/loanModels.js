const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId,  
                ref: 'Member',                         
                required: true  },
    bookId: { type: mongoose.Schema.Types.ObjectId,
              ref: 'Book', 
              required: true },
    loanedAt: {type: Date, default: Date.now}, 
    dueAt: {type: Date, required: true},
    returnedAt: {type: Date, default: null}
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);