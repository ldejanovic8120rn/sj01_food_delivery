const express = require('express');
const { sequelize, Users } = require('./models');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config();

const app = express();

var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

//Register new user
app.post('/register', (req, res) => {

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
                password: bcrypt.hashSync(req.body.password, 10)
            })
                .then(row => {
                    const user = {
                        id: row.id,
                        role: row.role,
                        username: row.username
                    };

                    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                    res.json({ token: token });
                })
                .catch(err => res.status(500).json(err));
        }
    });
});

//Login user
app.post('/login', (req, res) => {
    const validation = Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string().alphanum().min(5).max(15).required(),
    });

    Joi.validate(req.body, validation, (err, result) => {
        if (err) {
            res.send({ message: err.details[0].message });
        }
        else {
            Users.findOne({ where: { email: req.body.email } })
                .then(row => {
                    if (bcrypt.compareSync(req.body.password, row.password)) {
                        const user = {
                            id: row.id,
                            role: row.role,
                            username: row.username
                        };

                        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                        res.json({ token: token });
                    } else {
                        res.status(400).json({ msg: "Invalid credentials" });
                    }
                    
                })
                .catch(err => res.status(500).json(err));
        }
    });
});

app.listen({ port: 8082 }, async () => {
    await sequelize.authenticate();
    console.log('Auth server started!');
});