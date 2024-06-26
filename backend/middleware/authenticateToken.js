const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

// Token authentication middleware
const authenticateToken = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token)
        return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if(err) 
            return res.status(403).send('Authentication failed');

        req.user = user;

        next();
    });
}

module.exports = authenticateToken;