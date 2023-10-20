import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { createUser } from '../../../app/features/user/allUsersSlice';
import Iconify from '../../iconify';

const CreateUserDialog = ({ open, onClose, page, limit, setPage }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [createdUser, setCreatedUser] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const primary = red[500];

  const handleCloseClick = () => {
    onClose();
    setCreatedUser({
      username: '',
      email: '',
      phone: '',
      password: '',
    });
    setErrors({
      username: '',
      email: '',
      phone: '',
      password: '',
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreatedUser({ ...createdUser, [name]: value });
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    setErrors({
      ...errors,
      username: !createdUser.username ? "Username is required." : createdUser.username.length < 3 ? "Username min length 3." : "",
      email: !createdUser.email ? "Email address is required." : !emailRegex.test(createdUser.email) ? "Please enter a valid email address" : "",
      phone: !createdUser.phone ? "Phone is required." : "",
      password: !createdUser.password ? "Password is required." : !passwordRegex.test(createdUser.password) ? "Minimum 8 characters, at least one letter and one number." : "",
    });
  };

  const handleSave = async () => {
    const query = {
      user: createdUser,
      page: page + 1,
      limit
    }
    await dispatch(createUser(query)).then((res) => {
      if (res.payload.status === 201) {
        setPage(0);
        toast.success(res.payload.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setCreatedUser({
          username: '',
          email: '',
          phone: '',
          password: '',
        });
        onClose();
      } else {
        toast.error(res.payload.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    })
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Create user</DialogTitle>
      <DialogContent className='grid' style={{ paddingTop: '12px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="username"
              label="Username"
              type='text'
              fullWidth
              value={createdUser?.username}
              onChange={handleInputChange}
            />
            {errors.username ? <Box component="span"
              sx={{
                display: 'block',
                fontSize: '12px',
                textAlign: 'center',
                marginTop: '4px'
              }}
              color={primary}>{errors.username}
            </Box> : null}
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              type='email'
              fullWidth
              value={createdUser?.email}
              onChange={handleInputChange}
            />
            {errors.email ? <Box component="span"
              sx={{
                display: 'block',
                fontSize: '12px',
                textAlign: 'center',
                marginTop: '4px'
              }}
              color={primary}>{errors.email}
            </Box> : null}
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="phone"
              label="Phone"
              type='number'
              fullWidth
              value={createdUser?.phone}
              onChange={handleInputChange}
            />
            {errors.phone ? <Box component="span"
              sx={{
                display: 'block',
                fontSize: '12px',
                textAlign: 'center',
                marginTop: '4px'
              }}
              color={primary}>{errors.phone}
            </Box> : null}
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="password"
              label="Password"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={createdUser?.password}
              onChange={handleInputChange}
            />
            {errors.password ? <Box component="span"
              sx={{
                display: 'block',
                fontSize: '12px',
                textAlign: 'center',
                marginTop: '4px'
              }}
              color={primary}>{errors.password}
            </Box> : null}
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
  );
};

export default CreateUserDialog
