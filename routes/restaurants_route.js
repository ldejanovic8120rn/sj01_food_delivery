const express = require('express');
const { sequelize, Restaurants } = require('../models');
const Joi = require('joi');
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

//Get all restaurants
route.get('/restaurants', (req, res) => {
    Restaurants.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
})

//Get restaurant by id
route.get('/restaurants/:id', (req, res) => {
    if (req.user.role === 'ADMIN') {
        Restaurants.findOne({ where: { id: req.params.id } })
            .then(row => res.json(row))
            .catch(err => res.status(500).json(err));
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
})

//Create restaurant
route.post('/restaurants', (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        const validation = Joi.object().keys({
            name: Joi.string().min(3).max(10).required(),
            kitchen: Joi.string().min(3).max(20).required(),
            city: Joi.string().min(2).max(20).required(),
            street: Joi.string().min(5).max(30).required(),
            phone: Joi.string().regex(/^[0-9]{10}$/).required(),
            delivery_price: Joi.number().integer().required()
        });

        Joi.validate(req.body, validation, (err, result) => {
            if (err) {
                res.send({ message: err.details[0].message });
            }
            else {
                Restaurants.create({
                    name: req.body.name,
                    kitchen: req.body.kitchen,
                    city: req.body.city,
                    street: req.body.street,
                    phone: req.body.phone,
                    delivery_price: req.body.delivery_price,
                })
                    .then(row => res.json(row))
                    .catch(err => res.status(500).json(err));
            }
        });
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
})

//Update restaurant
route.put('/restaurants/:id', (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        const validation = Joi.object().keys({
            name: Joi.string().min(3).max(10).required(),
            kitchen: Joi.string().min(3).max(20).required(),
            city: Joi.string().min(2).max(20).required(),
            street: Joi.string().min(5).max(30).required(),
            phone: Joi.string().regex(/^[0-9]{10}$/).required(),
            delivery_price: Joi.number().integer().required()
        });

        Joi.validate(req.body, validation, (err, result) => {
            if (err) {
                res.send({ message: err.details[0].message });
            }
            else {
                Restaurants.findOne({ where: { id: req.params.id } })
                    .then(restaurant => {
                        restaurant.name = req.body.name;
                        restaurant.kitchen = req.body.kitchen;
                        restaurant.city = req.body.kitchen;
                        restaurant.street = req.body.street;
                        restaurant.phone = req.body.phone;
                        restaurant.delivery_price = req.body.delivery_price;

                        restaurant.save()
                            .then(row => res.json(row))
                            .catch(err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err))
            }
        });
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
})

//Delete restaurant
route.delete('/restaurants/:id', (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        Restaurants.findOne({ where: { id: req.params.id } })
            .then(restaurant => {
                restaurant.destroy()
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