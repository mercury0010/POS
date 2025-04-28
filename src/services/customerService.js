const express = require('express');
const Customer = require('../models/customer'); // Assuming there's a Customer model

const getCustomerHandler = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addCustomerHandler = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error('Error adding customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCustomerHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCustomerHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCustomerHandler,
  addCustomerHandler,
  updateCustomerHandler,
  deleteCustomerHandler,
};

