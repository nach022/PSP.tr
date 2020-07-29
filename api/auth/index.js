const express = require('express');
const sequelize = require('sequelize');
const cors= require('cors');




const app = express();

var corsOptions = {
  exposedHeaders: ['auth-token','auth-rol']
};


app.use(cors(corsOptions));
app.use(express.json());

//Cargar variables glbales
require('./config');
//Conectar a BD
db = require('./database/connection');

//Import Routes
const authRoute = require('./routes/auth');
const appRoute = require('./routes/app');
const pspRoute = require('./routes/psp');


//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/app', appRoute);
app.use('/api/psp', pspRoute);

app.listen(PORT, () => console.log(`Servidor arriba en el puerto ${PORT}, check!`));