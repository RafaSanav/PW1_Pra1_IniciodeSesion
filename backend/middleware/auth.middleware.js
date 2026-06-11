const jwt = require('jsonwebtoken');
const { error } = require('node:console');
const verifyToken = (req, res, next) => {
    const authHeader = req.headres['authorization'];
    if (!authHeader){
        return res.status(403).json({
            message: 'Token inválido'
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error){
            return res.status(401).json({
                message: 'Token no autorizado'
            });
        }
    })
}