const { S3UploadImg, S3DeleteImg } = require("../S3Client/s3Client");
const Blog = require("../models/blog");


class BlogControler {
    constructor() { }

    async createPost(req, res) {
        const page = req.body.page;
        const limit = req.body.limit;
        const images = req.files;

        try {
            const skip = (page - 1) * limit;
            let imageURLs = [];
            if (images.length) {
                images.forEach(async (image) => {
                    let path = `blogs/${Date.now()}-${image.originalname}`;
                    imageURLs.push(path);
                    await S3UploadImg(path, image.buffer);
                });
            }

            const newBlog = new Blog({
                name: req.body.name,
                description: req.body.description,
                categories: req.body.category,
                pictures: imageURLs,
            });

            // Save the blog to the database
            await newBlog.save();


            const blogs = await Blog.find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();

            const totalBlogs = await Blog.countDocuments();

            res.status(201).send({
                message: 'Blog successfully created!',
                blog: blogs,
                totalCount: Math.ceil(totalBlogs),
                curentPage: Number(page)
            })

        } catch (error) {
            console.log('error', error);
            throw new Error('Internal server error');
        }
    }

    async allPosts(req, res) {
        const page = req.query.page;
        const limit = req.query.limit;

        try {
            // Count all users
            const totalBlogs = await Blog.countDocuments();

            const skip = (page - 1) * limit;

            const blogs = await Blog.find()
                .skip(skip)
                .limit(limit)
                .sort({ modifiedAt: -1 })
                .exec();

            res.json({
                blogs,
                totalCount: Math.ceil(totalBlogs),
                curentPage: Number(page)
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getPostById(req, res) {
        const query = { _id: req.params.id };
        try {
            const blog = await Blog.findById(query);

            res.json({ blog });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async searchPost(req, res) {
        const { query, page, limit } = req.query;
        const searchQuery = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { categories: { $regex: query, $options: 'i' } },
            ],
        };

        const currentPage = parseInt(page);
        const rowsPerPage = parseInt(limit);
        const skip = (currentPage - 1) * rowsPerPage;

        try {
            const totalBlogs = await Blog.countDocuments(searchQuery);

            const blogs = await Blog.find(searchQuery)
                .skip(skip)
                .limit(rowsPerPage)
                .exec();

            if (blogs.length) {
                res.status(200).send({
                    blogs: blogs,
                    totalCount: Math.ceil(totalBlogs),
                    currentPage: currentPage,
                });
            } else {
                res.status(200).send('Blogs not found!');
            }
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteBlog(req, res) {
        const where = { _id: req.params.blogId };
        try {
            const deletedBlog = await Blog.findByIdAndDelete(where);
            if (deletedBlog.pictures.length) {
                for (const item of deletedBlog.pictures) {
                    await S3DeleteImg(item);
                }
            }

            if (deletedBlog) {
                res.json({
                    message: 'Blog deleted!',
                });
            } else {
                res.status(404).json({ error: 'Blog not found' });
            }

        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async editBlog(req, res) {
        const where = { _id: req.params.blogId };
        const { name, description, categories, images } = req.body;
        const image = req.files;
        const existingBlog = await Blog.findById(where);
        let imagesArr = [];
        if (typeof images === 'string') {
            imagesArr.push(images)
        } else {
            imagesArr = images
        }

        try {
            if (JSON.stringify(existingBlog.pictures) === JSON.stringify(req.body.images)) {
                if (imagesArr.length) {
                    image.forEach(async (img) => {
                        let path = `blogs/${Date.now()}-${img.originalname}`;
                        imagesArr.push(path);
                        await S3UploadImg(path, img.buffer);
                    });
                }
                const updatedBlog = await Blog.findOneAndUpdate(
                    where,
                    {
                        name: name,
                        description: description,
                        categories: categories,
                        pictures: imagesArr
                    },
                    { new: true }
                );
                res.json({ blog: updatedBlog });
            } else if (JSON.stringify(existingBlog.pictures) !== JSON.stringify(req.body.images)) {
                const deletedImg = existingBlog.pictures.filter(item => item !== req.body.images);
                for (const item of deletedImg) {
                    await S3DeleteImg(item);
                    const updateDocument = {
                        $pull: {
                            pictures: item
                        }
                    };
                    await Blog.findOneAndUpdate(
                        where,
                        updateDocument,
                        { new: true }
                    );
                }

                if (imagesArr.length) {
                    for (const img of image) {
                        let path = `blogs/${Date.now()}-${img.originalname}`;
                        imagesArr.push(path);
                        await S3UploadImg(path, img.buffer);
                    }
                }

                const updatedBlog = await Blog.findOneAndUpdate(
                    where,
                    {
                        name: name,
                        description: description,
                        categories: categories,
                        pictures: imagesArr
                    },
                    { new: true }
                );
                res.json({ blog: updatedBlog });
            } else {
                console.log('Arrays are not equal');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async allAdminDashboardBlogs(req, res) {
        const totalBlogs = await Blog.countDocuments();
        res.json({
            blogsCount: Math.ceil(totalBlogs),
        });
    }

    async filterBlog(req, res) {
        const page = req.query.page;
        const limit = req.query.limit;
        try {
            const skip = (page - 1) * limit;

            // Find documents that match the category
            const query = { categories: req.params.name };
            
            const blogs = await Blog.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ modifiedAt: -1 })
                .exec();

            const totalBlogs = await Blog.countDocuments(query);

            if (blogs.length) {
                res.status(200).send({
                    blogs: blogs,
                    totalCount: Math.ceil(totalBlogs),
                    currentPage: Number(page),
                });
            } else {
                res.status(200).send('Blogs not found!');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}

module.exports = new BlogControler;