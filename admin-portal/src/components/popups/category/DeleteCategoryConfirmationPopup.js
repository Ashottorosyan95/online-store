import React from 'react'
import { useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { toast } from 'react-toastify';
import { deleteCategoryByid } from '../../../app/features/category/categorySlice';

const DeleteCategoryConfirmationPopup = ({ id, open, onClose, message, page, limit, setPage }) => {
    const dispatch = useDispatch();

    const handleYes = async () => {
        const query = {
            categoryId: id,
            page: page + 1,
            limit
        }
        await dispatch(deleteCategoryByid(query)).then((res) => {
            if (res.payload.status === 200) {
                toast.success(res.payload.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                onClose();
            }
        });
        onClose();
    };

    const handleNo = () => {
        onClose();
    };

    return (
        <>
            <Dialog open={open}>
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNo} color="error">
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

export default DeleteCategoryConfirmationPopup;
