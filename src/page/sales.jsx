import React, { useState, useEffect } from 'react';
import './css/sales.css';   

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [customer, setCustomer] = useState('');
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [tempSales, setTempSales] = useState([]);
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

  const handleAddTempSale = () => {
    const productInInventory = inventory.find(item => item._id === product);

    if (!productInInventory) {
      setError('Product not found in inventory.');
      return;
    }

    if (productInInventory.quantity < quantity) {
      setError('Insufficient quantity in inventory.');
      return;
    }

    const discountAmount = (discount / 100) * price;
    const subTotal = (price - discountAmount) * quantity;
    const existingTempSaleIndex = tempSales.findIndex(tempSale => tempSale.itemId === productInInventory._id);

    if (existingTempSaleIndex !== -1) {
      const updatedTempSales = [...tempSales];
      const existingTempSale = updatedTempSales[existingTempSaleIndex];
      existingTempSale.quantity += quantity;
      existingTempSale.subTotal += subTotal;
      updatedTempSales[existingTempSaleIndex] = existingTempSale;
      setTempSales(updatedTempSales);
    } else {
      const newTempSale = { itemId: productInInventory._id, quantity, price, discount, subTotal, customer };
      setTempSales([...tempSales, newTempSale]);
    }

    setProduct('');
    setQuantity(0);
    setPrice(0);
    setDiscount(0);
    setError('');
  };

  const handleAddSale = () => {
    tempSales.forEach(tempSale => {
      const productInInventory = inventory.find(item => item._id === tempSale.itemId);

      if (!productInInventory) {
        setError('Product not found in inventory.');
        return;
      }

      if (productInInventory.quantity < tempSale.quantity) {
        setError('Insufficient quantity in inventory.');
        return;
      }

      // Add sale to the sales model on the server
      fetch(apiUrl + 'sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tempSale),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Sale added:', data);
          setSales([...sales, data]);
        })
        .catch(error => console.error('Error adding sale:', error));

      // Update inventory
      const updatedInventory = inventory.map(item =>
        item._id === tempSale.itemId
          ? { ...item, quantity: item.quantity - tempSale.quantity }
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
          quantity: productInInventory.quantity - tempSale.quantity,
        }),
      })
        .then(response => response.json())
        .catch(error => console.error('Error updating inventory:', error));
    });

    setTempSales([]);
  };

  return (
    <div className="sales-page">
      <h1>Sales Page</h1>
      <div className="sales-container">
        <div className="sales-form-temp-sales">
          <div className="sales-form">
            <label>
              Customer:
              <select
                value={customer}
                onChange={handleCustomerChange}
              >
                <option value="">Select a customer</option>
                {customers.map((cust) => (
                  <option key={cust._id} value={cust._id}>
                    {cust.firstName} {cust.lastName}
                  </option>
                ))}
              </select>
            </label>
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
              Discount (%):
              <input
                type="number"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </label>
            <button onClick={handleAddTempSale}>Add to Temp Sales</button>
          </div>
          <div className="temp-sales-list-inline">
            <h2>Temporary Sales List</h2>
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {tempSales.map((tempSale, index) => (
                  <tr key={index}>
                    <td>{customers.find(cust => cust._id === tempSale.customer)?.firstName} {customers.find(cust => cust._id === tempSale.customer)?.lastName}</td>
                    <td>{inventory.find(item => item._id === tempSale.itemId)?.name}</td>
                    <td>{tempSale.quantity}</td>
                    <td>PHP {tempSale.price}.00</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3">Total Discount</td>
                  <td>{tempSales.reduce((acc, tempSale) => acc + (tempSale.discount / 100) * tempSale.price * tempSale.quantity, 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3">Total Sub Total</td>
                  <td>{tempSales.reduce((acc, tempSale) => acc + tempSale.subTotal, 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={handleAddSale}>Add Sale</button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
      <div className="sales-list">
        <h2>Sales List</h2>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName}` : ''}</td>
                <td>{sale.item ? sale.item.name : ''}</td>
                <td>{sale.quantity}</td>
                <td>PHP {sale.price}.00</td>
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