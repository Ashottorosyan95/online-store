const express = require("express");
const productRouter = express.Router();
const ProductControler = require("../../controlers/ProductControler");
const auth = require("../../utils/validateToken");
const { checkIsAdmin } = require("../../utils/authUtils");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
});

productRouter.post('/create', upload.array("imgProductCollection"), auth, checkIsAdmin, ProductControler.create);

module.exports = productRouter;