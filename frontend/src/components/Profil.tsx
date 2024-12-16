import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Profil() {
  const navigate = useNavigate();

  const handleCartNavigation = () => {
    navigate('/cart');
  };

  return (
    <div className="container">
      <h1>Profil</h1>
      <button onClick={handleCartNavigation}>Cart</button>
    </div>
  );
}