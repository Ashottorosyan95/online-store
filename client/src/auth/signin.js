import React, { useState } from 'react';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';

const Signin = () => {
    const [signinDetails, setSigninDetails] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleOnChange = (data) => {
        setSigninDetails(data);
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        setErrors({
            ...errors,
            email: !data.email ? "Email address is required." : !emailRegex.test(data.email) ? "Please enter a valid email address" : "",
            password: !data.password ? "Password is required." : !passwordRegex.test(data.password) ? "Minimum eight characters, at least one letter and one number." : "",
        });
    }

    const handleSignIn = async () => {
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
        } else {
            if (!errors.email && !errors.password) {
                const res = await login(signinDetails);
                console.log('dddddddddddddd', res);
                // if (data.createUser.statusCode === 200) {
                //     setSigninDetails({
                //         email: '',
                //         password: '',
                //     });
                //     navigate('/signin')
                // }
            }
        }
    };


    return (
        <div className='vh-100 d-flex justify-content-center align-items-center'>
            <MDBContainer fluid>
                <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
                    <MDBCardBody>
                        <MDBRow>
                            <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                                <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign in</p>

                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="envelope me-3" size='lg' />
                                    <MDBInput
                                        label='Your Email'
                                        id='form2'
                                        type='email'
                                        value={signinDetails.email}
                                        onChange={(e) => handleOnChange({ ...signinDetails, email: e.target.value })}
                                    />
                                </div>

                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="lock me-3" size='lg' />
                                    <MDBInput
                                        label='Password'
                                        id='form3'
                                        type='password'
                                        value={signinDetails.password}
                                        onChange={(e) => handleOnChange({ ...signinDetails, password: e.target.value })}
                                    />
                                </div>

                                <MDBBtn className='mb-4' size='lg' onClick={handleSignIn}>Login</MDBBtn>

                                <div className="d-flex flex-row align-items-center mb-4">
                                    <p>Dont have an account <a href="/signup">Register</a></p>
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

export default Signin;
