import { AddBox, Delete, Edit } from '@mui/icons-material';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination,
  TableRow,
  TextField,
  useTheme
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth'; // adjust the import path accordingly

const EtudiantTable = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [etudiants, setEtudiants] = useState([]);
  const [displayedEtudiants, setDisplayedEtudiants] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editEtudiant, setEditEtudiant] = useState({ id: '', nom: '', prenom: '', filiere: '', classe: '', user: { username: '', email: '' } });
  const [newEtudiant, setNewEtudiant] = useState({ nom: '', prenom: '', filiere: '', classe: '', username: '', email: '', password: '' });

  const { user, isAuthenticated } = useAuthStore();

  const fetchEtudiants = () => {
    if (isAuthenticated) {
      const token = user.token;
      axios.get('http://127.0.0.1:8000/api/etudiants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setEtudiants(response.data.etudiants);
        setDisplayedEtudiants(response.data.etudiants);
      })
      .catch(error => {
        console.error(error);
      });
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  };

  useEffect(() => {
    fetchEtudiants();
  }, [isAuthenticated, user, navigate]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchEtudiants, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (selectedFiliere) {
      setDisplayedEtudiants(etudiants.filter(etudiant => etudiant.filiere === selectedFiliere));
    } else {
      setDisplayedEtudiants(etudiants);
    }
  }, [selectedFiliere, etudiants]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = id => {
    const token = user.token;
    axios.delete(`http://127.0.0.1:8000/api/etudiants/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const updatedEtudiants = etudiants.filter(etudiant => etudiant.id !== id);
      setEtudiants(updatedEtudiants);
      setDisplayedEtudiants(updatedEtudiants);
    })
    .catch(error => {
      console.error('Error during deletion', error);
    });
  };

  const handleEdit = etudiant => {
    setEditEtudiant({...etudiant});
    setEditDialogOpen(true);
  };

  const handleAddNew = () => {
    setNewEtudiant({ nom: '', prenom: '', filiere: '', classe: '', username: '', email: '', password: '' });
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setAddDialogOpen(false);
  };

  const saveEdits = () => {
    const token = user.token;
    const updateData = {
      nom: editEtudiant.nom,
      prenom: editEtudiant.prenom,
      filiere: editEtudiant.filiere,
      classe: editEtudiant.classe,
      username: editEtudiant.user.username,
      email: editEtudiant.user.email,
    };

    axios.put(`http://127.0.0.1:8000/api/etudiants/${editEtudiant.id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const updatedEtudiants = etudiants.map(e => {
        if (e.id === editEtudiant.id) {
          return {...e, ...response.data.etudiant, user: { ...e.user, username: editEtudiant.user.username, email: editEtudiant.user.email }};
        }
        return e;
      });
      setEtudiants(updatedEtudiants);
      setDisplayedEtudiants(updatedEtudiants);
      handleCloseDialog();
      fetchEtudiants();
    })
    .catch(error => {
      console.error('Error updating etudiant', error);
    });
  };

  const saveNewEtudiant = () => {
    const token = user.token;
    axios.post('http://127.0.0.1:8000/api/etudiants', newEtudiant, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const addedEtudiant = response.data.etudiant;
      setEtudiants([...etudiants, addedEtudiant]);
      setDisplayedEtudiants([...etudiants, addedEtudiant]);
      handleCloseDialog();
    })
    .catch(error => {
      console.error('Error adding new etudiant', error);
    });
  };

  const handleInputChange = (field, value) => {
    if (editDialogOpen) {
      if (field === 'username' || field === 'email') {
        setEditEtudiant(prev => ({
          ...prev,
          user: {
            ...prev.user,
            [field]: value
          }
        }));
      } else {
        setEditEtudiant(prev => ({
          ...prev,
          [field]: value
        }));
      }
    } else {
      setNewEtudiant(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  return (
<Paper sx={{
  width: '100%', overflow: 'hidden',
  boxShadow: theme.shadows[5],
  bgcolor: theme.palette.background.default,
  borderRadius: 2,
  '.MuiTableHead-root': {
    backgroundImage: 'linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)',
    borderRadius: '4px 4px 0 0'
  },
  '.MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  '.MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.selected
  }
}}>
    <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 2 }}>
        <Grid item xs>
          <TextField
            fullWidth
            label="Search by username"
            variant="outlined"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            select
            label="Filter by Filiere"
            value={selectedFiliere}
            onChange={e => setSelectedFiliere(e.target.value)}
            fullWidth
            variant="outlined"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">All</option>
            {Array.from(new Set(etudiants.map(etudiant => etudiant.filiere))).map(filiere => (
              <option key={filiere} value={filiere}>{filiere}</option>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<AddBox />} onClick={handleAddNew}>
            Add Etudiant
          </Button>
        </Grid>
      </Grid>
      <TableContainer style={{ maxHeight: '100%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Filiere</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedEtudiants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((etudiant) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={etudiant.id}>
                <TableCell>{etudiant.nom} {etudiant.prenom}</TableCell>
                <TableCell>{etudiant.user?.email}</TableCell>
                <TableCell>{etudiant.filiere}</TableCell>
                <TableCell>{etudiant.classe}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(etudiant)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(etudiant.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={displayedEtudiants.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '.MuiTablePagination-toolbar': {
            bgcolor: theme.palette.primary.light,
            color: theme.palette.common.white
          }
        }}
      />
      <Dialog open={editDialogOpen || addDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editDialogOpen ? "Edit Etudiant" : "Add New Etudiant"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editEtudiant.nom : newEtudiant.nom}
            onChange={e => handleInputChange('nom', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Prenom"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editEtudiant.prenom : newEtudiant.prenom}
            onChange={e => handleInputChange('prenom', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Filiere"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editEtudiant.filiere : newEtudiant.filiere}
            onChange={e => handleInputChange('filiere', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Classe"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editEtudiant.classe : newEtudiant.classe}
            onChange={e => handleInputChange('classe', e.target.value)}
          />
          <TextField
            margin="dense"
            label="username"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editEtudiant.user.username : newEtudiant.username}
            onChange={e => handleInputChange('username', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            variant="outlined"
            value={editDialogOpen ? editEtudiant.user.email : newEtudiant.email}
            onChange={e => handleInputChange('email', e.target.value)}
          />
          {addDialogOpen && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newEtudiant.password}
              onChange={e => handleInputChange('password', e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={editDialogOpen ? saveEdits : saveNewEtudiant} color="primary">{editDialogOpen ? "Save" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EtudiantTable;
