const Sales = require('../models/sales');
const Inventory = require('../models/inventory');
const Customer = require('../models/customer'); // Import the Customer model

const addSaleHandler = async (req, res) => {
  try {
    const { itemId, quantity, price, customerId } = req.body;
    console.log(itemId, quantity, price, customerId);
    
    // Check if the item exists in inventory
    const inventoryItem = await Inventory.findById(itemId);
    if (!inventoryItem) {
      return res.status(404).json({ error: 'Item not found in inventory' });
    }

    // Check if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Create a new sale
    const sale = new Sales({ item: itemId, quantity, price, customer: customerId });
    await sale.save();

    // Update inventory quantity
    inventoryItem.quantity -= quantity;
    await inventoryItem.save();

    res.status(201).json(sale);
  } catch (error) {
    console.error('Error adding sale:', error);
    res.status(500).json({ error: 'Failed to add sale' });
  }
};

const getSalesHandler = async (req, res) => {
  try {
    const sales = await Sales.find().populate('item').populate('customer');
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

module.exports = {
  addSaleHandler,
  getSalesHandler,
};