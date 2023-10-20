const Category = require("../models/category");


class CategoryControler {
    constructor() { }

    async createCategory(req, res) {
        const page = req.body.params.page;
        const limit = req.body.params.limit;
        const data = req.body.data;
        const isEdit = req.body.isEdit;
        const where = { _id: req.body.id };

        try {
            const skip = (page - 1) * limit;
            if (!isEdit) {
                const newCategory = new Category({
                    name: data,
                });
    
                // Save the category to the database
                await newCategory.save();

                const categories = await Category.find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ modifiedAt: -1 })
                    .exec();
    
                const totalCategory = await Category.countDocuments();
    
                res.status(201).send({
                    message: 'Category successfully created!',
                    categories: categories,
                    totalCount: Math.ceil(totalCategory),
                    curentPage: Number(page)
                })
            } else {
                const updatedCategory = await Category.findOneAndUpdate(
                    where,
                    { name: data },
                    { new: true });
    
                    console.log('updatedCategory', updatedCategory);
                if (!updatedCategory) {
                    return res.status(404).json({ error: 'Category not found' });
                }

                res.status(200).send({
                    message: 'Category successfully editing!',
                    category: updatedCategory,
                })
            }

        } catch (error) {
            console.log('error', error);
            throw new Error('Internal server error');
        }
    }

    async allCategoies(req, res) {
        const page = req.query.page;
        const limit = req.query.limit;

        try {
            // Count all category
            const totalCategories = await Category.countDocuments();

            const skip = (page - 1) * limit;

            const categories = await Category.find()
                .skip(skip)
                .limit(limit)
                .sort({ modifiedAt: -1 })
                .exec();

            res.json({
                categories,
                totalCount: Math.ceil(totalCategories),
                curentPage: Number(page)
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteCategory(req, res) {
        const where = { _id: req.params.categoryId };
        const page = req.query.page;
        const limit = req.query.limit;

        try {
            const deletedCategory = await Category.findByIdAndDelete(where);

            const skip = (page - 1) * limit;

            const totalCategories = await Category.countDocuments();

            const categories = await Category.find()
                .skip(skip)
                .limit(limit)
                .sort({ modifiedAt: -1 })
                .exec();

            if (deletedCategory) {
                res.json({
                    categories,
                    totalCount: Math.ceil(totalCategories),
                    curentPage: Number(page),
                    message: 'Category deleted!',
                });
            } else {
                res.status(404).json({ error: 'Category not found' });
            }

        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllCategoies(req, res) {
        const categories = await Category.find();
        res.json({categories});
    }

    async searchCategory(req, res) {
        
    }
}

module.exports = new CategoryControler;