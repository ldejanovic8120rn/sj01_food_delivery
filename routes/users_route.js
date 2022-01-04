const express = require('express');
const { sequelize, Users } = require('../models');
const Joi = require('joi');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.post('/login', (req, res) => {

    const validation = Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string().alphanum().min(5).max(15).required(),
    });

    Joi.validate(req.body, validation, (err, result) => {
        if (err) {
            res.send({ message: err.details[0].message });
        }
        else {
            Users.findOne({ where: { username: req.body.username, password: req.body.password } })
                .then(row => res.json(row))
                .catch(err => res.status(500).json(err));
        }
    });
});

route.post('/register', (req, res) => {

    const validation = Joi.object().keys({
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
                role: 'CLIENT',
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
                .then(row => res.json(row))
                .catch(err => res.status(500).json(err));
        }
    });
});

//Get all users
route.get('/users', (req, res) => {
    Users.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
});

//Get user by id
route.get('/users/:id', (req, res) => {
    Users.findOne({ where: { id: req.params.id } })
        .then(row => res.json(row))
        .catch(err => res.status(500).json(err));
});

//Create user
route.post('/users', (req, res) => {

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
                password: req.body.password
            })
                .then(row => res.json(row))
                .catch(err => res.status(500).json(err));
        }
    })
    
})

//Update user
route.put('/users/:id', (req, res) => {
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
            Users.findOne({ where: { id: req.params.id } })
                .then(user => {
                    user.role = req.body.role;
                    user.first_name = req.body.first_name;
                    user.last_name = req.body.last_name;
                    user.username = req.body.username;
                    user.email = req.body.email;
                    user.password = req.body.password;

                    user.save()
                        .then(row => res.json(row))
                        .catch(err => res.status(500).json(err));
                })
                .catch(err => res.status(500).json(err))
        }
    })
});

//Delete user
route.delete('/users/:id', (req, res) => {
    Users.findOne({ where: { id: req.params.id } })
        .then(user => {
            user.destroy()
                .then(row => res.json(row))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
})

module.exports = route;