const express = require('express');
const session = require('express-session');
const cors = require('cors');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

// MySQL kapcsolat beállítása
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'adatok' // Ensure this matches your database name
});

// MySQL session store beállítása
const sessionStore = new MySQLStore({}, db);

// Express alkalmazás inicializálása
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // A frontend URL-je
  credentials: true // Engedélyezd a sütik küldését
}));

// Body parser a JSON kérésekhez
app.use(bodyParser.json());

// Session beállítások MySQL-ben tárolva
app.use(session({
  key: 'session_cookie_name',
  secret: 'your_secret_key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 60000 } // Sütik beállításai
}));

// Regisztrációs végpont
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Ellenőrizd, hogy a felhasználónév már létezik-e
    const [rows] = await db.query('SELECT * FROM adats WHERE nev = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Jelszó titkosítása bcrypt használatával
    const hashedPassword = await bcrypt.hash(password, 10);

    // Új felhasználó hozzáadása
    await db.query('INSERT INTO adats (nev, jelszo) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bejelentkezési végpont
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Felhasználó keresése
    const [rows] = await db.query('SELECT * FROM adats WHERE nev = ?', [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Jelszó ellenőrzése
    const isPasswordValid = await bcrypt.compare(password, user.jelszo);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Session-beállítás (felhasználói információk mentése session-ben)
    req.session.user = { id: user.id, username: user.nev };
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Kijelentkezési végpont
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('session_cookie_name'); // Session cookie törlése
    res.json({ message: 'Logout successful' });
  });
});

// Privát végpont, csak bejelentkezett felhasználóknak
app.get('/protected', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ message: `Welcome, ${req.session.user.username}` });
});

// Szerver indítása
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});