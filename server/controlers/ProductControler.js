const { S3UploadImg } = require("../S3Client/s3Client");
const Product = require("../models/product");

class ProductControler {
    constructor() { }

    async create(req, res) {
        // const page = req.query.page;
        // const limit = req.query.limit;
        // const data = req.body.data;
        // const isEdit = req.body.isEdit;
        // const where = { _id: req.body.id };
        const page = req.body.page;
        const limit = req.body.limit;
        const images = req.files;
        console.log('req.query', req.query);
        console.log('req.body', req.body);
        console.log('req.files', req.files);
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

};

module.exports = new ProductControler;