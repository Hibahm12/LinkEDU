import { Button, Container, Snackbar, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');  // Assuming token is passed as a URL query parameter

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState({
        severity: 'info',
        message: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== passwordConfirm) {
            setAlert({
                severity: 'error',
                message: 'Passwords do not match.'
            });
            setOpen(true);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/password/reset', {
                email,
                token,
                password,
                password_confirmation: passwordConfirm
            });
            setAlert({
                severity: 'success',
                message: 'Password reset successful.'
            });
            setOpen(true);
            navigate('/login');  // Navigate to login page after successful password reset
        } catch (error) {
            setAlert({
                severity: 'error',
                message: error.response?.data?.message || 'Failed to reset password'
            });
            setOpen(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5" style={{ marginTop: '20px' }}>
                Reset Your Password
            </Typography>
            <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ margin: '24px 0 16px' }}
                >
                    Reset Password
                </Button>
            </form>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert.severity}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ResetPassword;
