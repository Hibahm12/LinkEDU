import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip,
  Grid, useTheme, TablePagination, Typography, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { AddBox, Delete, Edit, Search } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth'; // adjust the import path accordingly

const SujetTable = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [sujets, setSujets] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [displayedSujets, setDisplayedSujets] = useState([]);
  const [filter, setFilter] = useState('');
  const [professeurFilter, setProfesseurFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editSujet, setEditSujet] = useState(null);
  const [newSujet, setNewSujet] = useState({ nom: '', description: '', professeur_id: '' ,annee: ''});

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const token = user.token;
      axios.get('http://127.0.0.1:8000/api/sujets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          setSujets(response.data.sujets);
          setDisplayedSujets(response.data.sujets);
        })
        .catch(error => {
          console.error(error);
        });

      axios.get('http://127.0.0.1:8000/api/professeurs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          setProfesseurs(response.data.professeurs);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const results = sujets.filter(sujet =>
      sujet.nom.toLowerCase().includes(filter.toLowerCase()) &&
      (sujet.professeur ? `${sujet.professeur.nom} ${sujet.professeur.prenom}`.toLowerCase().includes(professeurFilter.toLowerCase()) : true)
    );
    setDisplayedSujets(results);
  }, [sujets, filter, professeurFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = id => {
    const token = user.token;
    axios.delete(`http://127.0.0.1:8000/api/sujets/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const updatedSujets = sujets.filter(sujet => sujet.id !== id);
        setSujets(updatedSujets);
        setDisplayedSujets(updatedSujets);
      })
      .catch(error => {
        console.error('Error during deletion', error);
      });
  };
  const handleProfesseurChange = (event) => {
    const newProfId = event.target.value;
    setEditSujet(prevState => ({
      ...prevState,
      professeur_id: newProfId
    }));
  };
  
  const handleEdit = sujet => {
    setEditSujet({ ...sujet });
    setEditDialogOpen(true);
  };

  const handleAddNew = () => {
    setNewSujet({ nom: '', description: '', professeur_id: '' ,annee: ''});
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setAddDialogOpen(false);
  };

  const saveEdits = () => {
    const token = user.token;
    axios.put(`http://127.0.0.1:8000/api/sujets/${editSujet.id}`, editSujet, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const updatedSujets = sujets.map(s => s.id === editSujet.id ? { ...s, ...editSujet, professeur: professeurs.find(p => p.id === editSujet.professeur_id) } : s);
      setSujets(updatedSujets);
      setDisplayedSujets(updatedSujets);
      handleCloseDialog();
    })
    
    .catch(error => {
      console.error('Error updating sujet', error);
    });
  };
  

  const saveNewSujet = () => {
    const token = user.token;
    axios.post('http://127.0.0.1:8000/api/sujets', newSujet, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const addedSujet = response.data.data; // Ensure response structure is correct
      setSujets([...sujets, addedSujet]);
      setDisplayedSujets([...displayedSujets, addedSujet]);
      handleCloseDialog();
    })
    .catch(error => {
      console.error('Error adding new sujet', error);
    });
  };
  
  

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: theme.shadows[3], bgcolor: 'background.paper', p: 2 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search by Name"
            variant="outlined"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search color="action" />
              ),
            }}
            sx={{ mb: { xs: 2, sm: 0 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search by Professeur"
            variant="outlined"
            value={professeurFilter}
            onChange={e => setProfesseurFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search color="action" />
              ),
            }}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" startIcon={<AddBox />} onClick={handleAddNew}>
          Add Sujet
        </Button>
      </Grid>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2" color="textSecondary">Name</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" color="textSecondary">Description</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" color="textSecondary">Professeur</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" color="textSecondary">Annee</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" color="textSecondary">Actions</Typography></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {displayedSujets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sujet) => (
              <TableRow hover key={sujet.id}>
                <TableCell>{sujet.nom}</TableCell>
                <TableCell>{sujet.description}</TableCell>
                <TableCell>{sujet.professeur ? `${sujet.professeur.nom} ${sujet.professeur.prenom}` : 'N/A'}</TableCell>
                <TableCell>{sujet.annee}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(sujet)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(sujet.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={displayedSujets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          bgcolor: theme.palette.primary.light,
          color: theme.palette.common.white,
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            color: theme.palette.common.white,
          },
          '.MuiTablePagination-select': {
            color: theme.palette.common.white,
          },
          '.MuiTablePagination-actions': {
            color: theme.palette.common.white,
          },
        }}
      />
      <Dialog open={editDialogOpen || addDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editDialogOpen ? "Edit Sujet" : "Add New Sujet"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editSujet?.nom : newSujet.nom}
            onChange={e => editDialogOpen ? setEditSujet({ ...editSujet, nom: e.target.value }) : setNewSujet({ ...newSujet, nom: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={editDialogOpen ? editSujet?.description : newSujet.description}
            onChange={e => editDialogOpen ? setEditSujet({ ...editSujet, description: e.target.value }) : setNewSujet({ ...newSujet, description: e.target.value })}
          />
           <TextField
    autoFocus
    margin="dense"
    label="Année"
    type="text"
    fullWidth
    variant="outlined"
    value={editDialogOpen ? editSujet?.annee : newSujet.annee}
    onChange={e => editDialogOpen ? setEditSujet({ ...editSujet, annee: e.target.value }) : setNewSujet({ ...newSujet, annee: e.target.value })}
    sx={{ mb: 2 }}
/>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel id="select-professeur-label">Professeur</InputLabel>
            <Select
              labelId="select-professeur-label"
              value={editDialogOpen ? editSujet?.professeur_id : newSujet.professeur_id}
              onChange={e => editDialogOpen ? setEditSujet({ ...editSujet, professeur_id: e.target.value }) : setNewSujet({ ...newSujet, professeur_id: e.target.value })}
              label="Professeur"
            >
              {professeurs.map(prof => (
                <MenuItem key={prof.id} value={prof.id}>
                  {prof.nom} {prof.prenom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={editDialogOpen ? saveEdits : saveNewSujet} color="primary">{editDialogOpen ? "Save" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SujetTable;
