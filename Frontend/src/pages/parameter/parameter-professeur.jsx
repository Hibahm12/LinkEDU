import React, { useState } from 'react';
import { Button, TextField, Avatar, Typography, Container, Grid, Box } from '@mui/material';

export default function Parameters() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [image, setImage] = useState('/default-profile.png'); // Chemin d'accès à l'image par défaut
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== repeatNewPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    // Logique de mise à jour du mot de passe et de l'image
    alert('Les données ont été mises à jour !');
  };

  const handleCancel = () => {
    // Logique d'annulation, peut-être réinitialiser les états ou naviguer ailleurs
    alert('Mise à jour annulée.');
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
        Paramètres de l'utilisateur
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Avatar src={image} sx={{ width: 90, height: 90, mb: 2 }} />
          <Button variant="contained" component="label">
            Changer l'image
            <input type="file" hidden onChange={handleImageChange} accept="image/*" />
          </Button>
        </Grid>
        <Grid item xs={12} md={8}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Mot de passe actuel"
              type="password"
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nouveau mot de passe"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Répéter le nouveau mot de passe"
              type="password"
              variant="outlined"
              value={repeatNewPassword}
              onChange={(e) => setRepeatNewPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mb: 2 }}>
              Mettre à jour
            </Button>
            <Button fullWidth variant="outlined" color="secondary" onClick={handleCancel}>
              Annuler
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}
