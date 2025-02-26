const express = require('express');
const router = express.Router();
const db = require('../config');

// Obtener todos los usuarios
router.get('/', (req, res) => {
    db.query('SELECT id, nombre, apellido, email, area FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Obtener usuario por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT nombre, apellido, email, rol FROM usuarios WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el usuario' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result[0]); // Devuelve el usuario encontrado
    });
});

module.exports = router;
