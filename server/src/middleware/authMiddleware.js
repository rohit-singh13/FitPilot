const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Expect header format : "Authorization: Bearer <token>"
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the logged in user to the request (excluding password)
            req.user = await User.findById(decoded.id).select('-password');
            if(!req.user) {
                res.status(401);
                throw new Error('User not found');
            }
            next();
        } catch (error) {
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    } else {
        res.status(401);
        next(new Error('Not authorized, no token provided'));
    }
};

module.exports = { protect };