import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './page/login';
import Dashboard from './page/dashboard';
import Inventory from './page/inventory';
import SalesPage from './page/sales';
import CustomerPage from './page/customer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/customer" element={<CustomerPage />} />
      </Routes>
    </Router>
  );
}

export default App;