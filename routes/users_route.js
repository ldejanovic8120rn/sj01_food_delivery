const express = require('express');
const { sequelize, Users } = require('../models');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

//Get all users
route.get('/users', (req, res) => {
    User.findAll()
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
})

//Update user
route.put('/users/:id', (req, res) => {
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