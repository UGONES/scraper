import jwt from 'jsonwebtoken';

// ✅ Middleware: Verify JWT and attach user to req
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure payload consistency with token signing
    req.user = {
      id: decoded.userId || decoded.id,   // handle both keys
      username: decoded.username,
      role: decoded.role
    };

    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ✅ Allow only admin role
export const isAdmin = (req, res, next) => {
  if ((req.user?.role || '').toLowerCase() !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// ✅ Allow only regular user
export const isUser = (req, res, next) => {
  if ((req.user?.role || '').toLowerCase() !== 'user') {
    return res.status(403).json({ message: 'Access denied: Users only' });
  }
  next();
};

// ✅ Allow either user or admin
export const allowUserOrAdmin = (req, res, next) => {
  const role = (req.user?.role || '').toLowerCase();
  if (role === 'user' || role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied: User/Admin only' });
};
