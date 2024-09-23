import React, { useState, useCallback } from 'react';
import {
  Typography, Card, CardContent, CardMedia, Button, Container, Grid, IconButton,
  Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  FormControl, InputLabel, Select, OutlinedInput, Chip
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
// Import your image assets
import Image1 from "../../assets/LIN.png";
import BackgroundImage2024 from "../../assets/bg-image.png";
import BackgroundImageOld from "../../assets/bg-imageNoir.png";

// Define the styled component for the image
const CircleImage = styled(CardMedia)({
  height: 120,
  width: 120,
  borderRadius: '50%',
  position: 'absolute',
  top: -70,
  left: '50%',
  transform: 'translateX(-50%)',
  objectFit: 'cover',
  border: '4px solid white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const StyledCard = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  margin: 20px 10px;
  margin-top: 80px;
  overflow: visible;
  background-size: cover;
  background-position: center;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  animation: ${fadeIn} 0.5s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const MoreHorizIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM4 10C4 8.9 4.9 8 6 8C7.1 8 8 8.9 8 10C8 11.1 7.1 12 6 12C4.9 12 4 11.1 4 10ZM6 6C7.66 6 9 7.34 9 9C9 10.66 7.66 12 6 12C4.34 12 3 10.66 3 9C3 7.34 4.34 6 6 6ZM18 8C16.9 8 16 8.9 16 10C16 11.1 16.9 12 18 12C19.1 12 20 11.1 20 10C20 8.9 19.1 8 18 8ZM18 6C19.66 6 21 7.34 21 9C21 10.66 19.66 12 18 12C16.34 12 15 10.66 15 9C15 7.34 16.34 6 18 6Z" fill="currentColor"/>
</svg>
);

const Groupes = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event, group) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleBackToHome = () => {
    navigate('/Espace-Etudiant/home');
  };

  const handleDetailsClick = () => {
    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleInfoClick = () => {
    navigate('/Espace-Etudiant/KanbanBoard');
    handleClose();
  };

  const handleChange = (event) => {
    setSelectedStudents(event.target.value);
  };

  const subjects = {
    1: "Management",
    2: "Molecular Biology",
    3: "Genie Reseaux",
    4: "Genie informatique",
    5: "Genie mechaniques",
  };

  const professors = {
    1: "Dr. Yassine Abdellaoui",
    2: "Dr. Hicham Lehsou",
    3: "Dr. Said Aoussar",
    4: "Dr. Soukaina Sbai",
    5: "Dr. Richard Roe"
  };

  const students = {
    1: ["Alice", "Bob", "Charlie"],
    2: ["David", "Eva", "Fiona"],
    3: ["George", "Hannah", "Ian"],
    4: ["Jack", "Karen", "Leo"],
    5: ["Mia", "Noah", "Olivia"]
  };

  const studentGroups2024 = [
    { id: 1, photo: Image1, name: "Groupe 1", detail: "Computer Science", subjectId: 1, profId: 1 },
    { id: 2, photo: Image1, name: "Groupe 2", detail: "Biology", subjectId: 2, profId: 2 },
    { id: 3, photo: Image1, name: "Groupe 3", detail: "Network Engineering", subjectId: 3, profId: 3 }
  ];

  const studentGroupsLastYears = [
    { id: 4, photo: Image1, name: "Groupe 4", detail: "History", subjectId: 4, profId: 4 },
    { id: 5, photo: Image1, name: "Groupe 5", detail: "English Literature", subjectId: 5, profId: 5 }
  ];

  const renderStudentCard = useCallback((student, backgroundImage) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
      <Button variant="contained" onClick={handleBackToHome} sx={{ position: 'absolute', top: 20, left: 20 }}>
          Go Back to Home
        </Button>
      <StyledCard style={{ backgroundImage: `url(${backgroundImage})` }}>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={(e) => handleClick(e, student)}
          style={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '20ch',
            },
          }}
        >
          <MenuItem onClick={handleDetailsClick}>View Details</MenuItem>
        </Menu>
        <CircleImage
          component="img"
          image={student.photo}
          alt={`${student.name} photo`}
        />
        <CardContent style={{ textAlign: 'center', width: '100%' }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {student.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {student.detail}
          </Typography>
          <Button size="large" variant="contained" style={{ color: 'white', backgroundColor: '#035684', marginTop: '10px' }} onClick={handleInfoClick}>
            Infos
          </Button>
        </CardContent>
      </StyledCard>
    </Grid>
  ), [anchorEl, handleClick, handleClose, handleDetailsClick, handleInfoClick, open]);

  return (
    <Container sx={{ color: 'black', py: 4, borderRadius: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Groups
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {studentGroups2024.map(student => renderStudentCard(student, BackgroundImage2024))}
      </Grid>
      <Typography variant="h6" style={{ color: '#0273B1', margin: '20px 0', textAlign: 'center', fontWeight: 'bold' }}>
        Groups of Last Years
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {studentGroupsLastYears.map(student => renderStudentCard(student, BackgroundImageOld))}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Group Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Name: {selectedGroup ? selectedGroup.name : 'No group selected'}
            <br />
            Subject: {selectedGroup ? subjects[selectedGroup.subjectId] : 'No subject'}
            <br />
            Professor: {selectedGroup ? professors[selectedGroup.profId] : 'No professor'}
            <br />
            Etudiants:
            <br />
            <FormControl sx={{ m: 2, width: 400 }}>
              <InputLabel id="demo-multiple-chip-label">Etudiants</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                multiple
                value={selectedStudents}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <div>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                )}
              >
                {students[selectedGroup ? selectedGroup.id : 1].map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Add
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Groupes;
