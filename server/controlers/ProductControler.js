const { S3UploadImg, S3DeleteImg } = require("../S3Client/s3Client");
const { STATUS, ProductFilter } = require("../constants/constants");
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

    async getProductSku(req, res) {
        const { data } = req.body
        if (data) {
            const sku = await Product.findOne({ SKU: data }).select('SKU');
            if (sku?.SKU) {
                res.status(200).send('Sku alredy exists!')
            } else {
                res.send('Ok');
            }
        }
    }

    async getProducts(req, res) {
        try {
            const products = await Product.find().exec();

            res.json({products});
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal Server Error' });
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
                    await Product.updateMany({ status: '' })
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
    };

    async getProductById(req, res) {
        const query = { _id: req.params.id };

        try {
            const product = await Product.findById(query);

            res.json({ product });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async searchProduct(req, res) {
        const { query, page, limit } = req.query;
        const searchQuery = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { SKU: { $regex: query, $options: 'i' } },
            ],
        };

        const currentPage = parseInt(page);
        const rowsPerPage = parseInt(limit);
        const skip = (currentPage - 1) * rowsPerPage;

        try {
            const totalProducts = await Product.countDocuments(searchQuery);

            const products = await Product.find(searchQuery)
                .skip(skip)
                .limit(rowsPerPage)
                .sort({ modifiedAt: -1 })
                .exec();

            if (products.length) {
                res.status(200).send({
                    products,
                    totalCount: Math.ceil(totalProducts),
                    currentPage: currentPage,
                });
            } else {
                res.status(200).send('Product not found!');
            }
        } catch (error) {
            console.error('Error searching products:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async filterProduct(req, res) {
        const { sort, page, limit } = req.query;
        let sortOption = {};

        if (sort === ProductFilter.NEWEST) {
            sortOption = { createdAt: -1 };
        } else if (sort === ProductFilter.PRICEHIGHLOW) {
            sortOption = { price: -1 };
        } else if (sort === ProductFilter.PRICELOWHIGH) {
            sortOption = { price: 1 };
        }

        try {
            const skip = (page - 1) * limit;

            const filteredProducts = await Product.find()
                .skip(skip)
                .limit(limit)
                .sort(sortOption)
                .exec();

            const totalProducts = await Product.countDocuments();

            if (filteredProducts.length) {
                res.status(200).send({
                    products: filteredProducts,
                    totalCount: Math.ceil(totalProducts),
                    currentPage: Number(page),
                });
            } else {
                res.status(200).send('Product not found!');
            }
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async editProduct(req, res) {
        const where = { _id: req.params.id };
        const {
            name,
            price,
            salaryPrice,
            size,
            description,
            category,
            imgEditCollection
        } = req.body;
        const image = req.files;
        const existingProduct = await Product.findById(where);
        let imagesArr = [];
        if (typeof imgEditCollection === 'string') {
            imagesArr.push(imgEditCollection)
        } else {
            imagesArr = imgEditCollection
        }

        try {
            if (JSON.stringify(existingProduct.pictures) === JSON.stringify(imgEditCollection)) {
                if (imagesArr.length) {
                    image.forEach(async (img) => {
                        let path = `products/${Date.now()}-${img.originalname}`;
                        imagesArr.push(path);
                        await S3UploadImg(path, img.buffer);
                    });
                }
                const updatedProduct = await Product.findOneAndUpdate(
                    where,
                    {
                        name: name,
                        price: price,
                        salaryPrice: salaryPrice,
                        size: size,
                        description: description,
                        categoryId: category,
                        pictures: imagesArr
                    },
                    { new: true }
                );
                res.json({ product: updatedProduct });
            } else if (JSON.stringify(existingProduct.pictures) !== JSON.stringify(imgEditCollection)) {
                const deletedImg = existingProduct.pictures.filter(item => item !== imgEditCollection);
                for (const item of deletedImg) {
                    await S3DeleteImg(item);
                    const updateDocument = {
                        $pull: {
                            pictures: item
                        }
                    };
                    await Product.findOneAndUpdate(
                        where,
                        updateDocument,
                        { new: true }
                    );
                }

                if (imagesArr.length) {
                    for (const img of image) {
                        let path = `products/${Date.now()}-${img.originalname}`;
                        imagesArr.push(path);
                        await S3UploadImg(path, img.buffer);
                    }
                }

                const updatedProduct = await Product.findOneAndUpdate(
                    where,
                    {
                        name: name,
                        price: price,
                        salaryPrice: salaryPrice,
                        size: size,
                        description: description,
                        categoryId: category,
                        pictures: imagesArr
                    },
                    { new: true }
                );
                res.json({ product: updatedProduct });
            } else {
                console.log('Arrays are not equal');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteProduct(req, res) {
        const where = { _id: req.params.id };
        try {
            const deletedProduct = await Product.findByIdAndDelete(where);
            if (deletedProduct.pictures.length) {
                for (const item of deletedProduct.pictures) {
                    await S3DeleteImg(item);
                }
            }

            if (deletedProduct) {
                res.json({
                    message: 'Product deleted!',
                });
            } else {
                res.status(404).json({ error: 'Product not found' });
            }

        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

};

module.exports = new ProductControler;