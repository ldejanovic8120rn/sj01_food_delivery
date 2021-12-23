const express = require('express');
const { sequelize } = require('./models');
const path = require('path');

require('dotenv').config();

const app = express();

const users = require('./routes/users_route');
const restaurants = require('./routes/restaurants_route');
const foods = require('./routes/foods_route');
const comments = require('./routes/comments_route');

app.use('/api', users);
app.use('/api', restaurants);
app.use('/api', foods);
app.use('/api', comments);

app.use(express.json());

app.listen({ port: 8081 }, async () => {
    await sequelize.authenticate();
});