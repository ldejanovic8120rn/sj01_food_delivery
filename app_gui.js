const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

function getCookies(req) {
    if (req.headers.cookie == null) {
        return {};
    }

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach(rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
};

function authToken(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];

    if (token == null) {
        return res.redirect(301, '/login');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.redirect(301, '/login');
        }

        req.user = user;
        next();
    });
}

app.get('/', authToken, (req, res) => {
    res.sendFile('index.html', { root: './static' });
});

app.get('/login', (req, res) => {
    res.sendFile('login_register.html', { root: './static' });
});

app.get('/users', authToken, (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        res.sendFile('users.html', { root: './static' });
    }
    else {
        res.status(401).send('Not authorized');
    }
});

app.get('/restaurants', authToken, (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        res.sendFile('restaurants.html', { root: './static' });
    }
    else {
        res.status(401).send('Not authorized');
    }
});

app.get('/foods', authToken, (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR' || req.user.role === 'CLIENT') {
        res.sendFile('foods.html', { root: './static' });
    }
    else {
        res.status(401).send('Not authorized');
    }
});

app.get('/comments', authToken, (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR' || req.user.role === 'CLIENT') {
        res.sendFile('comments.html', { root: './static' });
    }
    else {
        res.status(401).send('Not authorized');
    }
});

app.use(express.static(path.join(__dirname, 'static')));
app.listen({ port: 8080 }, async () => {
    console.log('GUI server started!')
});