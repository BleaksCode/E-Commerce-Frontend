// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// CORS para permitir peticiones desde tu app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Leer base de datos
const dbPath = path.join(__dirname, 'db.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Guardar cambios en db.json
function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// ==================== AUTH ENDPOINTS ====================

// POST /auth/login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    return res.status(200).json({
      access_token: `mock-jwt-token-${user.id}-${Date.now()}`
    });
  }
  
  return res.status(401).json({
    message: 'Unauthorized',
    statusCode: 401
  });
});

// GET /auth/profile
app.get('/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized',
      statusCode: 401
    });
  }
  
  const token = authHeader.substring(7);
  const match = token.match(/mock-jwt-token-(\d+)-/);
  
  if (match) {
    const userId = parseInt(match[1]);
    const user = db.users.find(u => u.id === userId);
    
    if (user) {
      return res.status(200).json({
        sub: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      });
    }
  }
  
  return res.status(401).json({
    message: 'Unauthorized',
    statusCode: 401
  });
});

// ==================== USERS ENDPOINTS ====================

// GET /users - Listar todos los usuarios
app.get('/users', (req, res) => {
  const { email } = req.query;
  
  if (email) {
    const user = db.users.find(u => u.email === email);
    return res.json(user ? [user] : []);
  }
  
  res.json(db.users);
});

// GET /users/:id - Obtener usuario por ID
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = db.users.find(u => u.id === id);
  
  if (user) {
    return res.json(user);
  }
  
  res.status(404).json({
    message: 'User not found',
    statusCode: 404
  });
});

// POST /users - Crear usuario
app.post('/users', (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;
  
  // Verificar si el email ya existe
  const exists = db.users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({
      message: 'Email already exists',
      statusCode: 409
    });
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    email,
    password,
    first_name,
    last_name,
    phone: phone || null,
    created_at: new Date().toISOString(),
    is_active: 'y'
  };
  
  db.users.push(newUser);
  saveDb();
  
  // No devolver la contraseña
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// PATCH /users/:id - Actualizar usuario
app.patch('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = db.users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      message: 'User not found',
      statusCode: 404
    });
  }
  
  db.users[userIndex] = {
    ...db.users[userIndex],
    ...req.body,
    id // Mantener el ID original
  };
  
  saveDb();
  res.json(db.users[userIndex]);
});

// DELETE /users/:id - Eliminar usuario
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = db.users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      message: 'User not found',
      statusCode: 404
    });
  }
  
  db.users.splice(userIndex, 1);
  saveDb();
  
  res.json({ message: 'User has been successfully deleted' });
});

// GET /categories - Listar todas las categorías
app.get('/categories', (req, res) => {
  res.json(db.categories || []);
});

// POST /categories - Crear una nueva categoría
app.post('/categories', (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'El campo name es obligatorio' });
  }

  const newCategory = {
    id: db.categories?.length > 0 ? Math.max(...db.categories.map(c => c.id)) + 1 : 1,
    name,
    description: description || '',
  };

  // Si no existe la colección, créala
  if (!db.categories) db.categories = [];
  db.categories.push(newCategory);
  saveDb();

  res.status(201).json(newCategory);
});

app.get('/products', (req, res) => {
  if (db.products) {
    res.json(db.products);
  } else {
    res.status(404).json({ error: 'Products not found in db.json' });
  }
});

// Ruta para obtener todas las categorías
app.get('/categories', (req, res) => {
  if (db.categories) {
    res.json(db.categories);
  } else {
    res.status(404).json({ error: 'Categories not found in db.json' });
  }
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log('🚀 Mock server is running!');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log('\n📝 Available endpoints:');
  console.log('   AUTH:');
  console.log(`   POST http://localhost:${PORT}/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/auth/profile (requires token)`);
  console.log('\n   USERS:');
  console.log(`   GET    http://localhost:${PORT}/users`);
  console.log(`   GET    http://localhost:${PORT}/users/:id`);
  console.log(`   POST   http://localhost:${PORT}/users`);
  console.log(`   PATCH  http://localhost:${PORT}/users/:id`);
  console.log(`   DELETE http://localhost:${PORT}/users/:id`);
  console.log('\n💡 Test credentials:');
  console.log('   Email: test@ejemplo.com');
  console.log('   Password: Test1234!');
  console.log('\n');
});