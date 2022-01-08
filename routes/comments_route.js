const express = require('express');
const { sequelize, Comments, Users, Restaurants } = require('../models');
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

//Get all comments
route.get('/comments', (req, res) => {
    Comments.findAll({ include: ['user', 'restaurant'] })  //chek multiple includes
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
})

//Get comment by id
route.get('/comments/:id', (req, res) => {
    if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
        Comments.findOne({ where: { id: req.params.id }, include: ['user', 'restaurant'] })
            .then(row => res.json(row))
            .catch(err => res.status(500).json(err));
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
})

//Create comment
route.post('/comments', (req, res) => {
    const validation = Joi.object().keys({
        restaurant_id: Joi.number().min(1).required(),
        rate: Joi.number().min(1).max(10).required(),
        content: Joi.string().min(1).required()
    });

    Joi.validate(req.body, validation, (err, result) => {
        if (err) {
            res.send({ message: err.details[0].message });
        }
        else {
            Comments.create({
                user_id: req.user.id,
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
        }
    });
})

//Update comment
route.put('/comments/:id', (req, res) => {
    const validation = Joi.object().keys({
        restaurant_id: Joi.number().min(1).required(),
        rate: Joi.number().min(1).max(10).required(),
        content: Joi.string().min(1).required()
    });

    Joi.validate(req.body, validation, (err, result) => {
        if (err) {
            res.send({ message: err.details[0].message });
        }
        else {
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
        }
    });
    
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