const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./users.db");
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )
`);

app.post("/add", (req, res) => {
  const { username, email, password} = req.body;
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

db.all("SELECT * FROM users", [], (err, rows) => {
  if (err) {
    console.error("Error retrieving users:", err);
    return res.json({ message: "Error retrieving users" });
  }
  console.log("All users:", rows);});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
