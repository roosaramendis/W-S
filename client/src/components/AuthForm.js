import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendOtpToEmail, verifyOtp, loginUser, signupUser } from '../reducers/userReducer';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { TextInput } from './FormikMuiFields';
import { notify } from '../reducers/notificationReducer';
import AlertMessage from './AlertMessage';
import getErrorMsg from '../utils/getErrorMsg';

import {
  Button,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Input,
  input,
  TextField,
} from '@material-ui/core';
import { useAuthStyles } from '../styles/muiStyles';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';

const validationSchemaSignup = yup.object({
  username: yup
    .string()
    .required('Required')
    .max(20, 'Must be at most 20 characters')
    .min(3, 'Must be at least 3 characters')
    .matches(
      /^[a-zA-Z0-9-_]*$/,
      'Only alphanumeric characters allowed, no spaces/symbols'
    ),
  email: yup
  .string()
  .email('Invalid email')
  .required('Required')
  .matches(/^[a-zA-Z0-9._%+-]+@my\.sliit\.lk$/, 'Email must be in the format @my.sliit.lk'),

  password: yup
    .string()
    .required('Required')
    .min(6, 'Must be at least 6 characters'),
});

const validationSchemaLogin = yup.object({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().required('Required'),
});

const AuthForm = () => {
  const dispatch = useDispatch();
  const [authType, setAuthType] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const classes = useAuthStyles(authType)();
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState("");




  const handleSendOtp = async (email) => {
    console.log("send otp func called");
    try {
      await dispatch(sendOtpToEmail(email));
      setOtpSent(true);
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    try {
      // Use the email from the state instead of from the form event
      console.log("email from input");
      console.log(email);
      
      const isOtpValid = await dispatch(verifyOtp(email, otp));
      console.log("is otp valid");
      console.log(isOtpValid);
      if (isOtpValid) {
        setOtpVerified(true);
        console.log("email veryfierd")
        dispatch(notify("Email verifierd sucssesfully"))
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("Failed to verify OTP", error);
    }
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      await dispatch(loginUser(values));
      const usernameFromEmail = values.email.split('@')[0];
      dispatch(
        notify(`Welcome, ${usernameFromEmail}. You're logged in!`, 'success')
      );
    } catch (err) {
      setSubmitting(false);
      setError(getErrorMsg(err));
    }
  };

  const handleSignup = async (values, { setSubmitting }) => {

    

    if (otpVerified){
      try {
        setSubmitting(true);
        await dispatch(signupUser(values));
        dispatch(
          notify(
            `Welcome, ${values.username}. You've been successfully registered.`,
            'success'
          )
        );
      } catch (err) {
        setSubmitting(false);
        setError(getErrorMsg(err));
      }
  }
  else{
    alert("Plz verify email before signup");
  }
  };

  return (
    <div>
      <div className={classes.authWrapper}>
        <Formik
          validateOnChange={true}
          initialValues={{ username: '', email: '', password: '' }}
          onSubmit={authType === 'login' ? handleLogin : handleSignup}
          validationSchema={
            authType === 'login'
              ? validationSchemaLogin
              : validationSchemaSignup
          }
        >
          {({ isSubmitting, values }) => (
            <>
              <Form className={classes.form}>
                <Typography
                  variant="h5"
                  color="secondary"
                  className={classes.formTitle}
                >
                  {authType === 'login'
                    ? 'Login to your account'
                    : 'Create a new account'}
                </Typography>

                {authType === 'signup' && (
                  <div className={classes.input}>
                    <PersonIcon className={classes.inputIcon} color="primary" />
                    <TextInput
                      name="username"
                      type="text"
                      placeholder="Enter username"
                      label="Username"
                      required
                      fullWidth
                    />
                  </div>
                )}

                

                <div className={classes.input}>
                  <PersonIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="email"
                    type="email"
                    placeholder="Enter SLIIT Email"
                    label="Email"
                    value={values.email}
                    required
                    fullWidth
                  />
                  {authType === 'signup' && (
                  <Button
                  type="button" 
                  onClick={() => {
                    setEmail(values.email);
                    handleSendOtp(values.email);  // Send OTP using Formik's values.email
                  }}
                  disabled={!values.email || otpSent} 
                  color="primary"
                  variant="contained"
                  className={classes.submitButton}
                  style={{ marginLeft: '10px' }}
                >
                  {otpSent ? 'Email Sent' : 'Verify Email'}
                </Button>
                )}
                </div>    

                {/* OTP input and verify button appear only if OTP has been sent and on signup */}
                {otpSent && authType === 'signup' && (
                  <div className={classes.input}>
                    
                    <TextField
                      label="Enter OTP"
                      //variant="outlined"
                      fullWidth
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <Button type="button" 
                    onClick={handleVerifyOtp} 
                    color="primary"
                    variant="contained"
                    className={classes.submitButton}
                    >
                      Verify OTP
                    </Button>
                  </div>
                )}
                <div className={classes.input}>
                  <LockIcon className={classes.inputIcon} color="primary" />
                  <TextInput
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter password"
                    label="Password"
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPass((prevState) => !prevState)
                            }
                          >
                            {showPass ? (
                              <VisibilityOffIcon color="primary" />
                            ) : (
                              <VisibilityIcon color="primary" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  size="large"
                  startIcon={
                    authType === 'login' ? <ExitToAppIcon /> : <PersonAddIcon />
                  }
                  className={classes.submitButton}
                  disabled={isSubmitting || (!otpVerified && authType !== 'login')}
                >
                  {authType === 'login'
                    ? isSubmitting
                      ? 'Logging In'
                      : 'Login'
                    : isSubmitting
                    ? 'Signing Up'
                    : 'Sign Up'}
                </Button>
              </Form>
              <Divider
                orientation="vertical"
                flexItem
                className={classes.divider}
              />
              <div className={classes.sidePanel}>
                <Typography
                  variant="h6"
                  className={classes.switchText}
                  color="primary"
                >
                  {authType === 'login'
                    ? `Don't have an account?`
                    : 'Already have an account?'}
                </Typography>
                <Button
                  onClick={() =>
                    authType === 'login'
                      ? setAuthType('signup')
                      : setAuthType('login')
                  }
                  fullWidth
                  size="large"
                  color="primary"
                  variant="outlined"
                  startIcon={
                    authType === 'login' ? <PersonAddIcon /> : <ExitToAppIcon />
                  }
                  disabled={isSubmitting}
                >
                  {authType === 'login' ? 'Sign Up' : 'Login'}
                </Button>
              </div>
            </>
          )}
        </Formik>
      </div>
      <div>
        <AlertMessage
          error={error}
          severity="error"
          clearError={() => setError(null)}
        />
      </div>
    </div>
  );
};

export default AuthForm;
