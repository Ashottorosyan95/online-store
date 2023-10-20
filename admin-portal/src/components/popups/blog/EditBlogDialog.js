import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, ImageListItem, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { editBlog } from '../../../app/features/blog/blogSlice';

const EditBlogDialog = ({ blog, open, onClose }) => {
    const ref = useRef();
    const [editedBlog, setEditedBlog] = useState({});
    const [images, setImages] = useState([]);
    const dispatch = useDispatch();

    const handleCloseClick = () => {
        onClose()
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedBlog({ ...editedBlog, [name]: value });
    };

    const handleImageChange = (event) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files);
            setImages((prevImages) => prevImages.concat(fileArray));
            event.target.value = null;
        }
    };

    const handleUpload = () => {
        ref.current.click();
    };

    const deleteImageClick = (img, index) => {
        if (typeof img === 'string') {
            const filteredArray = images.filter(item => item !== img);
            setImages(filteredArray);
        } else {
            setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        }
    }


    const handleSave = async () => {
        if (editedBlog.name && editedBlog.description && editedBlog.categories && images.length) {
            const formData = new FormData();
            formData.append('name', editedBlog.name);
            formData.append('description', editedBlog.description);
            formData.append('category', editedBlog.categories);
            images.forEach(image => formData.append('images', image));
            const query = {
                blogId: editedBlog._id,
                data: formData
            }
            await dispatch(editBlog(query)).then((res) => {
                if (res.payload.status === 200) {
                    onClose();
                }
            })
        }
    };

    useEffect(() => {
        setEditedBlog({ ...blog });
        setImages(blog?.pictures)
    }, [blog])

    return (
        <Dialog open={open}>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogContent className='grid' style={{ paddingTop: '12px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            type='text'
                            fullWidth
                            value={editedBlog?.name}
                            onChange={handleInputChange}
                        />
                        {/* {errors.name ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.name}
                        </Box> : null} */}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="description"
                            type='text'
                            fullWidth
                            value={editedBlog?.description}
                            onChange={handleInputChange}
                        />
                        {/* {errors.description ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.description}
                        </Box> : null} */}
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                        <Select
                            name="categories"
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="Categories"
                            fullWidth
                            defaultValue={editedBlog.categories}
                            value={editedBlog.categories}
                            onChange={handleInputChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                        {/* {errors.categories ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.categories}
                        </Box> : null} */}
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
                        {/* {errors.pictures ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{errors.pictures}
                        </Box> : null} */}
                        <DialogTitle>Edit Blog</DialogTitle>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
                            {images?.map((image, index) => (
                                <Grid item xs={12} key={index} sx={{ marginTop: '10px', position: 'relative' }} >
                                    <Box
                                        component="img"
                                        sx={{
                                            height: 80,
                                            width: 80,
                                        }}
                                        src={typeof image === 'string' ? `${process.env.REACT_APP_AMAZON_S3_URL}/${image}` : URL.createObjectURL(image)}
                                        alt='img'
                                    />
                                    {images.length > 1 ?
                                        <Box
                                            onClick={() => deleteImageClick(image, index)}
                                            style={{
                                                color: 'red',
                                                cursor: 'pointer',
                                                position: 'absolute',
                                                top: '-4px',
                                                right: '32px'
                                            }}
                                        >X</Box> : null
                                    }
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

export default EditBlogDialog;
