const Inventory = require('../models/inventory');

const getInventoryHandler = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addInventoryHandler = async (req, res) => {
  try {
    const inventoryItem = new Inventory(req.body);
    await inventoryItem.save();
    res.status(201).json(inventoryItem);
  } catch (err) {
    console.error('Error adding inventory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteInventoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await Inventory.findByIdAndDelete(id);
    res.status(204).json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    console.error('Error deleting inventory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateInventoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, price } = req.body; 

    const updatedInventory = await Inventory.findByIdAndUpdate(id, { name, quantity, price }, { new: true });
    res.json(updatedInventory);
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ message: 'Server error' });
  }
};  



module.exports = {
  getInventoryHandler,
  addInventoryHandler,
  deleteInventoryHandler,
  updateInventoryHandler,
};
