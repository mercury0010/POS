import React, { useState, useEffect } from 'react';
import './css/sales.css';   

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [customer, setCustomer] = useState('');
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const apiUrl = 'http://13.239.40.220:5000/';
  
  useEffect(() => {
    // Fetch inventory data
    fetch(apiUrl + 'inventory')
      .then(response => response.json())
      .then(data => setInventory(data))
      .catch(error => console.error('Error fetching inventory:', error));

    // Fetch sales data
    fetch(apiUrl + 'sales')
      .then(response => response.json())
      .then(data => setSales(data))
      .catch(error => console.error('Error fetching sales:', error));

    // Fetch customers data
    fetch(apiUrl + 'customers')
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const handleProductChange = (e) => {
    const selectedProduct = e.target.value;
    setProduct(selectedProduct);

    const productInInventory = inventory.find(item => item._id === selectedProduct);
    if (productInInventory) {
      setQuantity(0); // Reset quantity input
      setPrice(productInInventory.price);
    } else {
      setQuantity(0);
      setPrice(0);
    }
  };

  const handleCustomerChange = (e) => {
    setCustomer(e.target.value);
  };

  const handleAddSale = () => {
    const productInInventory = inventory.find(item => item._id === product);

    if (!productInInventory) {
      setError('Product not found in inventory.');
      return;
    }

    if (productInInventory.quantity < quantity) {
      setError('Insufficient quantity in inventory.');
      return;
    }

    const newSale = { itemId: productInInventory._id, quantity, price, customer };

    // Add sale to the sales model on the server
    fetch(apiUrl + 'sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSale),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Sale added:', data);
        setSales([...sales, data]);
        setProduct('');
        setQuantity(0);
        setPrice(0);
        setCustomer('');
        setError('');
      })
      .catch(error => console.error('Error adding sale:', error));

    // Update inventory
    const updatedInventory = inventory.map(item =>
      item._id === product
        ? { ...item, quantity: item.quantity - quantity }
        : item
    );

    setInventory(updatedInventory);

    // Optionally, update the inventory on the server
    fetch(apiUrl + `inventory/${productInInventory._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...productInInventory,
        quantity: productInInventory.quantity - quantity,
      }),
    })
      .then(response => response.json())
      .catch(error => console.error('Error updating inventory:', error));
  };

  return (
    <div className="sales-page">
      <h1>Sales Page</h1>
      <div className="sales-form">
        <label>
          Product:
          <select
            value={product}
            onChange={handleProductChange}
          >
            <option value="">Select a product</option>
            {inventory.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Quantity:
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>
        <label>
          Customer:
          <select
            value={customer}
            onChange={handleCustomerChange}
          >
            <option value="">Select a customer</option>
            {customers.map((cust) => (
              <option key={cust._id} value={cust._id}>
                {cust.name}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleAddSale}>Add Sale</button>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="sales-list">
        <h2>Sales List</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Customer</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.item ? sale.item.name : ''}</td>
                <td>{sale.quantity}</td>
                <td>PHP {sale.price}.00</td>
                <td>{sale.customer}</td>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;