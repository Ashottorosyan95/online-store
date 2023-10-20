import React, { useState } from 'react';
import axios from 'axios';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
    MDBIcon,
}
    from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/api';


const Signup = () => {
    const [signupDetails, setSignupDetails] = useState({
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
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (!signupDetails.email) {
            setErrors({
                ...errors,
                email: "Email address is required.",
            });
        } else if (!signupDetails.password) {
            setErrors({
                ...errors,
                password: "Password is required.",
            });
        } else {
            if (!errors.email && !errors.password) {
                const res = await register(signupDetails);
                if (res.status === 200) {
                    setSignupDetails({
                        username: '',
                        email: '',
                        phone: '',
                        password: '',
                    })
                    navigate('/signin')
                }
            }
        }
    };

    const handleOnChange = (data) => {
        setSignupDetails(data);
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        setErrors({
            ...errors,
            username: !data.username ? "Username is required." : data.username.length < 3 ? "Username min length 3." : "",
            email: !data.email ? "Email address is required." : !emailRegex.test(data.email) ? "Please enter a valid email address" : "",
            phone: !data.phone ? "Phone is required." : "",
            password: !data.password ? "Password is required." : !passwordRegex.test(data.password) ? "Minimum 8 characters, at least one letter and one number." : "",
        });
    }


    return (
        <div className='vh-100 d-flex justify-content-center align-items-center'>
            <MDBContainer fluid>
                <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
                    <MDBCardBody>
                        <MDBRow>
                            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                                <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                                <div className='mb-2'>
                                    <div className="d-flex flex-row align-items-center">
                                        <MDBIcon fas icon="user me-3" size='lg' />
                                        <MDBInput
                                            label='Your Name'
                                            id='form1'
                                            type='text'
                                            className='w-100'
                                            value={signupDetails.username}
                                            onChange={(e) => handleOnChange({ ...signupDetails, username: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-center">
                                        {errors.username ? <span className="text-danger" style={{ fontSize: '12px' }}>{errors.username}</span> : null}
                                    </p>
                                </div>

                                <div className="mb-2">
                                    <div className='d-flex flex-row align-items-center '>
                                        <MDBIcon fas icon="envelope me-3" size='lg' />
                                        <MDBInput
                                            label='Your Email'
                                            id='form2'
                                            type='email'
                                            value={signupDetails.email}
                                            onChange={(e) => handleOnChange({ ...signupDetails, email: e.target.value })}
                                        />

                                    </div>
                                    <p className="text-center">
                                        {errors.email ? <span className="text-danger" style={{ fontSize: '12px' }}>{errors.email}</span> : null}
                                    </p>
                                </div>

                                <div className="mb-2">
                                    <div className='d-flex flex-row align-items-center'>
                                        <MDBIcon fas icon="phone me-3" size='lg' />
                                        <MDBInput
                                            label='Your phone'
                                            id='form4'
                                            type='phone'
                                            value={signupDetails.phone}
                                            onChange={(e) => handleOnChange({ ...signupDetails, phone: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-center">
                                        {errors.phone ? <span className="text-danger" style={{ fontSize: '12px' }}>{errors.phone}</span> : null}
                                    </p>
                                </div>

                                <div className="mb-2">
                                    <div className='d-flex flex-row align-items-center'>
                                        <MDBIcon fas icon="lock me-3" size='lg' />
                                        <MDBInput
                                            label='Password'
                                            id='form3'
                                            type='password'
                                            value={signupDetails.password}
                                            onChange={(e) => handleOnChange({ ...signupDetails, password: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-center">
                                        {errors.password ? <span className="text-danger" style={{ fontSize: '12px' }}>{errors.password}</span> : null}
                                    </p>
                                </div>

                                <MDBBtn className='mb-4' size='lg' onClick={handleSignUp}>Register</MDBBtn>

                                <div className="d-flex flex-row align-items-center mb-4">
                                    <p>If you have account <a href="/signin">Login</a></p>
                                </div>

                            </MDBCol>

                            <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                                <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
                            </MDBCol>

                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </div>
    )
}

export default Signup;
