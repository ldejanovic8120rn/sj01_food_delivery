const express = require('express');
const { sequelize, Foods, Restaurants } = require('../models');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

//Get all foods
route.get('/foods', (req, res) => {
    Foods.findAll({ include: 'restaurant' })
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
})

//Get food by id
route.get('/foods/:id', (req, res) => {
    Foods.findOne({ where: { id: req.params.id }, include: 'restaurant' })
        .then(row => res.json(row))
        .catch(err => res.status(500).json(err));
})

//Create food
route.post('/foods', (req, res) => {
    Foods.create({
        restaurant_id: req.body.restaurant_id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        portion: req.body.portion
    })
        .then(row => res.json(row))
        .catch(err => res.status(500).json(err));
})

//Update food
route.put('/foods/:id', (req, res) => {
    Foods.findOne({ where: { id: req.params.id }, include: 'restaurant' })
        .then(food => {
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
})

//Delete food
route.delete('/foods/:id', (req, res) => {
    Foods.findOne({ where: { id: req.params.id },  include: 'restaurant' })
        .then(food => {
            food.destroy()
                .then(row => res.json(row))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
})

module.exports = route;