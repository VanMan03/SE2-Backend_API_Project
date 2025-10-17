const express = require('express');
const router = express.Router();

const memberController = require('../controllers/memberController');
router.get('/members', memberController.getMembers);
router.get('/members/:id', memberController.getMember);
router.post('/members', memberController.createMember);
router.put('/members/:id', memberController.updateMember);
router.delete('/members/:id', memberController.deleteMember);
module.exports = router;