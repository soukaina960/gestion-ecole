import axios from 'axios';
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  export async function addUtilisateur(utilisateur) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/utilisateurs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(utilisateur),
        });

        // Si la réponse n'est pas OK (par exemple, 422)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Réponse non valide');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        throw error;
    }
}

  
  // Intercepteur pour ajouter le token JWT
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

// Intercepteur pour ajouter le token JWTffdfd
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
const UTILISATEURS_API_URL = "http://127.0.0.1:8000/api/utilisateurs";
const CLASSROOMS_API_URL = "http://127.0.0.1:8000/api/classrooms";
const STUDENTS_API_URL = "http://127.0.0.1:8000/api/etudiants";
const API_URL = "http://127.0.0.1:8000/api/emplois_temps";

// API Utilisateurs
export async function getUtilisateurs() {
    const response = await fetch(UTILISATEURS_API_URL);
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
    }
    return response.json();
}



export async function deleteUtilisateur(id) {
    const response = await fetch(`${UTILISATEURS_API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
}

// API Classes
export async function getClassrooms() {
    const response = await fetch(CLASSROOMS_API_URL);
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des classes");
    }
    return response.json();
}

export async function addClassroom(classroomData) {
    const response = await fetch('http://127.0.0.1:8000/api/classrooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(classroomData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur serveur");
    }

    return await response.json();
}


export async function deleteClassroom(id) {
    const response = await fetch(`${CLASSROOMS_API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la classe");
    }
}
// API Étudiants
export async function getStudents() {
    const response = await fetch(STUDENTS_API_URL);
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des étudiants");
    }
    return response.json();
}

export async function addStudent(student) {
    const response = await fetch(STUDENTS_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
    });
    if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'étudiant");
    }
    return response.json();
}

export async function deleteStudent(id) {
    const response = await fetch(`${STUDENTS_API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'étudiant");
    }
}


export async function getEmploisTemps() {
    const response = await fetch(`${API_URL}/emplois_temps`);
    if (!response.ok) {
        throw new Error("Erreur de récupération des emplois du temps");
    }
    return response.json();
}

export async function addEmploiTemps(emploi) {
    const response = await fetch(`${API_URL}/emplois_temps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emploi),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'emploi du temps");
    }
    return response.json();
}
export async function getDashboardStats() {
    const response = await fetch("http://127.0.0.1:8000/api/dashboard");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des statistiques");
    }
    return response.json();
  }
  export async function getFilieres() {
    const response = await fetch('http://127.0.0.1:8000/api/filieres');
    const data = await response.json();
    return data.data;  // Assure-toi que la structure des données est correcte
}
  