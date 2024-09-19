const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { sendResponse } = require('../responseHelper');

// Configure MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'cost_database'
});

/**
 * @swagger
 * tags:
 *   - name: Employees
 *     description: API endpoints related to employees
 */

/**
 * @swagger
 * /costdata/addemployee:
 *   post:
 *     tags: [Employees]
 *     summary: Create a new employee
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               EmployeeName:
 *                 type: string
 *               EmployeePosition:
 *                 type: string
 *               EmployeeCost:
 *                 type: number
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       500:
 *         description: Error occurred while creating employee
 */

router.post('/costdata/addemployee', (req, res) => {
    const { EmployeeName, EmployeePosition, EmployeeCost } = req.body;
  
    const sql = 'INSERT INTO `employees` (`EmployeeName`, `EmployeePosition`, `EmployeeCost`) VALUES (?, ?, ?)';
    const values = [EmployeeName, EmployeePosition, EmployeeCost];
  
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error inserting employee:', err);
        return sendResponse(res, 500, 'error', 'An error occurred while inserting employee', null);
      }
      sendResponse(res, 201, 'success', 'Employee created successfully', { EmployeeID: results.insertId, EmployeeName, EmployeePosition, EmployeeCost });
    });
  });

/**
 * @swagger
 * /costdata/getemployees:
 *   get:
 *     tags: [Employees]
 *     summary: Retrieve all employees
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Employees fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       EmployeeName:
 *                          type: string
 *                       EmployeePosition:
 *                          type: string
 *                       EmployeeCost:
 *                          type: integer
 */
router.get('/costdata/getemployees', (req, res) => {
    connection.query('SELECT `EmployeeID`, `EmployeeName`, `EmployeePosition`, `EmployeeCost` FROM `employees` ', (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return sendResponse(res, 500, 'error', 'An error occurred while fetching employees', null);
          }
          sendResponse(res, 200, 'success', 'Employees fetched successfully', results);
    })
})

module.exports = router;