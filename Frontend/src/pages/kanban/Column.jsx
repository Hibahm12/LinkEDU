import React,{ useState } from 'react';
import { Droppable,Draggable } from 'react-beautiful-dnd';
import { Paper,Typography,Button,TextField,Select,MenuItem,FormControl,InputLabel } from '@mui/material';
import Task from './Task';

const Column = ({ columnId,title,tasks,onAddTask,onDeleteTask,members }) => {
  const [newTaskName,setNewTaskName] = useState('');
  const [SelectedMember,setSelectedMember] = useState();

  const handleAddTask = () => {
    if (newTaskName.trim() === '') return;
    onAddTask(columnId,newTaskName,SelectedMember);
    setNewTaskName('');
  };
  return (
    <Paper sx={{ backgroundColor: 'grey.300' }}>
      <Typography variant="h6">{title}</Typography>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task,index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task task={task} onDeleteTask={onDeleteTask} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <TextField
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        label="New Task"
        fullWidth
        margin="normal"
        size="small"
        sx={{ mb: 1 }}
      />
      <FormControl fullWidth size="small" sx={{ mb: 1 }}>
        <InputLabel id="demo-simple-select-label">Asign to</InputLabel>
        <Select
          label="Asign to"
          onChange={(e) => setSelectedMember(e.target.value)}
        >

          {
            members && members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.nom} {member.prenom}
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <Button onClick={handleAddTask} variant="contained" color="primary" fullWidth size="small">
        Add Task
      </Button>
    </Paper>
  );
};

export default Column;
