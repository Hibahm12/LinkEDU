import { Cancel, CheckCircle } from '@mui/icons-material';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth'; // Adjust the import path accordingly

const DemandeTable = () => {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const { user, isAuthenticated } = useAuthStore();

  const fetchDemandes = () => {
    if (isAuthenticated) {
      const token = user.token;
      axios.get('http://127.0.0.1:8000/api/demandes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const filteredDemandes = response.data.filter(demande => demande.professeur.id == user.professeur.id);
        setDemandes(filteredDemandes);
      })
      .catch(error => {
        console.error(error);
      });
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, [isAuthenticated, user, navigate]);

  const handleAccept = (id) => {
    const token = user.token;
    axios.post(`http://127.0.0.1:8000/api/accept/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      fetchDemandes();
    })
    .catch(error => {
      console.error('Error accepting demande', error);
    });
  };

  const handleRefuse = (id) => {
    const token = user.token;
    axios.post(`http://127.0.0.1:8000/api/refuse/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      fetchDemandes();
    })
    .catch(error => {
      console.error('Error refusing demande', error);
    });
  };

  const handleChangeStatusFilter = (event) => {
    setStatusFilter(event.target.value);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <FormControl fullWidth>
        <InputLabel>Status Filter</InputLabel>
        <Select
          value={statusFilter}
          label="Status Filter"
          onChange={handleChangeStatusFilter}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="en attente">Pending</MenuItem>
          <MenuItem value="acceptée">Accepted</MenuItem>
          <MenuItem value="refusée">Refused</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Professeur</TableCell>
              <TableCell>Etudiant</TableCell>
              <TableCell>Sujet</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demandes.filter(demande => !statusFilter || demande.status === statusFilter).map((demande) => (
              <TableRow key={demande.id}>
                <TableCell>{demande.professeur.nom} {demande.professeur.prenom}</TableCell>
                <TableCell>{demande.etudiant.nom} {demande.etudiant.prenom}</TableCell>
                <TableCell>{demande.sujet.nom}</TableCell>
                <TableCell>{demande.message}</TableCell>
                <TableCell>{demande.status}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleAccept(demande.id)}>
                    <CheckCircle />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleRefuse(demande.id)}>
                    <Cancel />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DemandeTable;
