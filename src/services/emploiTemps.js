// src/services/emploiTemps.js
export async function fetchEmploisTemps(classeId) {
    const res = await fetch(
      `http://127.0.0.1:8000/api/emplois-temps/${classeId}`
    );
    if (!res.ok) throw new Error('Erreur récupération emploi du temps');
    return res.json();
  }
  