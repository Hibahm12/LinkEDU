import { faker } from '@faker-js/faker';

import Grid from '@mui/material/Unstable_Grid2'; // Moved up to be alphabetically sorted

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import useAuthStore from '../../../store/auth';

// ----------------------------------------------------------------------

export default function AppView() {
  const user = useAuthStore((state) => state.user);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Welcome {user.username}
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={30}>
          <AppWidgetSummary
            titles="Votre sujet  : Data Science and Machine Learning"
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/s.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="l'engagement de l'équipe"
            subheader="2023/2024"
            chart={{
              labels: [
                '01/01/2024',
                '02/01/2024',
                '03/01/2024',
                '04/01/2024',
                '05/01/2024',
                '06/01/2024',
                '07/01/2024',
                '08/01/2024',
                '09/01/2024',
                '10/01/2024',
                '11/01/2024',
              ],
              series: [
                {
                  name: 'Yassine',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Soukaina',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Said',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
                {
                  name: 'Hicham',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 65, 36, 40, 45, 35, 24, 52, 59, 36, 39],
                },
                {
                  name: 'Fadwa',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 65, 36, 40, 45, 15, 24, 52, 59, 61, 39],
                },
                {
                  name: 'Sa3ida charaf',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 15, 16, 10, 15, 15, 24, 52, 59, 61, 39],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Task"
            chart={{
              series: [
                { label: 'Front-end', value: 4344 },
                { label: 'back-end', value: 5435 },
                { label: 'Les Maquettes', value: 1443 },
                { label: 'conception', value: 4443 },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}