const express = require('express');
const { sequelize, Restaurants } = require('../models');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

//Get all restaurants
route.get('/restaurants', (req, res) => {
    Restaurants.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
})

//Get restaurant by id
route.get('/restaurants/:id', (req, res) => {
    Restaurants.findOne({ where: { id: req.params.id } })
        .then(row => res.json(row))
        .catch(err => res.status(500).json(err));
})

//Create restaurant
route.post('/restaurants', (req, res) => {
    Restaurants.create({
        name: req.body.name,
        kitchen: req.body.kitchen,
        city: req.body.kitchen,
        street: req.body.street,
        phone: req.body.phone,
        delivery_price: req.body.delivery_price
    })
        .then(row => res.json(row))
        .catch(err => res.status(500).json(err));
})

//Update restaurant
route.put('/restaurants/:id', (req, res) => {
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
})

//Delete restaurant
route.delete('/restaurants/:id', (req, res) => {
    Restaurants.findOne({ where: { id: req.params.id } })
        .then(restaurant => {
            restaurant.destroy()
                .then(row => res.json(row))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
})

module.exports = route;