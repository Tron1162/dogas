import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username || !password) {
      setError('Fields cannot be empty');
      return;
    }

    const hasUppercase = (str: string) => /[A-Z]/.test(str);

    if (!hasUppercase(username) || !hasUppercase(password)) {
      setError('Both fields must contain at least one uppercase letter');
      return;
    }

    try {
      await axios.post('http://localhost:3000/register', { username, password });
      setError('');
      alert('Registration successful');
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Error registering user');
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}