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

productRouter.get('/list', auth, ProductControler.getAllProducts);

productRouter.get('/all', auth, checkIsAdmin, ProductControler.getProducts);

productRouter.post('/sku', auth, checkIsAdmin, ProductControler.getProductSku);

productRouter.get('/one/:id', auth, ProductControler.getProductById);

productRouter.get('/serach', auth, ProductControler.searchProduct);

productRouter.get('/sort', auth, ProductControler.filterProduct);

productRouter.put('/edit/:id', upload.array("imgEditCollection"), auth, checkIsAdmin, ProductControler.editProduct);

module.exports = productRouter;