const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.post('/', loanController.createLoan);
router.put('/:id', loanController.replaceLoan); // if exists
router.patch('/:id', loanController.updateLoan); // PATCH used by frontend to mark returned
router.delete('/:id', loanController.deleteLoan);

module.exports = router;