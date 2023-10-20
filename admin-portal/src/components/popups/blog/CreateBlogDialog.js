import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createBlog } from '../../../app/features/blog/blogSlice';

const CreateBlogDialog = ({ open, onClose, page, limit, setPage, categories }) => {
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const ref = useRef();
    const [createdBlog, setCreatedBlog] = useState({
        name: '',
        description: '',
        categories: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        categories: '',
        pictures: null,
    });

    const primary = red[500];

    const handleCloseClick = () => {
        onClose();
        setCreatedBlog({
            name: '',
            description: '',
            categories: '',
        });
        setErrors({
            name: '',
            description: '',
            categories: '',
            pictures: null,
        })
        setImages([])
    }

    const handleImageChange = (event) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files);
            setImages((prevImages) => prevImages.concat(fileArray));
            event.target.value = null;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreatedBlog({ ...createdBlog, [name]: value });
        setErrors({
            ...errors,
            name: !createdBlog.name ? "Name is required." : createdBlog.name.length < 3 ? "Name min length 3." : "",
            description: !createdBlog.description ? "Description is required." : "",
            categories: !createdBlog.categories ? "Category is required." : "",
            pictures: images.length < 1 ? "Image is required." : "",
        });
    }

    const handleUpload = () => {
        ref.current.click();
    };

    const handleSave = async () => {
        if (createdBlog.name && createdBlog.description && createdBlog.categories && images.length) {
            const formData = new FormData();
            formData.append('name', createdBlog.name);
            formData.append('description', createdBlog.description);
            formData.append('category', createdBlog.categories);
            formData.append('page', page + 1);
            formData.append('limit', limit);
            images.forEach(image => formData.append('imgCollection', image));
            await dispatch(createBlog(formData)).then((res) => {
                if (res.payload.status === 201) {
                    setPage(0);
                    toast.success(res.payload.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setCreatedBlog({
                        name: '',
                        description: '',
                        categories: '',
                    });
                    setImages([])
                    onClose();
                } else {
                    toast.error(res.payload.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
        }
    };

    return (
        <Dialog open={open}>
            <DialogTitle>Create Blog</DialogTitle>
            <DialogContent className='grid' style={{ paddingTop: '12px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            label="name"
                            type='text'
                            fullWidth
                            value={createdBlog?.name}
                            onChange={handleChange}
                        />
                        {errors.name ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.name}
                        </Box> : null}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="description"
                            label="Description"
                            type='text'
                            fullWidth
                            value={createdBlog?.description}
                            onChange={handleChange}
                        />
                        {errors.description ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.description}
                        </Box> : null}
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                        <Select
                            name="categories"
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="Categories"
                            fullWidth
                            value={createdBlog.categories}
                            onChange={handleChange}
                            disabled={!categories.length}
                        >
                            {categories?.map(cat => {
                                return (
                                    <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                                )
                            })}
                        </Select>
                        {errors.categories ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.categories}
                        </Box> : null}
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            ref={ref}
                            accept="image/*"
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <Box htmlFor="contained-button-file">
                            <Button variant="contained" component="span" onClick={handleUpload}>
                                Upload Images
                            </Button>
                        </Box>
                        {errors.pictures ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.pictures}
                        </Box> : null}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
                            {images?.map((image, index) => (
                                <Grid item xs={12} key={index} sx={{ marginTop: '10px' }} >
                                    <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} style={{ width: '80px', height: '80px' }} />
                                </Grid>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <DialogActions>
                            <Button onClick={handleCloseClick} color="error">
                                Cancel
                            </Button>
                            <Button onClick={handleSave} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBlogDialog;
