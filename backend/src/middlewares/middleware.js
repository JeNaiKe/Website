const jwt = require('jsonwebtoken');
const config = require('../config/jwt.config');
var models = require('../models/index');

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log("TOKEN" + token);
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length); //remove a palavra 'Bearer ’
    }
    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'O token não é válido.'
            });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Token indisponível.'
        });
    }
};

module.exports = {
    checkToken: checkToken
}

