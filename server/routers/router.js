const express = require("express");
const router = express.Router();
const multer = require('multer');
const AuthControler = require("../controlers/AuthControler");
const { body } = require("express-validator");
const passport = require("passport");
const auth = require("../utils/validateToken");
const UserControler = require("../controlers/UserControler");
const { checkIsAdmin } = require("../utils/authUtils");
const BlogControler = require("../controlers/BlogControler");
const CategoryControler = require("../controlers/CategoryControler");
const productRouter = require("./product/productRouter");

const upload = multer({
    storage: multer.memoryStorage(),
});


// user routes
router.post('/signup', [
    body('username').notEmpty().withMessage('Username is required!'),
    body('phone').notEmpty().withMessage('Phone is required!'),
    body('email').isEmail().withMessage('Email is required!'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], AuthControler.signUp);

router.post('/signin', [
    body('email').isEmail().withMessage('Email is required!'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], AuthControler.signIn);

router.get('/refresh', AuthControler.refresh);

router.get('/logout', auth, AuthControler.logOut);

router.get('/admin', auth, checkIsAdmin, UserControler.findAdmin);

router.get('/get-all-users', auth, checkIsAdmin, UserControler.allUsers);

router.get('/get-all-dashboard-users', auth, checkIsAdmin, UserControler.allAdminDashboardUsers);

router.put('/edit-user/:userId', auth, checkIsAdmin, UserControler.editUser);

router.delete('/delete-user/:userId', auth, checkIsAdmin, UserControler.deleteUser);

router.delete('/delete-check-user', auth, checkIsAdmin, UserControler.deleteCheckUsers);

router.post('/create', auth, checkIsAdmin, UserControler.createUser);

router.get('/serach', auth, checkIsAdmin, UserControler.searchUser);


// blog routes
router.post('/create-post', upload.array("imgCollection"), auth, checkIsAdmin, BlogControler.createPost);

router.get('/get-all-post', auth, BlogControler.allPosts);

router.get('/post-serach', auth, BlogControler.searchPost);

router.get('/post/:id', auth, BlogControler.getPostById);

router.delete('/delete-blog/:blogId', auth, checkIsAdmin, BlogControler.deleteBlog);

router.put('/edit-blog/:blogId', upload.array("images"), auth, checkIsAdmin, BlogControler.editBlog);

router.get('/get-all-dashboard-blogs', auth, checkIsAdmin, BlogControler.allAdminDashboardBlogs);

router.get('/filter/:name', auth, BlogControler.filterBlog);

// category routes
router.post('/create-category', auth, checkIsAdmin, CategoryControler.createCategory);

router.get('/get-all-category', auth, checkIsAdmin, CategoryControler.allCategoies);

router.get('/get-categories', auth, checkIsAdmin, CategoryControler.getAllCategoies);

router.delete('/delete-category/:categoryId', auth, checkIsAdmin, CategoryControler.deleteCategory);

router.get('/category-serach', auth, checkIsAdmin, CategoryControler.searchCategory);

// product routes
router.use('/product', productRouter)

module.exports = router;