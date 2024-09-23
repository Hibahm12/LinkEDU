// src/components/StageTypeCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const StyledButton = styled(Button)({
  marginRight: '16px',
  '&:hover': {
    backgroundColor: '#02679E',
  },
});

// eslint-disable-next-line react/prop-types
const StageTypeCard = ({ title, description, image, pageUrl }) => {
  const navigate = useNavigate();

  const handleChoose = () => {
    navigate(pageUrl); // Using the navigate function to go to pageUrl
  };

  return (
    <Box
      sx={{
        px: 1.5,
        py: 5,
        maxWidth: 550,
        flexGrow: 1,
        flexBasis: 'calc(50% - 16px)',
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: 4,
          boxShadow: 2,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 3,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            lineHeight: 0,
            overflow: 'hidden',
            borderRadius: 3,
            height: 200,
            marginBottom: 2,
          }}
        >
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
        <Typography variant="h4" sx={{ fontSize: '1.4rem', marginBottom: 1, color: '#323131' }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2, color: '#323131' }}>
          {description}
        </Typography>
        <StyledButton variant="contained" color="primary" onClick={handleChoose}>
          Choose
        </StyledButton>
      </Box>
    </Box>
  );
};

export default StageTypeCard;
