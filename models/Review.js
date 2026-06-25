const mongoose = require('mongoose');
// Define the Review schema
const reviewSchema = new mongoose.Schema({
  task_id: { type: String, required: true },
  reviewer_email: { type: String, required: true },
  reviewee_email: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});
// assign the schema to a model and export it
module.exports = mongoose.model('Review', reviewSchema);