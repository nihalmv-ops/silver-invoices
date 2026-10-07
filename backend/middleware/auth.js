const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Access token is missing'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'silver_catering_secret_jwt_2026';
    const decoded = jwt.verify(token, secret);

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || 'admin'
    };

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Token has expired or is invalid'
    });
  }
};

module.exports = { requireAuth };
