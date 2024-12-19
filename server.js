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
    password TEXT,
    empId TEXT,
    department TEXT,
    dateOfJoining TEXT,
    role TEXT,
    phoneNumber TEXT UNIQUE
  )
`);

app.post("/add", (req, res) => {
  const { username, email, password, empId, department, dateOfJoining, role, phoneNumber } = req.body;
  if (!username || !email || !password || !empId || !department || !dateOfJoining || !role || !phoneNumber) {
    return res.json({ message: "All fields are required" });
  }

  db.get("SELECT * FROM users WHERE phoneNumber = ?", [phoneNumber], (err, row) => {
    if (row) {
      return res.json({ message: "Mobile number already exists" });
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
          "INSERT INTO users (username, email, password, empId, department, dateOfJoining, role, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [username, email, password, empId, department, dateOfJoining, role, phoneNumber],
          (err) => {
            if (err) return res.json({ message: "Error saving user" });
            return res.json({ message: "User registered successfully" });
          }
        );
      }
    );
  });
});

app.get("/getUsers", (req, res) => {
  db.all("SELECT id, username, email, empId, department, dateOfJoining, role, phoneNumber FROM users", (err, rows) => {
    if (err) return res.json({ message: "Error fetching users" });
    return res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
