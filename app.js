const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config');
//string de coneção -> mongodb+srv://usuario_admin:hdfvOIiE2ZxPHOCm@clusterapi-uh0ox.mongodb.net/test?retryWrites=true

const url = config.bd_string;
const options = { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true };

mongoose.connect(url,options);
mongoose.set('useCreateIndex',true);

mongoose.connection.on('error', (err) => {
    console.log('Erro na conexão com o banco de dados: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Aplicação desconectada do banco de dados!');
});

mongoose.connection.on('connected', () => {
    console.log('Aplicação connectada do banco de dados!');
});

//Body Parser
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

const indexRoute = require('./Routes/index');
const usersRoute = require('./Routes/users');
const cepRoute = require('./Routes/cep');

app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use('/cep', cepRoute);

app.listen(process.env.PORT || 3000);

module.exports = app;