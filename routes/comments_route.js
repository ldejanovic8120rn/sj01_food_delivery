const express = require('express');
const { sequelize, Comments, Users, Restaurants } = require('../models');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.get('/', (req, res) => {

})

route.get('/:id', (req, res) => {

})

route.post('/', (req, res) => {

})

route.put('/:id', (req, res) => {

})

route.delete('/:id', (req, res) => {

})

module.exports = route;