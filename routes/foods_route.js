const express = require('express');
const { sequelize, Foods, Restaurants } = require('../models');
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

//Get all foods
route.get('/foods', (req, res) => {
    Foods.findAll({ include: 'restaurant' })
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
})

//Get food by id
route.get('/foods/:id', (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        Foods.findOne({ where: { id: req.params.id }, include: 'restaurant' })
            .then(row => res.json(row))
            .catch(err => res.status(500).json(err));
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
})

//Create food
route.post('/foods', (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        const validation = Joi.object().keys({
            restaurant_id: Joi.number().min(1).required(),
            name: Joi.string().min(3).max(10).required(),
            price: Joi.number().integer().required(),
            description: Joi.string().min(1).required(),
            category: Joi.string().valid('Appetizer', 'Soup', 'Main course', 'Salad', 'Side dish', 'Sauce', 'Desert').required(),
            portion: Joi.string().valid('Small', 'Medium', 'Big').required(),
        });

        Joi.validate(req.body, validation, (err, result) => {
            if (err) {
                res.send({ message: err.details[0].message });
            }
            else {
                Foods.create({
                    restaurant_id: req.body.restaurant_id,
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    category: req.body.category,
                    portion: req.body.portion
                })
                    .then(row => {
                        Foods.findOne({ where: { id: row.id }, include: 'restaurant' })
                            .then(food => res.json(food))
                            .catch(err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err));
            }
        });
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
})

//Update food
route.put('/foods/:id', (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        const validation = Joi.object().keys({
            restaurant_id: Joi.number().min(1).required(),
            name: Joi.string().min(3).max(10).required(),
            price: Joi.number().integer().required(),
            description: Joi.string().min(1).required(),
            category: Joi.string().valid('Appetizer', 'Soup', 'Main course', 'Salad', 'Side dish', 'Sauce', 'Desert').required(),
            portion: Joi.string().valid('Small', 'Medium', 'Big').required(),
        });

        Joi.validate(req.body, validation, (err, result) => {
            if (err) {
                res.send({ message: err.details[0].message });
            }
            else {
                Foods.findOne({ where: { id: req.params.id }, include: 'restaurant' })
                    .then(food => {
                        food.restaurant_id = req.body.restaurant_id;
                        food.name = req.body.name;
                        food.price = req.body.price;
                        food.description = req.body.description;
                        food.category = req.body.category;
                        food.portion = req.body.portion;

                        food.save()
                            .then(row => res.json(row))
                            .catch(err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err));
            }
        });
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
})

//Delete food
route.delete('/foods/:id', (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        Foods.findOne({ where: { id: req.params.id }, include: 'restaurant' })
            .then(food => {
                food.destroy()
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