const express = require('express');
const cors = require('cors');
const db = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const horasExtraRoutes = require('./routes/horasExtra');
const authRoutes = require('./routes/auth');
const proyectosRoutes = require('./routes/proyectos');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/horas-extra', horasExtraRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
