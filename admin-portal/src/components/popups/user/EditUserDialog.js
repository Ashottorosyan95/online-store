import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid, DialogActions } from '@mui/material';
import { red } from '@mui/material/colors';
import { editUser } from '../../../app/features/user/allUsersSlice';

function EditUserDialog({ user, open, onClose }) {
    const dispatch = useDispatch();
    const [editedUser, setEditedUser] = useState({
        username: '',
        email: '',
        phone: '',
    });

    const primary = red[500];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSave = async () => {
        const query = {
            userId: user._id,
            data: editedUser
        }
        await dispatch(editUser(query));
        onClose();
    };

    useEffect(() => {
        setEditedUser({
            username: user?.username,
            email: user?.email,
            phone: user?.phone,
        })
    }, [user])

    return (
        <Dialog open={open}>
            <DialogTitle>Edit user <span style={{ color: primary }}>{user?.username}</span></DialogTitle>
            <DialogContent className='grid' style={{ paddingTop: '12px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="username"
                            label="Username"
                            fullWidth
                            value={editedUser?.username}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="email"
                            label="Email"
                            fullWidth
                            value={editedUser?.email}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="phone"
                            label="Phone"
                            fullWidth
                            value={editedUser?.phone}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DialogActions>
                            <Button onClick={() => onClose()} color="error">
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
    );
}

export default EditUserDialog;
