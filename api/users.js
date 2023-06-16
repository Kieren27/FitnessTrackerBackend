/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();

const jwt = require('jsonwebtoken');
const { getUserByUsername, createUser, getUser } = require("../db");

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            res.send({
                message: `User ${_user.username} is already taken.`,
                name: 'UserExistsError',
                error: 'Error creating new user as that username already exists'
            });
        }

        if (password.length < 8) {
            res.send({
                error: 'Error Creating Password: Password must be at least 8 or more characters',
                message: "Password Too Short!",
                name: "PasswordLengthError"
            });
        }

        const user = await createUser({
            username,
            password
        });

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, { expiresIn: '1w' });

        res.send({
            user: {
                id: user.id,
                username: user.username
            },
            message: "thank you for signing up",
            token
        });
    } catch ({ name, message }) {
        next({ name, message });
    }
});
// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUser({ username, password });

        console.log("hello");

        if (!user) {
            next({
                name: "InvalidUsername",
                message: "That user does not exist"
            });
        }


        const token = jwt.sign({
            id: user.id,
            username: user.username,
        }, process.env.JWT_SECRET);


        res.send({ user, token, message: "you're logged in!" });


    } catch (error) {
        console.log(error);
        next(error);
    }
});
// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;

