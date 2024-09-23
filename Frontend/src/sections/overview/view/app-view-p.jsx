import React from 'react';
import { Grid, Container, Typography, Paper, List, ListItem, ListItemText, Box } from '@mui/material';

import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import useAuthStore from '../../../store/auth';

export default function AppView() {
  const user = useAuthStore((state) => state.user);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#3f51b5' }}>
          Bonjour M.{user.username}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Étudiant"
            total={16}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic-etud.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Groups"
            total={4}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/g.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Sujet"
            total={4}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/sujet.png" />}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <AppWebsiteVisits
            title="L'engagement de l'équipe"
            subheader="2023/2024"
            chart={{
              labels: [
                '01/01/2024', '02/01/2024', '03/01/2024', '04/01/2024', '05/01/2024',
                '06/01/2024', '07/01/2024', '08/01/2024', '09/01/2024', '10/01/2024', '11/01/2024',
              ],
              series: [
                { name: 'Team 1', type: 'column', fill: 'solid', data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30] },
                { name: 'Team 2', type: 'area', fill: 'gradient', data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43] },
                { name: 'Team 3', type: 'line', fill: 'solid', data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39] },
              ],
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
  <Paper elevation={2} sx={{ p: 2, mt: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
    {/* Adding and centering the icon */}
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
      <img src="/assets/icons/glass/te.png" alt="icon" style={{ width: '100px', height: '100px' }} />
    </Box>
    
    <Typography variant="h6" sx={{ mb: 2, color: '#3f51b5', fontWeight: 'medium', textAlign: 'center' }}>Liste des Sujets</Typography>
    <List>
      <ListItem>
        <ListItemText primary="Team 1: Développer site web" primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Team 2: Système d'information" primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Team 3: Application mobile" primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
      </ListItem>
    </List>
  </Paper>
</Grid>


      
      </Grid>
    </Container>
  );
}
