import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createProduct } from '../../../app/features/product/productApis';

const CreateProductDialog = ({ open, onClose, page, limit, setPage, categories }) => {
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const ref = useRef();
    const [selectValue, setSelectValue] = useState('');
    const [createdProduct, setCreatedProduct] = useState({
        name: '',
        price: null,
        salaryprice: null,
        size: '',
        sku: '',
        description: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        price: null,
        salaryPrice: null,
        size: '',
        sku: '',
        description: '',
        categoryId: '',
        pictures: null,
    });

    const primary = red[500];

    const handleCloseClick = () => {
        onClose();
        setCreatedProduct({
            name: '',
            price: null,
            salaryprice: null,
            size: '',
            sku: '',
            description: '',
        });
        setErrors({
            name: '',
            price: null,
            salaryprice: null,
            size: '',
            sku: '',
            description: '',
            categoryId: '',
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
        const regexPattern = /^[A-Z]{2}\d{2}[A-Z]$/;
        const { name, value } = e.target;
        setCreatedProduct({ ...createdProduct, [name]: value });
        setErrors({
            ...errors,
            name: !createdProduct.name ? "Name is required." : createdProduct.name.length < 3 ? "Name min length 3." : "",
            price: !createdProduct.price ? "Price is required." : "",
            sku: !createdProduct.sku ? "SKUis required." : !regexPattern.test(createdProduct.sku) ? "Please enter a valid format (e.g SA24FR)." : "",
            categories: !createdProduct.categories ? "Category is required." : "",
            pictures: images.length < 1 ? "Image is required." : "",
        });
    }

    const handleSelectChange = (e) => {
        console.log('e.target.value', e.target.value);
        setSelectValue(e.target.value)
    }

    const handleUpload = () => {
        ref.current.click();
    };

    const handleSave = async () => {
        // if (createdProduct.name
        //     && selectValue
        //     && images.length
        //     && createProduct.price
        //     && createProduct.size
        //     && createProduct.sku
        // ) {
            const formData = new FormData();
            formData.append('name', createdProduct.name);
            formData.append('price', createdProduct.price);
            formData.append('salaryPrice', createdProduct.salaryprice);
            formData.append('size', createdProduct.size);
            formData.append('sku', createdProduct.sku);
            formData.append('description', createdProduct.description);
            formData.append('category', selectValue);
            formData.append('page', page + 1);
            formData.append('limit', limit);
            images.forEach(image => formData.append('imgProductCollection', image));
            await dispatch(createProduct(formData)).then((res) => {
                if (res.payload.status === 201) {
                    setPage(0);
                    toast.success(res.payload.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setCreatedProduct({
                        name: '',
                        price: null,
                        salaryprice: null,
                        size: '',
                        sku: '',
                        description: '',
                    });
                    setImages([]);
                    setSelectValue('')
                    onClose();
                } else {
                    toast.error(res.payload.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
        // }
    };

    return (
        <Dialog open={open}>
            <DialogTitle>Create Product</DialogTitle>
            <DialogContent className='grid' style={{ paddingTop: '12px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            label="Name"
                            type='text'
                            fullWidth
                            value={createdProduct?.name}
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
                            name="price"
                            label="Price"
                            type='number'
                            fullWidth
                            value={createdProduct?.price}
                            onChange={handleChange}
                        />
                        {errors.price ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.price}
                        </Box> : null}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="salaryprice"
                            label="Salary Price"
                            type='number'
                            fullWidth
                            value={createdProduct?.salaryprice}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="size"
                            label="Size"
                            type='text'
                            fullWidth
                            value={createdProduct?.size}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="description"
                            label="Description"
                            type='text'
                            fullWidth
                            value={createdProduct?.description}
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
                        <TextField
                            name="sku"
                            label="Sku"
                            type='text'
                            fullWidth
                            value={createdProduct?.sku}
                            onChange={handleChange}
                        />
                        {errors.sku ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.sku}
                        </Box> : null}
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">Categories</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                fullWidth
                                value={selectValue}
                                onChange={handleSelectChange}
                                disabled={!categories.length}
                                label="Categories"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {categories?.map(cat => {
                                    return (
                                        <MenuItem key={cat._id} value={cat._id}>By {cat.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
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

export default CreateProductDialog;
