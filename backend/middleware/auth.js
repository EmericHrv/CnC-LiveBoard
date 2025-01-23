import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token is missing or invalid.' }); // Unauthorized
    }

    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    if (!jwtSecret) {
        console.error('JWT secret is not defined.');
        return res.status(500).json({ error: 'Internal Server Error.' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid or expired.' }); // Forbidden
        }

        req.user = user;
        next();
    });
};

export default authenticateToken;
