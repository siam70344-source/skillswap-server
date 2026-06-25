const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Task = require('../models/Task');

// Create Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { taskId, taskTitle, amount, clientEmail, freelancerEmail } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: taskTitle },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/client`,
      metadata: { taskId, clientEmail, freelancerEmail }
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Confirm payment session
router.get('/confirm-session', async (req, res) => {
  const { session_id } = req.query;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      const { taskId, clientEmail, freelancerEmail } = session.metadata;

      // Save payment
      const existing = await Payment.findOne({ transaction_id: session.id });
      if (!existing) {
        await Payment.create({
          client_email: clientEmail,
          freelancer_email: freelancerEmail,
          task_id: taskId,
          amount: session.amount_total / 100,
          transaction_id: session.id,
          payment_status: 'completed',
        });
        // Update task status
        await Task.findByIdAndUpdate(taskId, { status: 'in-progress' });
      }

      const payment = await Payment.findOne({ transaction_id: session.id });
      res.json({ success: true, payment, session });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paid_at: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payments by email
router.get('/freelancer/:email', async (req, res) => {
  try {
    const payments = await Payment.find({ 
      freelancer_email: req.params.email,
      payment_status: 'completed'
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;