import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import GroupCard from './GroupCard'; // Ensure this is the correct import path

// Sample image (replace with your actual path)
import Image1 from '../../assets/group.png';

const stage = {
  title: 'The Groups',
  description: 'Here where you can see the whole groupes',
  image: Image1,
  pageUrl: '/Groups' // Ensure this is the correct path defined in your Router
};

const GroupSection = () => (
  <Container id="stageType" maxWidth="lg" sx={{ marginTop: 5 }}>
    <Typography variant="h3" sx={{ fontSize: 3, marginBottom: -2, color: "#323131" }}>
      See the Groups.
    </Typography>
    <Grid container spacing={2} justifyContent="left">
      <Grid item xs={12} md={6}>
        <GroupCard {...stage} />
      </Grid>
    </Grid>
  </Container>
);

export default GroupSection;
