import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    if (card === 'Inventory') {
      navigate('/inventory');
    }
    if (card === 'Sales') {
      navigate('/sales');
    }
    // Add other navigation logic if needed
  };

  return (
    <div className="dashboard">
      <h1>POS Dashboard</h1>
      <div className="dashboard-content">
        <div className="card" onClick={() => handleCardClick('Sales')}>Sales</div>
        <div className="card" onClick={() => handleCardClick('Inventory')}>Inventory</div>
        <div className="card" onClick={() => handleCardClick('Reports')}>Reports</div>
        <div className="card" onClick={() => handleCardClick('Settings')}>Settings</div>
      </div>
    </div>
  );
};

export default Dashboard;