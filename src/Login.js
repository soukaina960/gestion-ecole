import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Assuming you have a CSS file for styles
const Login = () => {
  const [matricule, setMatricule] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        matricule,
        mot_de_passe: motDePasse,
      });

      localStorage.setItem('utilisateur', JSON.stringify(response.data.utilisateur));
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('access_token', response.data.access_token);

      switch(response.data.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'professeur':
          navigate('/enseignant/dashboard');
          break;
        case 'étudiant':
          navigate('/etudiant/dashboard');
          break;
        case 'parent':
          navigate('/parent-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Matricule ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Connexion</h1>
          <div className="underline"></div>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleLogin}>
          <label>Matricule</label>
          <input
            type="text"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            disabled={loading}
            required
          />

          <label>Mot de passe</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        <a href="#" className="forgot-link">Mot de passe oublié ?</a>
      </div>
    </div>
  );
};

export default Login;