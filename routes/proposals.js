const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');

// Get all proposals
router.get('/', async (req, res) => {
  try {
    const { freelancerEmail, taskId } = req.query;
    let query = {};
    if (freelancerEmail) query.freelancer_email = freelancerEmail;
    if (taskId) query.task_id = taskId;
    const proposals = await Proposal.find(query).sort({ submitted_at: -1 });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit proposal
router.post('/', async (req, res) => {
  try {
    const existing = await Proposal.findOne({
      task_id: req.body.task_id,
      freelancer_email: req.body.freelancer_email
    });
    if (existing) return res.status(400).json({ error: 'Already applied to this task' });

    const proposal = new Proposal(req.body);
    await proposal.save();
    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update proposal status
router.put('/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;