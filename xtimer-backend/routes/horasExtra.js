const express = require('express');
const router = express.Router();
const db = require('../config');

router.get('/', (req, res) => {
    db.query( `
        SELECT 
            he.id,
            he.fecha,
            he.hora_inicio,
            he.hora_fin,
            he.total_horas,
            he.descripcion,
            he.estado,
            u.nombre AS usuario_nombre,
            u.apellido AS usuario_apellido,
            CONCAT(u.nombre, ' ', u.apellido) AS usuario_completo,
            p.nombre AS proyecto_nombre,
            c.nombre AS cliente_nombre,
            CONCAT(p.nombre, ' - ', c.nombre) AS proyecto_completo
        FROM horas_extra he
        JOIN usuarios u ON he.id_usuario = u.id
        JOIN proyectos p ON he.id_proyecto = p.id
        JOIN clientes c ON p.id_cliente = c.id
    `, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener horas extra:', err);
            return res.status(500).json({ error: 'Error al obtener horas extra' });
        }
        res.json(results);
    });
});


router.post('/', (req, res) => {
    const { id_usuario, id_proyecto, fecha, hora_inicio, hora_fin, total_horas, descripcion } = req.body;

    const sql = `INSERT INTO horas_extra (id_usuario, id_proyecto, fecha, hora_inicio, hora_fin, total_horas, descripcion, estado) 
                 VALUES (?, ?, ?, ?, ?, TIME_FORMAT(?, '%H:%i'), ?, 'pendiente')`;

    db.query(sql, [id_usuario, id_proyecto, fecha, hora_inicio, hora_fin, total_horas, descripcion], (err, result) => {
        if (err) {
            console.error('❌ Error en la base de datos:', err);
            return res.status(500).json({ error: 'Error al guardar en la base de datos' });
        }
        res.json({ message: 'Horas extra registradas con éxito', id: result.insertId });
    });
});

// Actualizar horas extra o estado
router.put('/:id', (req, res) => {
    const { estado, fecha, hora_inicio, hora_fin, total_horas, descripcion } = req.body;
    const { id } = req.params;

    const sql = `UPDATE horas_extra 
                 SET estado = ?,
                     fecha = COALESCE(?, fecha),
                     hora_inicio = COALESCE(?, hora_inicio),
                     hora_fin = COALESCE(?, hora_fin),
                     total_horas = COALESCE(?, total_horas),
                     descripcion = COALESCE(?, descripcion)
                 WHERE id = ?`;

    db.query(sql, [estado, fecha, hora_inicio, hora_fin, total_horas, descripcion, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar la hora extra' });
        res.json({ message: `Hora extra marcada como ${estado}` });
    });
});


// Eliminar horas extra
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query(`DELETE FROM horas_extra WHERE id=?`, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la hora extra' });
        res.json({ message: 'Hora extra eliminada correctamente' });
    });
});





module.exports = router;
