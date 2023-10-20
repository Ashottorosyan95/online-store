const bcrypt = require('bcrypt');
const User = require("../models/user");
const fetchUser = require("../utils/findUserByToken");
const { UserRoles } = require('../constants/constants');

class UserControler {
    constructor() { }

    async findAdmin(req, res) {
        const authHeader = req.headers.authorization;
        const user = await fetchUser(authHeader);
        const userData = await User.findOne({ email: user.email });

        const newData = {
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar,
            phone: userData.phone,
            role: userData.role,
        }
        res.send(newData);
    };

    async allUsers(req, res) {
        const page = req.query.page;
        const limit = req.query.limit;

        try {
            // Count all users
            const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

            const skip = (page - 1) * limit;

            const users = await User.find({ role: { $ne: 'admin' } })
                .select('-password -refreshToken -otherSensitiveField')
                .skip(skip)
                .limit(limit)
                .sort({ modifiedAt: -1 })
                .exec();

            res.json({
                users,
                totalCount: Math.ceil(totalUsers),
                curentPage: Number(page)
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async allAdminDashboardUsers(req, res) {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        res.json({
            usersCount: Math.ceil(totalUsers),
        });
    }

    async editUser(req, res) {
        try {
            const where = { _id: req.params.userId };
            const updatedUser = await User.findOneAndUpdate(
                where,
                req.body.editData,
                { new: true })
                .select('-password -refreshToken -otherSensitiveField');

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(updatedUser);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteUser(req, res) {
        const where = { _id: req.params.userId };
        const page = req.query.page;
        const limit = req.query.limit;

        try {
            const deletedUser = await User.findByIdAndDelete(where);

            const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

            const skip = (page - 1) * limit;

            const users = await User.find({ role: { $ne: 'admin' } })
                .select('-password -refreshToken -otherSensitiveField')
                .skip(skip)
                .limit(limit)
                .exec();

            if (deletedUser) {
                res.json({
                    message: 'User deleted!',
                    usersData: users,
                    totalCount: Math.ceil(totalUsers),
                    curentPage: Number(page)
                });
            } else {
                res.status(404).json({ error: 'User not found' });
            }

        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createUser(req, res) {
        const page = req.body.params.page;
        const limit = req.body.params.limit;

        try {
            const skip = (page - 1) * limit;

            const user = await User.findOne({ email: req.body.data.user.email });

            // If user exists, return an error message
            if (user) {
                res.status(409).send({
                    message: 'Email is already registered!',
                })
            }

            //Generate the password hash
            const hashedPassword = await bcrypt.hash(req.body.data.user.password, 10);

            // Create a new user
            const newUser = new User({
                ...req.body.data.user,
                role: UserRoles.MODERATOR,
                password: hashedPassword,
            });

            // Save the user to the database
            await newUser.save();


            const users = await User.find({ role: { $ne: 'admin' } })
                .select('-password -refreshToken -otherSensitiveField')
                .skip(skip)
                .limit(limit)
                .sort({ modifiedAt: -1 })
                .exec();

            const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

            res.status(201).send({
                message: 'User successfully created!',
                user: users,
                totalCount: Math.ceil(totalUsers),
                curentPage: Number(page)
            })

        } catch (error) {
            console.log('error', error);
            throw new Error('Internal server error');
        }
    }

    async searchUser(req, res) {
        const { query, page, limit } = req.query;
        const searchQuery = {
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ],
            role: { $ne: 'admin' }
        };

        const currentPage = parseInt(page);
        const rowsPerPage = parseInt(limit);
        const skip = (currentPage - 1) * rowsPerPage;

        try {
            const totalUsers = await User.countDocuments(searchQuery);

            const users = await User.find(searchQuery)
                .select('-password -refreshToken -otherSensitiveField')
                .skip(skip)
                .limit(rowsPerPage)
                .exec();

            if (users.length) {
                res.status(200).send({
                    users: users,
                    totalCount: Math.ceil(totalUsers),
                    currentPage: currentPage,
                });
            } else {
                res.status(200).send('User not found!');
            }
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteCheckUsers(req, res) {
        const page = req.query.page;
        const limit = req.query.limit;
        const users = req.body.users;

        try {
            const skip = (page - 1) * limit;

            const usersData = await User.find();

            const usersIds = users.filter((id) => !usersData.includes(id));

            const deletedUser = await User.deleteMany({ _id: { $in: usersIds } });

            const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

            const dataUsers = await User.find({ role: { $ne: 'admin' } })
                .select('-password -refreshToken -otherSensitiveField')
                .skip(skip)
                .limit(limit)
                .exec();

            if (deletedUser) {
                res.json({
                    message: 'Users deleted!',
                    usersData: dataUsers,
                    totalCount: Math.ceil(totalUsers),
                    curentPage: Number(page)
                });
            } else {
                res.status(404).json({ error: 'User not found' });
            }

        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

};

module.exports = new UserControler;