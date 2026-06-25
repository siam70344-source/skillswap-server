const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  client_email: { type: String, required: true },
  freelancer_email: { type: String, required: true },
  task_id: { type: String, required: true },
  amount: { type: Number, required: true },
  transaction_id: { type: String, required: true },
  payment_status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'],
    default: 'pending' 
  },
  paid_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);