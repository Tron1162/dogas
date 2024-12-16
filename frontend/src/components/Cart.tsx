import React, { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  const handleAddItem = () => {
    if (!newItemName.trim() || newItemQuantity < 1) {
      alert('Please enter a valid item name and quantity.');
      return;
    }

    const newItem: CartItem = {
      id: Date.now(),
      name: newItemName,
      quantity: newItemQuantity,
    };
    setCartItems([...cartItems, newItem]);
    setNewItemName('');
    setNewItemQuantity(1);
  };

  const handleUpdateItem = (id: number, name: string, quantity: number) => {
    setCartItems(cartItems.map(item => item.id === id ? { ...item, name, quantity } : item));
  };

  const handleDeleteItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/\d/.test(value)) {
      setNewItemName(value);
    } else {
      alert('Item name cannot contain numbers.');
    }
  };

  return (
    <div className="container">
      <h1>Cart</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Item name"
          value={newItemName}
          onChange={handleNameChange}
        />
        <input
          type="number"
          min="1"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(Number(e.target.value))}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {cartItems.map(item => (
          <li key={item.id} style={{ margin: '10px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleUpdateItem(item.id, e.target.value, item.quantity)}
            />
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleUpdateItem(item.id, item.name, Number(e.target.value))}
            />
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}