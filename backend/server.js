// Importar módulos
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const dbConfig = {
    server: 'DESKTOP-VNC0PJB\\SQLEXPRESS',
    database: 'CrudNotas',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

// Autenticación de Windows
dbConfig.authentication = {
    type: 'default'
};
dbConfig.options.trustedConnection = true;

// Conectar a SQL Server
sql.connect(dbConfig).then(() => {
    console.log('Conectado a SQL Server en CrudNotas');
}).catch(err => console.error('Error de conexión:', err));



// Obtener todas las notas
app.get('/notas', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Notas');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Crear una nueva nota
app.post('/notas', async (req, res) => {
    const { titulo, descripcion, fechaVencimiento, completada } = req.body;
    try {
        await sql.query(
            `INSERT INTO Notas (titulo, descripcion, fechaVencimiento, completada) 
             VALUES ('${titulo}', '${descripcion}', '${fechaVencimiento}', ${completada})`
        );
        res.send('Nota creada');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar una nota
app.put('/notas/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fechaVencimiento, completada } = req.body;
    try {
        await sql.query(
            `UPDATE Notas SET titulo='${titulo}', descripcion='${descripcion}', 
             fechaVencimiento='${fechaVencimiento}', completada=${completada} WHERE id=${id}`
        );
        res.send('Nota actualizada');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Eliminar una nota
app.delete('/notas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query(`DELETE FROM Notas WHERE id=${id}`);
        res.send('Nota eliminada');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
