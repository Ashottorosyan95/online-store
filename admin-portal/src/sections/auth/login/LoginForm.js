import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
// apis
import { loginAuth } from '../../../app/features/user/userSlice';

const MessageError = styled('span')(({ theme }) => ({
  color: 'red',
  fontSize: '12px',
  textAlign: 'center',
  marginTop: '6px !important'
}));

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [signinDetails, setSigninDetails] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });


  const handleOnChange = (data) => {
    setSigninDetails(data);
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    setErrors({
      ...errors,
      email: !data.email ? "Email address is required." : !emailRegex.test(data.email) ? "Please enter a valid email address" : "",
      password: !data.password ? "Password is required." : !passwordRegex.test(data.password) ? "Minimum 6 characters, at least one letter and one number." : "",
    });
  }

  const handleClick = async () => {
    if (!signinDetails.email) {
      setErrors({
        ...errors,
        email: "Email address is required.",
      });
    } else if (!signinDetails.password) {
      setErrors({
        ...errors,
        password: "Password is required.",
      });
    } else if (!errors.email && !errors.password) {
      await dispatch(loginAuth(signinDetails)).then((res) => {
        if (res.payload.status === 200) {
          toast.success(res.payload.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setSigninDetails({
            email: '',
            password: '',
          });
          navigate('/dashboard', { replace: true });
        } else if (res.payload.status === 404 && res.payload.data.message === 'Admin not found!') {
          window.open('http://localhost:3000/');
        }
      })
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={signinDetails.email}
          onChange={(e) => handleOnChange({ ...signinDetails, email: e.target.value })}
        />
        <MessageError>{errors.email ? errors.email : null}</MessageError>

        <TextField
          name="password"
          label="Password"
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
          value={signinDetails.password}
          onChange={(e) => handleOnChange({ ...signinDetails, password: e.target.value })}
        />
        <MessageError>{errors.password ? errors.password : null}</MessageError>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
