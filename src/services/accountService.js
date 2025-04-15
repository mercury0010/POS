const Account = require('../models/User');

const getAccountsHandler = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createAccountHandler = async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    console.error('Error creating account:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAccountsHandler,
  createAccountHandler,
}; 