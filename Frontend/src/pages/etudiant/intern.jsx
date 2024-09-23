import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText,
  DialogTitle,
  Grid, Paper,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAuthStore from 'src/store/auth';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, cyan } from '@mui/material/colors';
import LogoImage from '../../assets/LINKEDU.png'; // Path to your logo image
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
      contrastText: '#fff',
    },
    secondary: {
      main: cyan[500],
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    button: {
      fontWeight: 'bold',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners for buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: 12, // Rounded corners for cards
        },
      },
    },
  },
});
const InternStage = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSujet, setSelectedSujet] = useState(null);
  const [sujets, setSujets] = useState([]);
  const [stageChosen, setStageChosen] = useState(false);
  const [message, setMessage] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const user = useAuthStore((state) => state.user);
  const sujetsPerPage = 4;

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/sujets')
      .then(response => {
        setSujets(response.data.sujets);
      })
      .catch(error => {
        console.error('Error fetching sujets:', error);
        setDialogMessage('Error fetching subjects from server.');
        setOpenDialog(true);
      });
  }, []);

  const totalPages = Math.ceil(sujets.length / sujetsPerPage);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));

  const handleSujetClick = sujet => {
    setSelectedSujet(sujet);
    setStageChosen(false);
  };

  const handleBack = () => {
    setSelectedSujet(null);
    setStageChosen(false);
  };

  const handleChoose = () => setStageChosen(true);

  const handleSend = () => {
    if (!user || !user.id) {
      setDialogMessage('User ID is invalid.');
      setOpenDialog(true);
      return;
    }
  
    console.log('Sending data with user ID:', user.id);
  
    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('message', message);
    formData.append('professeur_id', selectedSujet.professeur_id);
    formData.append('etudiant_id', user.etudiant.id);
    formData.append('sujet_id', selectedSujet.id);  // Make sure to retrieve the correct sujet ID here
    formData.append('sujet_nom', selectedSujet.nom);
    formData.append('sujet_description', selectedSujet.description);
  
    axios.post('http://127.0.0.1:8000/api/demandes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      setDialogMessage('Information has been sent successfully.');
      setMessage('');
      setCvFile(null);
      setCvFileName('');
      setTimeout(() => navigate('/Espace-Etudiant/Attender'), 2000);
    })
    .catch(error => {
      console.error("Failed to send data:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        setDialogMessage('Failed to send data: ' + (error.response.data.message || JSON.stringify(error.response.data)));
      } else {
        setDialogMessage('Failed to send data: ' + error.message);
      }
    })
    .finally(() => {
      setOpenDialog(true);
    });
  };
  const handleUpload = (event) => {
    const file = event.target.files[0];
    setCvFile(file);
    setCvFileName(file.name);
  };
  const handleBackToHome = () => {
    navigate('/Espace-Etudiant/home');
  };

  const renderSujetDetails = () => (
    <>
      <Typography variant="h6" sx={{ mb: 1, color: '#fff' }}>{selectedSujet?.nom}</Typography>
      <Typography sx={{ mb: 2, color: '#fff' }}>{selectedSujet?.description}</Typography>
      <Typography variant="h6" sx={{ mb: 3, color: '#fff' }}>{selectedSujet?.professeur?.nom}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={handleBack}>Back</Button>
        <Button variant="contained" sx={{ ml: 2 }} onClick={handleChoose}>Choose</Button>
      </Box>
    </>
  );

  const renderChosenSujetInterface = () => (
    <>
      <Typography variant="h6" sx={{ mb: 1, color: '#fff' }}>{selectedSujet?.nom}</Typography>
      <Typography sx={{ mb: 2, color: '#fff' }}>{selectedSujet?.description}</Typography>
      <Typography variant="h6" sx={{ mb: 3, color: '#fff' }}>{selectedSujet?.professeur?.nom}</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2, color: '#fff' }}
      />
      <Button variant="contained" component="label" fullWidth>
        Upload CV
        <input type="file" hidden onChange={handleUpload} />
      </Button>
      {cvFileName && <Typography sx={{ mt: 2 }}>{cvFileName}</Typography>}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" onClick={handleSend}>Send</Button>
        <Button variant="contained" onClick={handleBack} sx={{ ml: 2 }}>Back</Button>
      </Box>
    </>
  );

  const renderSujetSelection = () => (
    <>
      <Typography variant="h5" sx={{ mb: 2, color: '#fff', textAlign: 'center' }}>Stage Intern</Typography>
      <Grid container spacing={2} justifyContent="center">
        {sujets.slice(currentPage * sujetsPerPage, (currentPage + 1) * sujetsPerPage).map(sujet => (
          <Grid item xs={6} key={sujet.id}>
            <Paper elevation={3} sx={{ p: 1, background: '#EFF9FF', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Button fullWidth onClick={() => handleSujetClick(sujet)}>{sujet.nom}</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
    <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', marginTop: '-20px' }}>
      <Box sx={{ width: '100%', textAlign: 'center', position: 'absolute', top: 0, left :0, right: 0 }}>
        <img src={LogoImage} alt="Logo" style={{ width: '180px', height: 'auto', margin: '10px' }} />
      </Box>
      <Card sx={{
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      }}>
        {!selectedSujet ? renderSujetSelection() : (stageChosen ? renderChosenSujetInterface() : renderSujetDetails())}
        {!selectedSujet && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, width: '100%' }}>
            <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 0}>Prev</Button>
            <Button variant="contained" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</Button>
          </Box>
        )}
        <Button variant="contained" onClick={handleBackToHome} sx={{ position: 'absolute', top: 20, left: 20 }}>
          Go Back to Home
        </Button>
      </Card>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Notification"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          mt: 'auto',
          width: '100%',
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          position: 'absolute',
          bottom: 0, right: 0
        }}
      >
        © 2024 Linkedu. All rights reserved.
      </Box>
    </Container>
    </ThemeProvider>
  );
};

export default InternStage;