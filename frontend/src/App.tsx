import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles.css'; // Import the common styles
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Profil } from './components/Profil';
import { Cart } from './components/Cart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profil />} />
        <Route path="/Cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;