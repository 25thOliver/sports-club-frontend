const router = require('express').Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log(`[Mock] Password reset for ${email}`);
    res.json({ message: 'Reset link sent (mock)' });
  });
  

module.exports = router;
