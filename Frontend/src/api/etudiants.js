const URL = 'http://127.0.0.1:8000/api';

export const getEtudiants = async () => {
  try {
    const response = await fetch(`${URL}/etudiants`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Fetching etudiants failed:", err);
    throw err; // Re-throw to handle it in the component
  }  
}

export const getEtudiant = async (id) => {
  try {
    const response = await fetch(`${URL}/etudiants/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`Fetching etudiant with id ${id} failed:`, err);
    throw err;
  }
}
