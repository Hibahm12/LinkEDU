import { AddBox, Delete, Edit, Search } from '@mui/icons-material';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth'; // adjust the import path accordingly

const ProfesseurTable = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [professeurs, setProfesseurs] = useState([]);
  const [displayedProfesseurs, setDisplayedProfesseurs] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editProfesseur, setEditProfesseur] = useState({ nom: '', prenom: '', email: '', matricule: '', name: '', password: '' });
  const [newProfesseur, setNewProfesseur] = useState({ nom: '', prenom: '', email: '', matricule: '', name: '', password: '' });

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const token = user.token;
      axios.get('http://127.0.0.1:8000/api/professeurs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          setProfesseurs(response.data.professeurs);
          setDisplayedProfesseurs(response.data.professeurs);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const results = professeurs.filter(professeur =>
      professeur.nom.toLowerCase().includes(filter.toLowerCase())
    );
    setDisplayedProfesseurs(results);
    setPage(0);
  }, [filter, professeurs]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = id => {
    const token = user.token;
    axios.delete(`http://127.0.0.1:8000/api/professeurs/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        const updatedProfesseurs = professeurs.filter(professeur => professeur.id !== id);
        setProfesseurs(updatedProfesseurs);
        setDisplayedProfesseurs(updatedProfesseurs);
      })
      .catch(error => {
        console.error('Error during deletion', error);
      });
  };

  const handleEdit = professeur => {
    setEditProfesseur(professeur);
    setEditDialogOpen(true);
  };

  const handleAddNew = () => {
    setNewProfesseur({ nom: '', prenom: '', email: '', matricule: '', name: '', password: '' });
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setAddDialogOpen(false);
  };

  const saveEdits = () => {
    const token = user.token;
    const updateData = {
      nom: editProfesseur.nom,
      prenom: editProfesseur.prenom,
      matricule: editProfesseur.matricule,
      name: editProfesseur.user.name,
      email: editProfesseur.user.email,
      password: editProfesseur.password
    };
    axios.post(`http://127.0.0.1:8000/api/professeurs/${editProfesseur.id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        const updatedProfesseurs = professeurs.map(p => p.id === editProfesseur.id ? { ...p, ...editProfesseur } : p);
        setProfesseurs(updatedProfesseurs);
        setDisplayedProfesseurs(updatedProfesseurs);
        handleCloseDialog();
      })
      .catch(error => {
        console.error('Error updating professeur', error);
      });
  };

  const saveNewProfesseur = () => {
    const token = user.token;
    axios.post(`http://127.0.0.1:8000/api/professeurs`, newProfesseur, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const addedProfesseur = response.data.data.professeur;  // Assuming the response contains the object under 'data.professeur'
        setProfesseurs([...professeurs, addedProfesseur]);
        setDisplayedProfesseurs([...professeurs, addedProfesseur]);
        handleCloseDialog();
      })
      .catch(error => {
        console.error('Error adding new professeur', error);
      });
  };

  const handleInputChange = (field, value) => {
    if (editDialogOpen) {
      setEditProfesseur(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setNewProfesseur(prev => ({
        ...prev,
        [field]: value
      }));
    }
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
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<AddBox />} onClick={handleAddNew}>
            Add Professeur
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2" color="textSecondary">Name</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" color="textSecondary">Email</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" color="textSecondary">Matricule</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" color="textSecondary">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedProfesseurs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((professeur) => (
              <TableRow hover key={professeur.id}>
                <TableCell>{professeur.nom} {professeur.prenom}</TableCell>
                <TableCell>{professeur.user.email}</TableCell>
                <TableCell>{professeur.matricule}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(professeur)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(professeur.id)}>
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
        count={displayedProfesseurs.length}
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
        <DialogTitle>{editDialogOpen ? "Edit Professeur" : "Add New Professeur"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editProfesseur.nom : newProfesseur.nom}
            onChange={e => handleInputChange('nom', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Prenom"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editProfesseur.prenom : newProfesseur.prenom}
            onChange={e => handleInputChange('prenom', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editProfesseur.user.email : newProfesseur.email}
            onChange={e => handleInputChange('email', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editProfesseur.user.name : newProfesseur.name}
            onChange={e => handleInputChange('name', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Matricule"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editProfesseur.matricule : newProfesseur.matricule}
            onChange={e => handleInputChange('matricule', e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={editDialogOpen ? saveEdits : saveNewProfesseur} color="primary">
            {editDialogOpen ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProfesseurTable;
