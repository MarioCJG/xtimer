const express = require('express');
const router = express.Router();
const db = require('../config'); // Asegúrate de que la conexión a la base de datos está correcta

// Ruta para obtener todos los proyectos
router.get('/', (req, res) => {
    db.query('SELECT * FROM proyectos', (err, results) => {
        if (err) {
            console.error('❌ Error al obtener proyectos:', err);
            return res.status(500).json({ error: 'Error al obtener proyectos' });
        }
        res.json(results);
    });
});

module.exports = router;
