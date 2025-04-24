require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./db');
const { getAccountsHandler, createAccountHandler } = require('./services/accountService');
const { getInventoryHandler, addInventoryHandler, deleteInventoryHandler, updateInventoryHandler } = require('./services/inventoryService');
const { loginHandler } = require('./services/authService');
const { addSaleHandler, getSalesHandler } = require('./services/salesService');
const cors = require('cors');
const app = express();

connectDB();

app.use(express.json());

// Allow cross-origin requests (you can adjust this for production later)
app.use(cors({
  origin: 'http://localhost:3000', // Change this if you have a different frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// API routes
app.get('/accounts', getAccountsHandler);
app.post('/accounts', createAccountHandler);
app.post('/login', loginHandler);

app.get('/inventory', getInventoryHandler);
app.post('/inventory', addInventoryHandler);
app.delete('/inventory/:id', deleteInventoryHandler);
app.put('/inventory/:id', updateInventoryHandler);

app.post('/sales', addSaleHandler);
app.get('/sales', getSalesHandler);

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all routes that don't match API routes (for client-side routing with React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
