const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========

// CORS
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== LOGGER ==========
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ========== ROUTES ==========

// Routes todo
const todoRoutes = require('./routes/todoRoutes');
app.use('/api/todos', todoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Backend Todo App dang chay!',
    timestamp: new Date().toISOString(),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  });
});

// Route mặc định
app.get('/', (req, res) => {
  res.json({
    message: 'Chao mung den voi Todo App API!',
    endpoints: {
      todos: 'http://localhost:3000/api/todos',
      health: 'http://localhost:3000/api/health'
    }
  });
});

// ========== START SERVER ==========

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server dang chay tai: http://localhost:${PORT}`);
  console.log(`📋 API Todos: http://localhost:${PORT}/api/todos`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  console.log('=================================');
  console.log('📌 Cac method ho tro:');
  console.log('   GET, POST, PUT, PATCH, DELETE');
  console.log('=================================');
});