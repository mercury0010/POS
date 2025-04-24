require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const { getAccountsHandler, createAccountHandler } = require('./services/accountService');
const { getInventoryHandler, addInventoryHandler, deleteInventoryHandler, updateInventoryHandler } = require('./services/inventoryService');
const { loginHandler } = require('./services/authService');
const { addSaleHandler, getSalesHandler } = require('./services/salesService');
const cors = require('cors');
const app = express();

connectDB();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/accounts', getAccountsHandler);
app.post('/accounts', createAccountHandler);
app.post('/login', loginHandler);

app.get('/inventory', getInventoryHandler);
app.post('/inventory', addInventoryHandler);
app.delete('/inventory/:id', deleteInventoryHandler);
app.put('/inventory/:id', updateInventoryHandler);


app.post('/sales', addSaleHandler);
app.get('/sales', getSalesHandler); 

const PORT = process.env.PORT || 5000;
app.listen(5000, '0.0.0.0', () => {
  console.log(`Server is running on port 5000`);
});