
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserPayments } = require('../controllers/paymentController');
const Payment = require('../models/Payment');
const User = require('../models/User');


router.get('/mine', protect, getUserPayments);

// admin only: view all payments
router.get('/admin', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can view all payments' });
  }

  const payments = await Payment.find()
    .populate('user', 'name email')
    .sort({ paidAt: -1 });

  res.json(payments);
});

router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'member') {
    return res.status(403).json({ message: 'Only members can pay' });
  }

  const payment = await Payment.create({
    user: req.user._id,
    amount: req.body.amount,
    method: req.body.method,
    purpose: req.body.purpose,
    currency: req.body.currency || 'KES',
    reference: req.body.reference || `REF-${Date.now()}`,
    status: 'completed',
  });

  res.status(201).json(payment);
});


// 💳 Pay membership fee
router.post('/membership', protect, async (req, res) => {
  try {
    const now = new Date();
    const expires = new Date(now);
    expires.setFullYear(now.getFullYear() + 1); // 1-year validity

    const payment = await Payment.create({
      user: req.user._id,
      amount: 1500,
      currency: 'KES',
      method: req.body.method || 'manual',
      purpose: 'membership',
      reference: `MEM-${Date.now()}`,
      status: 'completed',
      paidAt: now,
      expiresAt: expires
    });

    await User.findByIdAndUpdate(req.user._id, {
      membershipStatus: 'active',
      membershipExpiresAt: expires
    });

    res.status(201).json({ message: 'Membership payment successful', payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Membership payment failed' });
  }
});


module.exports = router;
