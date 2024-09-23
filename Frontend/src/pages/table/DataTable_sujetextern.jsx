import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TextField,
  Box
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TableSujetExtern() {
  const [sujets, setSujets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSujets, setFilteredSujets] = useState([]);

  useEffect(() => {
    fetchSujets();
  }, []);

  useEffect(() => {
    filterSujets();
  }, [yearFilter, searchQuery, sujets]);

  const fetchSujets = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/sujetsexterns');
      setSujets(response.data.sujets);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const filterSujets = () => {
    let filtered = sujets;

    if (yearFilter) {
      filtered = filtered.filter(sujet =>
        new Date(sujet.updated_at).getFullYear().toString() === yearFilter
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(sujet =>
        `${sujet.etudiant?.prenom} ${sujet.etudiant?.nom}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSujets(filtered);
  };

  const handleYearChange = (event) => {
    setYearFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError('');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="year-filter-label">Filter by Year</InputLabel>
          <Select
            labelId="year-filter-label"
            id="year-filter-select"
            value={yearFilter}
            label="Filter by Year"
            onChange={handleYearChange}
          >
            <MenuItem value="">None</MenuItem>
            {[...new Set(sujets.map(item => new Date(item.updated_at).getFullYear()))].map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Search by Student Name"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom de Etudiant</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Company Name</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSujets.map((sujet) => (
              <TableRow key={sujet.id} hover>
                <TableCell component="th" scope="row">
                  {sujet.etudiant?.prenom} {sujet.etudiant?.nom}
                </TableCell>
                <TableCell>{sujet.titre_sujet}</TableCell>
                <TableCell align="right">{sujet.nom_entreprise}</TableCell>
                <TableCell align="right">{sujet.date_debut}</TableCell>
                <TableCell align="right">{sujet.date_fin}</TableCell>
                <TableCell align="right">{sujet.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default TableSujetExtern;
