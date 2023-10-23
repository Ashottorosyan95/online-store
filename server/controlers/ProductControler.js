const { S3UploadImg } = require("../S3Client/s3Client");
const { STATUS } = require("../constants/constants");
const Product = require("../models/product");

class ProductControler {
    constructor() { }

    async create(req, res) {
        const page = req.body.page;
        const limit = req.body.limit;
        const images = req.files;
        try {
            const skip = (page - 1) * limit;
            let imageURLs = [];
            if (images.length) {
                images.forEach(async (image) => {
                    let path = `products/${Date.now()}-${image.originalname}`;
                    imageURLs.push(path);
                    await S3UploadImg(path, image.buffer);
                });
            }
            const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                salaryPrice: req.body.salaryPrice,
                size: req.body.size,
                SKU: req.body.sku,
                description: req.body.description,
                categoryId: req.body.category,
                pictures: imageURLs,
                status: STATUS.NEW,
            });

            // Save the product to the database
            await newProduct.save();


            const products = await Product.find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();

            const totalProducts = await Product.countDocuments();

            res.status(201).send({
                products,
                totalCount: Math.ceil(totalProducts),
                curentPage: Number(page),
                message: 'Product successfully created!',
            })
        } catch (error) {
            console.log('error', error);
            throw new Error('Internal server error');
        }
    }

    async getAllProducts(req, res) {
        const page = req.query.page;
        const limit = req.query.limit;

        try {
            // Count all products
            const totalProducts = await Product.countDocuments();

            const skip = (page - 1) * limit;

            const products = await Product.find()
                .skip(skip)
                .limit(limit)
                .sort({ modifiedAt: -1 })
                .exec();


            products.forEach(async (prod) => {
                const createdAtDate = new Date(prod.createdAt);
                const currentDate = new Date();
                const timeDiff = Math.abs(currentDate.getTime() - createdAtDate.getTime());
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (daysDiff >= 5 && prod.status === 'new') {
                    await Product.updateMany({status: ''})
                }
            });


            res.json({
                products,
                totalCount: Math.ceil(totalProducts),
                curentPage: Number(page)
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

};

module.exports = new ProductControler;