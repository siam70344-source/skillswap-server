const mongoose = require('mongoose');
// Define the Proposal schema
const proposalSchema = new mongoose.Schema({
  task_id: { type: String, required: true },
  freelancer_email: { type: String, required: true },
  proposed_budget: { type: Number, required: true },
  estimated_days: { type: Number, required: true },
  cover_note: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending' 
  },
  submitted_at: { type: Date, default: Date.now }
});
// assign the schema to a model and export it
module.exports = mongoose.model('Proposal', proposalSchema);