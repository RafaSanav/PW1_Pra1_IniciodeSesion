const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({
            message: 'Token no proporcionado o inválido'
        });
    }

    const partes = authHeader.split(' ');
    const token = partes[1];

    if (!token) {
        return res.status(403).json({
            message: 'Formato de token incorrecto'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                message: 'Token no autorizado o expirado'
            });
        }

        req.usuario = decoded;
        next();
    });
};

module.exports = verifyToken;