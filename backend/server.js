const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json()); // Use express's built-in json parser

// Database connection configuration
const dbConfig = {
  host: "bssy6tybmvjez1trkh0r-mysql.services.clever-cloud.com",
  user: "u44ityxj1g39wuxz",
  password: "ZooV66yDeaEGtgsOfCiO",
  database: "bssy6tybmvjez1trkh0r",
  port: 3306,
};

// Test database connection
(async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("MySQL connected successfully");
    await connection.end();
  } catch (err) {
    console.error("Unable to connect to MySQL:", err);
  }
})();

// Route to add an employee
app.post("/api/employees", async (req, res) => {
  const {
    firstName,
    lastName,
    employeeID,
    email,
    phone,
    department,
    dateOfJoining,
    role,
  } = req.body;

  // Basic validation of required fields
  if (!firstName || !lastName || !employeeID || !email || !phone || !department || !dateOfJoining || !role) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Use Date objects, MySQL can handle them natively
    const createdAt = new Date();
    const formattedDateOfJoining = new Date(dateOfJoining);

    const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

const query = `
  INSERT INTO Employees (firstName, lastName, employeeID, email, phone, department, dateOfJoining, role, createdAt, updatedAt) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
const values = [
  firstName,
  lastName,
  employeeID,
  email,
  phone,
  department,
  formattedDateOfJoining,
  role,
  createdAt,
  updatedAt, // Add updatedAt here
];


    await connection.execute(query, values);
    await connection.end();

    res.status(201).send({ message: "Employee added successfully" });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).send({ message: error.message });
  }
});

// Route to fetch all employees
app.get("/api/employees", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM Employees");
    await connection.end();

    res.status(200).send(rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).send({ message: error.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
