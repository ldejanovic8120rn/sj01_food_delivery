const express = require('express');
const { sequelize, Comments, Users, Restaurants } = require('../models');
const Joi = require('joi');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

//Get all comments
route.get('/comments', (req, res) => {
    Comments.findAll({ include: ['user', 'restaurant'] })  //chek multiple includes
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
})

//Get comment by id
route.get('/comments/:id', (req, res) => {
    Comments.findOne({ where: { id: req.params.id }, include: ['user', 'restaurant'] })
        .then(row => res.json(row))
        .catch(err => res.status(500).json(err));
})

//Create comment
route.post('/comments', (req, res) => {
    Comments.create({
        user_id: req.body.user_id,
        restaurant_id: req.body.restaurant_id,
        rate: req.body.rate,
        content: req.body.content,
        likes: 0,
        posted: new Date()
    })
        .then(row => {
            Comments.findOne({ where: { id: row.id }, include: ['user', 'restaurant'] })
                .then(comment => res.json(comment))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
})

//Update comment
route.put('/comments/:id', (req, res) => {
    Comments.findOne({ where: { id: req.params.id }, include: ['user', 'restaurant'] })
        .then(comment => {
            comment.restaurant_id = req.body.restaurant_id;
            comment.rate = req.body.rate;
            comment.content = req.body.content;

            comment.save()
                .then(row => res.json(row))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
})

//Delete comment
route.delete('/comments/:id', (req, res) => {
    Comments.findOne({ where: { id: req.params.id }, include: ['user', 'restaurant'] })
        .then(comment => {
            comment.destroy()
                .then(row => res.json(row))
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
})

module.exports = route;