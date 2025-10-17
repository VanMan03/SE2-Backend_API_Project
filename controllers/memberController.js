const Member = require('../models/memberModels');
// Get all members
exports.getMembers = async (req, res) => {
try {
const members = await Member.find();
res.json(members);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
// Get member by ID
exports.getMember = async (req, res) => {
try {
const member = await Member.findById(req.params.id);
if (!member) return res.status(404).json({ error: 'Member does not exist' });
res.json(member);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
// Create member
exports.createMember = async (req, res) => {
try {
const newMember = await Member.create(req.body);
res.status(201).json(newMember);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
// Update member
exports.updateMember = async (req, res) => {
try {
const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true
});
res.json(updatedMember);
} catch (err) {
res.status(500).json({ error: err.message });
}
};

// Delete member
exports.deleteMember = async (req, res) => {
try {
await Member.findByIdAndDelete(req.params.id);
res.json({ message: 'Member deleted' });
} catch (err) {
res.status(500).json({ error: err.message });
}
};