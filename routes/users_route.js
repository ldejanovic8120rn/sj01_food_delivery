const express = require('express');
const { sequelize, Users } = require('../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: err });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: err });
        }

        req.user = user;
        next();
    });
}

route.use(authToken);

//Get all users
route.get('/users', (req, res) => {
    if (req.user.role === 'ADMIN') {
        Users.findAll()
            .then(rows => res.json(rows))
            .catch(err => res.status(500).json(err));
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

//Get user by id
route.get('/users/:id', (req, res) => {
    if (req.user.role === 'ADMIN') {
        Users.findOne({ where: { id: req.params.id } })
            .then(row => res.json(row))
            .catch(err => res.status(500).json(err));
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

//Create user
route.post('/users', (req, res) => {
    if (req.user.role === 'ADMIN') {
        const validation = Joi.object().keys({
            role: Joi.string().valid('ADMIN', 'MODERATOR').required(),
            first_name: Joi.string().alphanum().min(3).max(10).required(),
            last_name: Joi.string().alphanum().min(3).max(10).required(),
            username: Joi.string().alphanum().min(4).max(10).required(),
            email: Joi.string().trim().email().required(),
            password: Joi.string().alphanum().min(5).max(15).required()
        });

        Joi.validate(req.body, validation, (err, result) => {
            if (err) {
                res.send({ message: err.details[0].message });
            }
            else {
                Users.create({
                    role: req.body.role,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 10)
                })
                    .then(row => res.json(row))
                    .catch(err => res.status(500).json(err));
            }
        })
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
})

//Update user
route.put('/users/:id', (req, res) => {
    if (req.user.role === 'ADMIN') {
        const validation = Joi.object().keys({
            role: Joi.string().valid('ADMIN', 'MODERATOR').required(),
            first_name: Joi.string().alphanum().min(3).max(10).required(),
            last_name: Joi.string().alphanum().min(3).max(15).required(),
            username: Joi.string().alphanum().min(4).max(10).required(),
            email: Joi.string().trim().email().required(),
            password: Joi.string().alphanum().min(5).max(15).allow(null).allow('').required(),
        });

        Joi.validate(req.body, validation, (err, result) => {
            if (err) {
                res.send({ message: err.details[0].message });
            }
            else {
                Users.findOne({ where: { id: req.params.id } })
                    .then(user => {
                        user.role = req.body.role;
                        user.first_name = req.body.first_name;
                        user.last_name = req.body.last_name;
                        user.username = req.body.username;
                        user.email = req.body.email;

                        if (req.body.password) {
                            user.password = bcrypt.hashSync(req.body.password, 10);
                        }

                        user.save()
                            .then(row => res.json(row))
                            .catch(err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err))
            }
        })
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

//Delete user
route.delete('/users/:id', (req, res) => {
    if (req.user.role === 'ADMIN') {
        Users.findOne({ where: { id: req.params.id } })
            .then(user => {
                user.destroy()
                    .then(row => res.json(row))
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(500).json(err));
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
})

module.exports = route;