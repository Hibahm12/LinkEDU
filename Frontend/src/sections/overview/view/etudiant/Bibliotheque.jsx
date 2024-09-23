import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bibliotheque() {
  const [rapport, setRapport] = useState(null);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    pdf_file: null,
    is_publish: false,
    date_publication: '',
    sujet_id: ''
  });

  const fetchRapport = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000//api/rapports/${id}`);
      setRapport(response.data);
    } catch (error) {
      console.error('Error fetching rapport:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleFileChange = (event) => {
    setForm({
      ...form,
      pdf_file: event.target.files[0]
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'pdf_file') {
        formData.append(key, form[key]);
      } else {
        formData.append(key, form[key]);
      }
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/rapports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Rapport created:', response.data);
    } catch (error) {
      console.error('Error creating rapport:', error);
    }
  };

  return (
    <div>
      {rapport ? (
        <div>
          <h1>{rapport.titre}</h1>
          <p>{rapport.description}</p>
        </div>
      ) : (
        <p>No rapport loaded</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          name="titre"
          value={form.titre}
          onChange={handleInputChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <input
          type="file"
          name="pdf_file"
          onChange={handleFileChange}
          required
        />
        <input
          type="checkbox"
          name="is_publish"
          checked={form.is_publish}
          onChange={(e) => setForm({...form, is_publish: e.target.checked})}
        />
        <label>Is Publish?</label>
        <input
          type="date"
          name="date_publication"
          value={form.date_publication}
          onChange={handleInputChange}
          required
        />
        <input
          name="sujet_id"
          value={form.sujet_id}
          onChange={handleInputChange}
          placeholder="Subject ID"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Bibliotheque;
