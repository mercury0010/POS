import React, { useState, useEffect } from 'react';
import './css/customer.css';  // Import the CSS file

const CustomerPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [membership, setMembership] = useState('');
  const [customers, setCustomers] = useState([]);
  const apiUrl = 'http://13.239.40.220:5000/';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(apiUrl + 'customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const addCustomer = async (customer) => {
    try {
      const response = await fetch(apiUrl + 'customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        throw new Error('Failed to add customer');
      }

      const newCustomer = await response.json();
      setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleAddCustomer = () => {
    const newCustomer = {
      firstName,
      lastName,
      age,
      address,
      membership,
    };

    addCustomer(newCustomer);

    // Reset form fields
    setFirstName('');
    setLastName('');
    setAge('');
    setAddress('');
    setMembership('');
  };

  return (
    <div className="customer-page">
      <div className="customer-form">
        <h1>Add Customer</h1>
        <label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label>
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </label>
        <label>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label>
          <input
            type="text"
            placeholder="Membership"
            value={membership}
            onChange={(e) => setMembership(e.target.value)}
          />
        </label>
        <button onClick={handleAddCustomer}>Add Customer</button>
      </div>
      <div className="customer-list">
        <h2>Customer List</h2>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Address</th>
              <th>Membership</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.age}</td>
                <td>{customer.address}</td>
                <td>{customer.membership}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPage;
