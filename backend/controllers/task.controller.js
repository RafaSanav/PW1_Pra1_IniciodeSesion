const db = require('../config/db');

exports.getTasks = (req, res) => {
    const usuarioId = req.usuario.id;
    const sql = 'SELECT * FROM tasks WHERE id_user = ?';

    db.query(sql, [usuarioId], (error, results) => {
        if (error) {
            console.error(" el error es:", error);

            return res.status(500).json({
                message: 'Error al obtener las tareas',
                error_interno: error.message
            });
        }

        return res.status(200).json({
            tasks: results
        });
    });
};

exports.createTask = (req, res) => {
    const usuarioId = req.usuario.id;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            message: 'El título es obligatorio'
        });
    }

    const sql = 'INSERT INTO tasks (title, id_user) VALUES (?, ?)';

    db.query(sql, [title, usuarioId], (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al crear la tarea'
            });
        }

        return res.status(201).json({
            message: 'Tarea creada con éxito',
            taskId: result.insertId
        });
    });
};

exports.deleteTask = (req, res) => {
    const usuarioId = req.usuario.id;
    const { id } = req.params;

    const sql = 'DELETE FROM tasks WHERE id = ? AND id_user = ?';

    db.query(sql, [id, usuarioId], (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al eliminar la tarea'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Tarea no encontrada o no autorizada'
            });
        }

        return res.status(200).json({
            message: 'Tarea eliminada correctamente'
        });
    });
};