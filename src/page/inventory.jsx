import React, { useState, useEffect } from 'react';
import './css/inventory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmDeleteProductModal from '../components/inventory/confirmDeleteProductModal';
import ConfirmAddProductModal from '../components/inventory/confirmAddProductModal';
import ConfirmEditProductModal from '../components/inventory/confirmEditProductModal';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productIdToEdit, setProductIdToEdit] = useState(null);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const apiUrl = 'http://13.239.40.220:5000/';
  useEffect(() => {
    fetch(apiUrl + 'inventory')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  const handleAddProduct = () => {
    setPendingProduct({
      name: productName,
      quantity: productQuantity,
      price: productPrice,
    });
    setShowAddProductModal(true);
  };

  const confirmAddProduct = () => {
    const { name, quantity, price } = pendingProduct;
    const existingProduct = products.find(p => p.name === name);

    if (existingProduct && !isEditing) {
      // Update existing product
      const updatedQuantity = parseInt(existingProduct.quantity) + parseInt(quantity);

      fetch(apiUrl + `inventory/${existingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          quantity: updatedQuantity,
          price,
        }),
      })
        .then(response => response.json())
        .then(updatedProduct => {
          const updatedProducts = products.map(product =>
            product._id === updatedProduct._id ? updatedProduct : product
          );
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          resetForm();
        })
        .catch(error => console.error('Error updating product:', error));
    } else if (isEditing) {
      // Edit existing product
      fetch(apiUrl + `inventory/${productIdToEdit}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          quantity,
          price,
        }),
      })
        .then(response => response.json())
        .then(updatedProduct => {
          const updatedProducts = products.map(product =>
            product._id === updatedProduct._id ? updatedProduct : product
          );
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          resetForm();
        })
        .catch(error => console.error('Error editing product:', error));
    } else {
      // Add new product
      fetch(apiUrl + 'inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          quantity,
          price,
        }),
      })
        .then(response => response.json())
        .then(addedProduct => {
          setProducts([...products, addedProduct]);
          setFilteredProducts([...products, addedProduct]);
          resetForm();
        })
        .catch(error => console.error('Error adding product:', error));
    }
  };

  const handleDeleteProduct = (id) => {
    setProductIdToDelete(id);
    setShowModal(true);
  };

  const confirmDeleteProduct = () => {
    fetch(apiUrl + `inventory/${productIdToDelete}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedProducts = products.filter(product => product._id !== productIdToDelete);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setShowModal(false);
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  const handleEditProduct = (product) => {
    setProductIdToEdit(product._id);
    setPendingProduct(product);
    setShowEditProductModal(true);
  };

  const confirmEditProduct = (updatedProduct) => {
    fetch(apiUrl + `inventory/${productIdToEdit}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then(response => response.json())
      .then(updatedProduct => {
        const updatedProducts = products.map(product =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        resetForm();
      })
      .catch(error => console.error('Error editing product:', error));
  };

  const handleProductSelect = (e) => {
    const productName = e.target.value;
    const product = products.find(p => p.name === productName);
    if (product) {
      setProductName(product.name);
      setProductQuantity(product.quantity);
      setProductPrice(product.price);
    }
  };

  const handleProductNameChange = (e) => {
    const value = e.target.value;
    setProductName(value);
    setFilteredProducts(products.filter(product => product.name.toLowerCase().includes(value.toLowerCase())));
  };

  const resetForm = () => {
    setProductName('');
    setProductQuantity('');
    setProductPrice('');
    setShowAddProductModal(false);
    setShowEditProductModal(false);
    setIsEditing(false);
    setProductIdToEdit(null);
  };

  return (
    <div className="inventory-page">
      <ConfirmDeleteProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDeleteProduct}
      />
      <ConfirmAddProductModal
        show={showAddProductModal}
        onClose={resetForm}
        onConfirm={confirmAddProduct}
        productName={pendingProduct?.name}
        productQuantity={pendingProduct?.quantity}
        productPrice={pendingProduct?.price}
      />
      <ConfirmEditProductModal
        show={showEditProductModal}
        onClose={resetForm}
        onConfirm={confirmEditProduct}
        product={pendingProduct}
      />
      <div className="sidebar">
        <h2>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
        <input
          type="text"
          list="product-names"
          placeholder="Product Name"
          value={productName}
          onChange={handleProductNameChange}
          onInput={handleProductSelect}
        />
        <datalist id="product-names">
          {filteredProducts.map(product => (
            <option key={product._id} value={product.name} />
          ))}
        </datalist>
        <input
          type="number"
          placeholder="Quantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <button onClick={handleAddProduct}>{isEditing ? 'Update Product' : 'Add Product'}</button>
      </div>
      <div className="product-view">
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>
                  <button onClick={() => handleEditProduct(product)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDeleteProduct(product._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;