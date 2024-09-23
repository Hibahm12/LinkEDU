import React,{ useState,useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { CssBaseline, Grid } from '@mui/material';
import { getTasks, updateTask, createTask, deleteTask } from '../../api/tasks';
import { getMembersGroup } from '../../api/groupes';
import Column from './Column';
import './styles.css';

const KanbanBoard = ({ groupeId }) => {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await getTasks(groupeId);
      setTasks(response.data.tasks);
      console.log(response.data.tasks);
    };
    fetchTasks();

    const fetchMembersGroup = async () => {
      const response = await getMembersGroup(groupeId);
      setMembers(response.data.members);
      console.log(response.data.members);
    };
    fetchMembersGroup();

  }, [groupeId]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const sourceColumnTasks = tasks.filter(
      (task) => task.status === source.droppableId
    );
    const destinationColumnTasks = tasks.filter(
      (task) => task.status === destination.droppableId
    );

    let newSourceColumnTasks, newDestinationColumnTasks;

    if (source.droppableId === destination.droppableId) {
      newSourceColumnTasks = reorder(
        sourceColumnTasks,
        source.index,
        destination.index
      );
      newDestinationColumnTasks = newSourceColumnTasks;
    } else {
      newSourceColumnTasks = Array.from(sourceColumnTasks);
      newDestinationColumnTasks = Array.from(destinationColumnTasks);
      const [movedTask] = newSourceColumnTasks.splice(source.index, 1);
      movedTask.status = destination.droppableId;
      newDestinationColumnTasks.splice(destination.index, 0, movedTask);
    }

    const newTasks = tasks.map((task) => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId };
      } else if (task.status === source.droppableId) {
        return newSourceColumnTasks.find((t) => t.id === task.id) || task;
      } else if (task.status === destination.droppableId) {
        return newDestinationColumnTasks.find((t) => t.id === task.id) || task;
      }
      return task;
    });

    setTasks(newTasks);

    try {
      await updateTask(draggableId, {
        status: destination.droppableId,
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      // Optionally revert the state change to maintain consistency
      setTasks(tasks);
    }
  };

  const handleAddTask = async (status, newTaskName, assignTo) => {
    console.log(status, newTaskName);
    const newTask = { nom: newTaskName, status, groupe_id: groupeId, etudiant_id: assignTo };
    console.log("new task : ", newTask);
    try {
      const response = await createTask(groupeId, newTask);
      console.log(response);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const columns = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
    on_hold: 'On Hold',
  };

  return (
    <CssBaseline>
      <div className="kanban-background">
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={1}>
            {Object.keys(columns).map((columnId) => (
              <Grid item xs={12} sm={6} md={3} key={columnId}>
                <Column
                  columnId={columnId}
                  title={columns[columnId]}
                  tasks={tasks.filter((task) => task.status === columnId)}
                  members={members}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                />
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      </div>
    </CssBaseline>
  );
};

export default KanbanBoard;
