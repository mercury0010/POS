const Account = require('../models/User');

const loginHandler = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Account.findOne({ username });
    if (!user || password !== user.password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  loginHandler,
}; 