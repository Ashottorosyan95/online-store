import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { red } from '@mui/material/colors';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createCategory } from '../../../app/features/category/categorySlice';

const CreateCategory = ({
    category,
    open,
    onClose,
    page,
    limit,
    setPage,
    isEdit,
    setIsEdit,
    setOpen
}) => {
    const dispatch = useDispatch();

    const [name, setName] = useState('');

    const [error, setError] = useState('');

    const primary = red[500];

    const handleChange = (e) => {
        setName(e.target.value);
        if (!name) {
            setError('Category name is required!')
        } else if (name.length < 3) {
            setError('Category Name min length 3.')
        } else {
            setError('')
        }
    }

    const handleCancelClick = () => {
        onClose();
        setError('');
        setName('');
        setIsEdit(false)
    }

    const handleSave = async () => {
        const query = {
            category: name,
            page: page + 1,
            limit,
            isEdit: isEdit || null,
            id: isEdit ? category._id : null,
        }
        await dispatch(createCategory(query)).then((res) => {
            if (res.payload.status === 201) {
                setPage(0);
                toast.success(res.payload.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setName('');
                onClose();
                setOpen(null);
            } else if (res.payload.status === 200) {
                toast.success(res.payload.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setName('');
                onClose();
                setOpen(null);
            } else {
                toast.error(res.payload.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        })
    }

    useEffect(() => {
        if (isEdit) {
            setName(category.name)
        }
    }, [isEdit]);

    return (
        <Dialog open={open}>
            <DialogTitle>{!isEdit ? 'Create Category' : `Edit category ${name}`}</DialogTitle>
            <DialogContent className='grid' style={{ paddingTop: '12px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            label="Catehory name"
                            type='text'
                            fullWidth
                            value={name}
                            onChange={handleChange}
                        />
                        {error ? <Box component="span"
                            sx={{
                                display: 'block',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}
                            color={primary}>{error}
                        </Box> : null}
                    </Grid>
                    <Grid item xs={12}>
                        <DialogActions>
                            <Button onClick={handleCancelClick} color="error">
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

export default CreateCategory
