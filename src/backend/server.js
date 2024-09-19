const express = require('express');
const cors = require('cors');
const setupSwagger = require('./swagger');
const projectRoutes = require('./routes/project');
const employeeRoutes = require('./routes/employee');
//const moduleRoutes = require('./routes/module');
//const eventRoutes = require('./routes/event');
const masterRoutes = require('./routes/master');

const app = express();

app.use(express.json());
app.use(cors()); // Allow all origins for testing

// Swagger setup
setupSwagger(app);

// API routes
app.use('/', masterRoutes);
app.use('/costdata', projectRoutes);
app.use('/', employeeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
