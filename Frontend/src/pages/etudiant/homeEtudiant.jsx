import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import LogoImage from '../../assets/LINKEDU.png'; // Replace with your logo path
import GroupSection from './GroupSection';
import TwoCardsSection from './TwoCardsSection';
import useAuthStore from '../../store/auth'; // adjust the import path accordingly
import HeroImage from '../../assets/home-img.png';  // Replace with your image path

const StyledButton = styled(Button)({
  marginRight: '16px',
  '&:hover': {
    backgroundColor: '#02679E',
  },
});

const exps = [
  {
    label: 'Students',
    value: '10K+',
  },
  {
    label: 'Projects',
    value: '100+',
  },
  {
    label: 'Experience Profs',
    value: '10+',
  },
];

const ExpItem = ({ item }) => {
  const { value, label } = item;
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 0 } }}>
      <Typography
        sx={{
          color: '#5091B8',
          mb: { xs: 1, md: 2 },
          fontSize: { xs: 34, md: 44 },
          fontWeight: 'bold',
        }}
      >
        {value}
      </Typography>
      <Typography color="#323131" variant="h5">
        {label}
      </Typography>
    </Box>
  );
};

const HomeEtudiant = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/Espace-Etudiant/home') {
      console.log('Refreshing data for HomeEtudiant because navigated back to home.');
      const fetchData = async () => {
        console.log('Data fetching or refreshing logic executed.');
      };
      fetchData();
    }
  }, [location.pathname]);

  const { user, isAuthenticated } = useAuthStore();


  return (
    <>
      <Box id="home" sx={{ backgroundColor: 'background.paper', position: 'relative', pt: 4, pb: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ width: { xs: '120px', md: '120px' }, height: '60px' }}>
              <img src={LogoImage} alt="Logo" style={{ width: '100%', height: 'auto' }} />
            </Box>
          
          </Box>
          <Grid container spacing={0} sx={{ flexDirection: { xs: 'column', md: 'unset' } }}>
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: { xs: 40, md: 72 },
                      letterSpacing: 1.5,
                      fontWeight: 'bold',
                      lineHeight: 1.3,
                      color: 'primary.main',
                    }}
                  >
                    Welcome&nbsp;
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: { xs: 40, md: 72 },
                      letterSpacing: 1.5,
                      fontWeight: 'bold',
                      lineHeight: 1.3,
                      color: '#2E2E2E',
                    }}
                  >
                    {user.username}
                  </Typography>
                </Box>
                <Box sx={{ mb: 4, width: { xs: '100%', md: '70%' } }}>
                  <Typography sx={{ color: '#323131', lineHeight: 1.6 }}>
                    Join us and start your PFA/PFE with the best team and best Profs
                  </Typography>
                </Box>
                <Box sx={{ '& button': { mr: 2 } }}>
                  <ScrollLink to="stageType" spy smooth offset={-70} duration={500}>
                    <StyledButton color="primary" size="large" variant="contained">
                      Get Started
                    </StyledButton>
                  </ScrollLink>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5} sx={{ position: 'relative' }}>
              <Box sx={{ lineHeight: 0 }}>
                <img src={HeroImage} alt="Hero img" style={{ width: '100%', height: 'auto' }} />
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ boxShadow: 2, py: 4, px: 7, borderRadius: 4, mt: 4 }}>
            <Grid container spacing={2}>
              {exps.map((item) => (
                <Grid key={item.value} item xs={12} md={4}>
                  <ExpItem item={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      <TwoCardsSection />
      <GroupSection />
      <Box
        component="footer"
        sx={{
          backgroundColor: 'primary.main',
          py: 3,
          color: 'primary.contrastText',
          width: '100%',
          textAlign: 'center',
        }}
      />
    </>
  );
};

export default HomeEtudiant;
