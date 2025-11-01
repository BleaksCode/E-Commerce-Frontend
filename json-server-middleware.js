module.exports = (req, res, next) => {
  // Simular el endpoint de login
  if (req.method === 'POST' && req.path === '/auth/login') {
    const { email, password } = req.body;
    const db = require('./db.json');
    
    // Buscar usuario por email y password
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Simular respuesta de NestJS con JWT
      return res.status(200).json({
        access_token: `mock-jwt-token-${user.id}-${Date.now()}`
      });
    } else {
      return res.status(401).json({
        message: 'Unauthorized',
        statusCode: 401
      });
    }
  }
  
  // Simular el endpoint de profile (requiere token)
  if (req.method === 'GET' && req.path === '/auth/profile') {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Unauthorized',
        statusCode: 401
      });
    }
    
    // Extraer el ID del usuario del token mock
    const token = authHeader.substring(7);
    const match = token.match(/mock-jwt-token-(\d+)-/);
    
    if (match) {
      const userId = parseInt(match[1]);
      const db = require('./db.json');
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
  }
  
  // Continuar con el comportamiento por defecto de json-server
  next();
};