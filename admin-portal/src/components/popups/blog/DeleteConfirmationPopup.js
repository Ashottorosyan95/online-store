import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { toast } from 'react-toastify';
import { deleteBlog } from '../../../app/features/blog/blogSlice';

const DeleteConfirmationPopup = ({ id, open, onClose, message }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleYes = async () => {
        const query = {
            blogId: id,
        }
        await dispatch(deleteBlog(query)).then((res) => {
            if (res.payload.status === 200) {
                navigate(-1)
                toast.success(res.payload.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
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

export default DeleteConfirmationPopup;
