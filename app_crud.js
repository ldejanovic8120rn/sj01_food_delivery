const express = require('express');
const { sequelize } = require('./models');
const path = require('path');
const cors = require('cors');

const users = require('./routes/users_route');
const restaurants = require('./routes/restaurants_route');
const foods = require('./routes/foods_route');
const comments = require('./routes/comments_route');

const app = express();

var corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:8082'],
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

app.use('/admin', users);
app.use('/admin', restaurants);
app.use('/admin', foods);
app.use('/admin', comments);


app.listen({ port: 8081 }, async () => {
    await sequelize.authenticate();
    console.log('Crud server started!');
});
