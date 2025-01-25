require('dotenv').config();

const express = require('express');
const connectDB = require('./database/connect'); 
const booksRoute = require('./routes/booksRoute');
const authorsRoute = require('./routes/authorsRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const errorMiddlerware = require('./middleware/errorMiddleware');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Middleware
app.use(express.json());

// MongoDB Connection
connectDB();

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the books API');
});

// API Routes
//app.use('/api', booksRoute);
app.use(booksRoute);
app.use(authorsRoute);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //swagger route



app.use(errorMiddlerware);


// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
