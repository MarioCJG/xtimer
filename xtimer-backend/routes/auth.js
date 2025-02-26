const express = require('express');
const router = express.Router();
const db = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secreto_super_seguro';

// 📌 REGISTRO DE USUARIO
router.post('/registro', async (req, res) => {
    const { nombre, apellido, email, password, rol, area } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO usuarios (nombre, apellido, email, password, rol, area) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nombre, apellido, email, hashedPassword, rol, area], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Usuario registrado correctamente' });
    });
});

// 📌 LOGIN DE USUARIO
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const usuario = results[0];
        const validPassword = await bcrypt.compare(password, usuario.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, 'secreto_super_seguro', { expiresIn: '1h' });

        res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
    });
});


// 📌 PROTEGER RUTAS
const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: 'Acceso denegado' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

// 📌 RUTA PROTEGIDA DE EJEMPLO
router.get('/perfil', verificarToken, (req, res) => {
    res.json({ message: 'Acceso permitido', usuario: req.usuario });
});

module.exports = router;
