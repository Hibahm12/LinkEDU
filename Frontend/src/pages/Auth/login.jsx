import { Visibility,VisibilityOff } from '@mui/icons-material';
import {
  Box,Button,CircularProgress,Container,CssBaseline,IconButton,InputAdornment,
  Snackbar,TextField,Typography
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import React,{ useEffect,useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';

const backgroundUrl = `/assets/background/image1.png`;

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

const Alert = React.forwardRef(function Alert(props,ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const [credentials,setCredentials] = useState({ email: '',password: '' });
  const [open,setOpen] = useState(false);
  const [loading,setLoading] = useState(false);
  const [alert,setAlert] = useState({ severity: 'info',message: '' });
  const [showPassword,setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const setGroup = useAuthStore((state) => state.setGroup);

  useEffect(() => {
    emailRef.current.focus();
  },[]);

  const handleChange = (event) => {
    setCredentials({ ...credentials,[event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login',credentials);
      console.log("login response",response);
      const { token,user } = response.data.data;
      const authUser = { token,...user };
      handleLoginSuccess(authUser);
    } catch (error) {
      console.error('Login failed:',error);
      setAlert({ severity: 'error',message: error.response?.data?.message || 'Login failed. Please check your credentials and try again.' });
      setOpen(true);
      setLoading(false);
    }
  };
  // Function to fetch group membership status for a student
  const fetchMembershipStatus = async (userId) => {
    try {
      const token = sessionStorage.getItem('token'); // Retrieve token once at the beginning
      const response = await axios.get(`http://127.0.0.1:8000/api/groupe-membres/student/${userId}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Return both status and data to handle redirection logic based on status code
      return { status: response.status,data: response.data };
    } catch (error) {
      console.error('Failed to fetch membership status:',error);
      throw error; // Rethrow to handle it in the calling function
    }
  };

  // Function to handle login success
  const handleLoginSuccess = async (user) => {
    login(user); // Assuming login() is defined elsewhere

    sessionStorage.setItem('token',user.token); // Save the token

    let redirectPath = '/'; // Default redirect path if none of the roles match

    if (user.role === 'admin') {
      redirectPath = '/Admin';
    } else if (user.role === 'professeur') {
      redirectPath = '/Espace-Professeur';
    } else if (user.role === 'etudiant') {
      try {
        const membership = await fetchMembershipStatus(user.id);
        console.log('s',membership.status);
        // Check the HTTP status code
        if (membership.status === 200) {
          console.log('groupid : ',membership.data.data.groupe_id);
          setGroup(membership.data.data.groupe_id);
          // Use the inGroup property to determine final path
          redirectPath = '/Espace-Etudiant';

        } else {
          // Fallback path if the status code is not 200
          redirectPath = '/Espace-Etudiant/Home';
        }
      } catch (error) {
        console.error('Error checking group membership:',error);
        // Default to Home if the request fails
        redirectPath = '/Espace-Etudiant/Home';
      }
    }

    navigate(redirectPath); // Assuming navigate() is defined elsewhere
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = (event,reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: `url(${backgroundUrl}) no-repeat center center fixed`,
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)',padding: '20px',borderRadius: '8px' }}
        >
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold',textAlign: 'center' }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              inputRef={emailRef}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box textAlign="center" sx={{ my: 2 }}>
              <Button onClick={() => navigate('/forgot-password')} sx={{ cursor: 'pointer',textTransform: 'none' }}>
                Forgot Password?
              </Button>
            </Box>
            <Button type="submit" fullWidth variant="contained" sx={{ marginTop: '24px' }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Log In'}
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

export default Login;