const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database(":memory");
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )
`);

// Add a user
app.post("/add", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.json({ message: "All fields are required" });
  }
  db.get(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    (err, row) => {
      if (row) {
        if (row.username === username) return res.json({ message: "Username already exists" });
        if (row.email === email) return res.json({ message: "Email already registered" });
      }
      db.run(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, password],
        (err) => {
          if (err) return res.json({ message: "Error saving user" });
          return res.json({ message: "User registered successfully" });
        }
      );
    }
  );
});

// Fetch all users
app.get("/getUsers", (req, res) => {
  db.all("SELECT id, username, email FROM users", (err, rows) => {
    if (err) return res.json({ message: "Error fetching users" });
    return res.json(rows); // Send all user data
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
