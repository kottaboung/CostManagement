const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { sendResponse } = require('.responseHelper');
const app = express();

app.use(express.json());
app.use(cors());

// Configure MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'cost_database'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.get('/costdata/getprojects', (req, res) => {
    connection.query('SELECT `ProjectID`, `ProjectName`, `ProjectStart`, `ProjectEnd`, `ProjectStatus` FROM `projects`', (err, results) => {
      if (err) {
        console.error('Error fetching projects:', err);
        return sendResponse(res, 500, 'error', 'An error occurred while fetching projects', null);
      }
      sendResponse(res, 200, 'success', 'Projects fetched successfully', results);
    });
});


app.post('/costdata/addprojects', (req, res) => {
    const { ProjectName, ProjectStart, ProjectEnd, ProjectStatus } = req.body;
  
    const sql = 'INSERT INTO `projects` (`ProjectName`, `ProjectStart`, `ProjectEnd`, `ProjectStatus`) VALUES (?, ?, ?, ?)';
    const values = [ProjectName, ProjectStart, ProjectEnd, ProjectStatus];
  
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return sendResponse(res, 500, 'error', 'An error occurred while inserting data', null);
      }
      sendResponse(res, 201, 'success', 'Project inserted successfully', { ProjectID: results.insertId, ProjectName, ProjectStart, ProjectEnd, ProjectStatus });
    });
  });

app.get('/costdata/getemployee', (req, res) => {
    connection.query('SELECT `EmployeeID`, `EmployeeName`, `EmployeePosition`, `EmployeeCost` FROM `employees`', (res, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return sendResponse(res, 500, 'error', 'An error occurred while fetching employees', null);
          }
          sendResponse(res, 200, 'success', 'Employees fetched successfully', results);
    });
})



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
