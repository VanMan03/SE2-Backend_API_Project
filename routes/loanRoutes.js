const express = require('express');
const router = express.Router();

const loanController = require('../controllers/loanController');
router.get('/loans', loanController.getLoans);
router.get('/loans/:id', loanController.getLoan);
router.post('/loans', loanController.createLoan);
router.put('/loans/:id', loanController.updateLoan);
router.delete('/loans/:id', loanController.deleteLoan);
module.exports = router;