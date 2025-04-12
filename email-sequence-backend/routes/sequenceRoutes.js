const express = require('express');
const router = express.Router();
const sequenceController = require('../controllers/sequenceController');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// Get all sequences
router.get('/', sequenceController.getSequences);

// Get specific sequence
router.get('/:id', sequenceController.getSequence);

// Create sequence
router.post('/', sequenceController.createSequence);

// Update sequence
router.put('/:id', sequenceController.updateSequence);

// Delete sequence
router.delete('/:id', sequenceController.deleteSequence);

module.exports = router;