import axios from 'axios';
import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import useAuthStore from '../../../store/auth'; 

import AppWidgetSummary from '../app-widget-summary';

// Sample image array for demonstration
const images = [
  "/assets/background/2.png",
  "/assets/background/3.png",
  "/assets/background/4.png",
  "/assets/background/5.png",

];

export default function AppView() {
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({ total_professeurs: 0, total_etudiants: 0, total_Sujet: 0 });
  const imagesPerPage = 1;
  const pageCount = Math.ceil(images.length / imagesPerPage);
  const intervalTime = 5000; // Time in milliseconds for auto-scroll (e.g., 3000ms = 3 seconds)
  const user = useAuthStore((state) => state.user);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    // Fetch statistics from the API
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/statistics/total');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    fetchStats();

    const interval = setInterval(() => {
      setPage((prevPage) => (prevPage % pageCount) + 1);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [pageCount]);

  // Calculate the indices of the images to display
  const startIndex = (page - 1) * imagesPerPage;
  const selectedImages = images.slice(startIndex, startIndex + imagesPerPage);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        University {user.username}
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="etudiante"
            total={stats.total_etudiants}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic-etud.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="professeur"
            total={stats.total_professeurs}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic-prof.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Sujet"
            total={stats.total_Sujet}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/sujet.png" />}
          />
        </Grid>
      </Grid>

      {/* New Grid for Dynamic Pagination of Photos */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {selectedImages.map((src, index) => (
          <Grid key={index} xs={12} item>
            <img src={src} alt={`Decorative background ${startIndex + index + 1}`} style={{ width: '100%' }} />
          </Grid>
        ))}
        <Pagination count={pageCount} page={page} onChange={handlePageChange} sx={{ mt: 2, justifyContent: 'center', width: '100%' }} />
      </Grid>
    </Container>
  );
}
