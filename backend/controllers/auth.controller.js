const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Deba capturar usuario y contraseña'
        });
    }

    const sqlSearch = 'SELECT * FROM users WHERE username = ?';

    db.query(sqlSearch, [username], async (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error del servidor'
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: 'El usuario ya existe'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sqlInsert = 'INSERT INTO users(username, password) VALUES (?,?)';

        db.query(sqlInsert, [username, hashedPassword], (error, result) => {
            if (error) {
                return res.status(500).json({
                    message: "No se pudo registrar el usuario"
                });
            }

            res.status(201).json({
                message: 'Usuario registrado correctamente'
            });
        });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Debe capturar usuario y contraseña'
        });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';

    db.query(sql, [username], async (error, results) => {
        if (error) {
            return res.status(500).json({
                message: 'Error del servidor'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'El usuario no existe'
            });
        }

        const user = results[0];

        const coincide = await bcrypt.compare(password, user.password);

        if (!coincide) {
            return res.status(401).json({
                message: 'Contraseña incorrecta'
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.status(200).json({
            message: `Bienvenido, ${user.username}`,
            token: token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    });
};