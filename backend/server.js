require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const openapiDocument = require('./swagger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'DeskFlow API is running.' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// 404 + error handler (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[DeskFlow] Server running on port ${PORT}`);
  console.log(`[DeskFlow] API docs available at http://localhost:${PORT}/api-docs`);
});
