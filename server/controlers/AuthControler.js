const bcrypt = require('bcrypt');
const User = require("../models/user");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");
const jwt = require('jsonwebtoken');


class AuthControler {
    constructor() { }


    async signUp(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });

            // If user exists, return an error message
            if (user) {
                res.status(409).send({
                    message: 'Email is already registered!',
                })
            }

            //Generate the password hash
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Create a new user
            const newUser = new User({
                ...req.body,
                password: hashedPassword,
            });

            // Save the user to the database
            await newUser.save();

            res.status(201).send({
                message: 'User successfully created!',
            })

        } catch (error) {
            console.log('error', error);
            throw new Error('Internal server error');
        }
    }

    async signIn(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            // if user does not exist throw exception
            if (!user) return { error: 'User does not exist!' };

            if (req.headers.origin === 'http://localhost:4000') {
                if (user.role === 'admin' || user.role === 'moderator') {
                    const passwordMatches = await bcrypt.compare(req.body.password, user.password);
                    if (!passwordMatches) return { error: 'Password is incorrect!' };

                    // Generate tokens
                    const accessToken = generateAccessToken(req.body.email, user.role);
                    const refreshToken = generateRefreshToken(req.body.email, user.role);

                    // Update a user refresh token
                    const where = { email: req.body.email };
                    const update = { refreshToken: refreshToken };
                    await User.findOneAndUpdate(where, update, {
                        new: true
                    });

                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });


                    res.send({
                        accessToken,
                        refreshToken,
                        message: 'You are successfully logged in!'
                    })
                } else {
                    res.status(404).send({ message: "Admin not found!" })
                }
            } else {
                if (user.role === 'user') {
                    const passwordMatches = await bcrypt.compare(req.body.password, user.password);
                    if (!passwordMatches) return { error: 'Password is incorrect!' };

                    // Generate tokens
                    const accessToken = generateAccessToken(req.body.email, user.role);
                    const refreshToken = generateRefreshToken(req.body.email, user.role);

                    // Update a user refresh token
                    const where = { email: req.body.email };
                    const update = { refreshToken: refreshToken };
                    await User.findOneAndUpdate(where, update, {
                        new: true
                    });

                    res.send({
                        accessToken,
                        refreshToken,
                        message: 'You are successfully logged in!'
                    })
                } else {
                    res.status(404).send({ message: "User not found!" })
                }
            }

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: error });
        }
    }

    async logOut(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).send({
                message: "Unauthorized!",
                success: false,
            });
        } else {
            const token = authHeader?.split(" ")[1];
            const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            // Update a user refresh token
            const where = { email: user.email };
            const update = { refreshToken: null };
            await User.findOneAndUpdate(where, update, {
                new: true
            });
            res.send({
                message: 'Logged out successfully'
            });
        }
    }

    async refresh(req, res) {
        const cookies = req.cookies;
        const refreshToken = cookies['refreshToken'];

        
        if (!refreshToken) {
            return res.status(401).send('Refresh token not found');
        }

        const userToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findOne({ email: userToken.email });

        try {
            // Generate tokens
            const accessToken = generateAccessToken(user.email, user.role);
            const newRefreshToken = generateRefreshToken(user.email);


            const where = { email: user.email };
            const update = { refreshToken: newRefreshToken };
            await User.findOneAndUpdate(where, update, {
                new: true
            });

            res.clearCookie('refreshToken');
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });


            return res.send(accessToken);
        } catch (error) {
            return res.status(401).send('Invalid refresh token');
        }
    }

};

module.exports = new AuthControler;