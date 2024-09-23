import { Box, Button, Container, Grid, Paper, Snackbar, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useState } from 'react';

import Logo from '../../assets/LINKEDU.png'; // Ensure the path is correct
import useAuthStore from '../../store/auth'; // Import Zustand store

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  background: 'linear-gradient(to bottom, #2b9fd8, #97cef1)',
  color: theme.palette.common.white,
  textAlign: 'center',
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ExternStage = () => {
  const { user } = useAuthStore(); // Access user details from Zustand store
  const [form, setForm] = useState({
    nom_entreprise: '',          // Changed from nomEntreprise
    adresse_entreprise: '',      // Changed from adresseEntreprise
    titre_sujet: '',             // Changed from sujet
    date_debut: '',              // Changed from debutStage
    date_fin: '',                // Changed from finStage
    description: '',
    etudiantId: user?.etudiant?.id
     // Access nested student ID
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/sujetsexterns', form, {
        headers: {
          // Assuming you use bearer token for authorization
          Authorization: `Bearer ${user?.token}`
        }
      });
      setSnackbarMessage('Stage submitted successfully!');
      setOpenSnackbar(true);
      // Optionally reset form here or handle further logic
    } catch (error) {
      setSnackbarMessage('Failed to submit stage: ' + error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container maxWidth="lg" sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Box mt={7} display="flex" justifyContent="center">
          <img 
            src={Logo} 
            alt="Logo" 
            onClick={() => console.log('Logo clicked')}
            tabIndex={0} 
            role="button"
            style={{ cursor: 'pointer', width: '150px', height: 'auto', marginTop:'-70px' }}
          />
        </Box>
        <Grid container spacing={2} sx={{ mt: 0.5, alignItems: 'center', justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={8}>
            <StyledPaper elevation={6}>
              <Typography variant="h4" gutterBottom>
                Stage Extern
              </Typography>
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  { /* Each TextField updated with value from state */ }
                  <TextField name="nom_entreprise" onChange={handleChange} fullWidth label="Nom de l'Entreprise" variant="outlined" InputProps={{ style: { color: 'white' }}} InputLabelProps={{ style: { color: 'white' }}} value={form.nomEntreprise} />
                  <TextField name="adresse_entreprise" onChange={handleChange} fullWidth label="Adresse de l'entreprise" variant="outlined" InputProps={{ style: { color: 'white' }}} InputLabelProps={{ style: { color: 'white' }}} value={form.adresseEntreprise} />
                  <TextField name="titre_sujet" onChange={handleChange} fullWidth label="Sujet" variant="outlined" InputProps={{ style: { color: 'white' }}} InputLabelProps={{ style: { color: 'white' }}} value={form.sujet} />
                  <TextField  name="date_debut" onChange={handleChange} fullWidth label="Début de stage" variant="outlined" type="date" InputLabelProps={{ shrink: true, style: { color: 'white' }}} InputProps={{ style: { color: 'white' }}} value={form.debutStage} />
                  <TextField name="date_fin" onChange={handleChange} fullWidth label="Fin de Stage" variant="outlined" type="date" InputLabelProps={{ shrink: true, style: { color: 'white' }}} InputProps={{ style: { color: 'white' }}} value={form.finStage} />
                  <TextField name="description"onChange={handleChange} fullWidth label="Sujet de votre Stage" variant="outlined" multiline rows={4} InputProps={{ style: { color: 'white' }}} InputLabelProps={{ style: { color: 'white' }}} value={form.description} />
                  <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
                    Envoyer
                  </Button>
                </Grid>
              </form>
            </StyledPaper>
          </Grid>
        </Grid>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ExternStage;
