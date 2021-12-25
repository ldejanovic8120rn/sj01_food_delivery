const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.get('/login', (req, res) => {
    res.sendFile('login_register.html', { root: './static' });
});

app.get('/users', (req, res) => {
    res.sendFile('users.html', { root: './static' });
});

app.get('/restaurants', (req, res) => {
    res.sendFile('restaurants.html', { root: './static' });
});

app.get('/foods', (req, res) => {
    res.sendFile('foods.html', { root: './static' });
});

app.get('/comments', (req, res) => {
    res.sendFile('comments.html', { root: './static' });
});

app.use(express.static(path.join(__dirname, 'static')));
app.listen({ port: 8080 }, async () => {
    console.log('GUI server started!')
});