// src/components/TwoCardsSection.js
import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import StageTypeCard from './StageTypeCard'; // Assuming this is the correct import path

// Sample images (replace with your actual paths)
import Image1 from '../../assets/extern-stage.png';
import Image2 from '../../assets/extern-stage.png';

const stages = [
  {
    title: 'Intern Internship',
    description: 'If you didnt find an internship then choose this type to start your internship with ENSET university.',
    image: Image1,
    pageUrl: '/intern' // Assuming this is the path you have defined in your Router for the intern page
  },
  {
    title: 'Extern Internship',
    description: 'If you already find an internship then choose this type to meet our best profs for the best orientation.',
    image: Image2,
    pageUrl: '/extern' // Assuming this is the path you have defined in your Router for the extern page
  },
];

const TwoCardsSection = () => (
  <Container id="stageType" maxWidth="lg" sx={{ marginTop: 4 }}>
    <Typography variant="h3" sx={{ fontSize: 3, marginBottom: 4, color:"#323131" }}>
      Choose the type of your internship.
    </Typography>
    <Grid container spacing={2}>
      {stages.map((stage, index) => (
        <Grid key={index} item xs={12} md={6}>
          <StageTypeCard {...stage} />
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default TwoCardsSection;
