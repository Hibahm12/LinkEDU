import React from 'react';
import { Paper,Typography,Card,CardContent } from '@mui/material';

const Task = ({ task,onDeleteTask }) => {
  return (
    <Card sx={{ m: 2 }} 
    
    >
      <CardContent> 
        <Typography variant="body1">{task.nom}</Typography>
        <Typography ypography variant="body2" color="text.secondary">{task.etudiant?.nom} {task.etudiant?.prenom}</Typography>
      </CardContent>
    </Card>
  );
};

export default Task;
