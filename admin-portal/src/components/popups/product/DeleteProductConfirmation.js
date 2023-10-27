import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { toast } from 'react-toastify';
import { deleteProduct } from '../../../app/features/product/productApis';

export default function DeleteProductConfirmation({ id, open, onClose, message }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleYes = async () => {
        const query = {
            productId: id,
        }
        await dispatch(deleteProduct(query)).then((res) => {
            if (res.payload.status === 200) {
                navigate(-1)
                toast.success(res.payload.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        });
        onClose();
    };

    return (
        <>
            <Dialog open={open}>
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose()} color="error">
                        No
                    </Button>
                    <Button onClick={handleYes} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

DeleteProductConfirmation.propTypes = {
    id: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    message: PropTypes.string
}
