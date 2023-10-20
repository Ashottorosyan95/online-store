import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';
import { deleteUser } from '../../../app/features/user/allUsersSlice';

function ConfirmationPopup({ user, open, onClose, message, page, limit, setPage }) {
    const dispatch = useDispatch();

    const handleYes = async () => {
        const query = {
            userId: user._id,
            page: page + 1,
            limit
        }
        await dispatch(deleteUser(query)).then((res) => {
            if (res.payload.status === 200) {
                setPage(0)
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
    );
}

export default ConfirmationPopup;
