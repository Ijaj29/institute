const JWT = require('jsonwebtoken');
const createError = require('http-errors');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';

module.exports = {
    signToken: (userDetails) => {
        return new Promise((resolve, reject) => {
            const payload = { userid: userDetails.userid, unm: userDetails.userid, role: userDetails.role, iat: Math.floor(Date.now() / 1000) };

            JWT.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: JWT_EXPIRES_IN, audience: payload.unm }, (err, token) => {
                if (err) {
                    console.error('JWT sign error:', err.message);
                    return reject(createError.InternalServerError());
                }

                resolve(token);
            });
        });
    },

    verifyToken: (req, res, next) => {
        const token = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : req.cookies?.token;

        if (!token) {
            return res.status(401).json({ valid: false, message: 'Access denied. Token missing.' });
        }

        try {
            const decoded = JWT.verify(token, JWT_SECRET);
            req.user = decoded;
            req.tokenObject = decoded;
            return next();
        } catch (err) {
            return res.status(401).json({ valid: false, message: 'Invalid or expired token.' });
        }
    }
};
