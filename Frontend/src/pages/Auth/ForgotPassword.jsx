import React,{ useState,useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CssBaseline from "@mui/material/CssBaseline";
import {
    Box,
    Button,
    Container,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { Visibility,VisibilityOff } from '@mui/icons-material';

const backgroundUrl = `public/assets/background/image1.png`;

const theme = createTheme({
    palette: {
        primary: { main: '#304ffe' },
        background: { default: '#f4f6f8' },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: { marginBottom: '16px' },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { padding: '10px 0',fontSize: '16px' },
            },
        },
    },
});

const Alert = React.forwardRef((props,ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ForgotPassword = () => {
    const [email,setEmail] = useState('');
    const [open,setOpen] = useState(false);
    const [alert,setAlert] = useState({
        severity: 'info',
        message: ''
    });

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/password/forgot',{ email });
            setAlert({
                severity: 'success',
                message: response.data.message
            });
            setOpen(true);
        } catch (error) {
            setAlert({
                severity: 'error',
                message: error.response?.data?.message || 'Failed to send reset email'
            });
            setOpen(true);
        }
    };

    const handleClose = (event,reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleBackToLogin = () => {
        navigate('/');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                minHeight: '100vh',
                background: `url(${backgroundUrl}) no-repeat center center fixed`,
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Container component="main" maxWidth="xs" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)',padding: '20px',borderRadius: '8px' }}>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold',textAlign: 'center' }}>Forgot Password</Typography>
                    <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            margin="normal"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ marginTop: '24px' }}>
                            Send Reset Link
                        </Button>
                        <Button
                            onClick={handleBackToLogin}
                            fullWidth
                            variant="text"
                            sx={{ marginTop: '8px' }}
                        >
                            Back to Login
                        </Button>
                    </form>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alert.severity}>
                            {alert.message}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default ForgotPassword;
