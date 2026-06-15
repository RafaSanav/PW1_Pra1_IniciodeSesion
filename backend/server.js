const express = require('express');
const cors = require('cors');
require ('dotenv').config();
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
const authRoutes = require('./routes/auth.routes');

const tasksRoutes = require('./routes/task.routes');


app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes); 

const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost;${PORT}`);
})
