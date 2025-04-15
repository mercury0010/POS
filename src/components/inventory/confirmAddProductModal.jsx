import React from 'react';
import '../css/confirmModal.css';

const ConfirmAddProductModal = ({ show, onClose, onConfirm, productName, productQuantity, productPrice }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Addition</h3>
        <p><strong>Are you sure you want to add this product to the inventory?</strong></p>
        <p><strong>Product Name: {productName} | Quantity: {productQuantity} | Price: {productPrice}</strong></p>

        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default ConfirmAddProductModal;
