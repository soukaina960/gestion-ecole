import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './components/ChangePasswordModal';
import './Login.css';
const Login = () => {
  const [matricule, setMatricule] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!matricule || !motDePasse) {
      setErrorMessage('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        matricule,
        mot_de_passe: motDePasse,
      });

      // Vérifier si le changement de mot de passe est requis
      if (response.data.requires_password_change) {
        setUserData(response.data);
        setShowPasswordModal(true);
        return;
      }

      // Stocker les données utilisateur
      localStorage.setItem('utilisateur', JSON.stringify(response.data.utilisateur));
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('access_token', response.data.access_token);

      // Stocker les IDs spécifiques selon le rôle
      if (response.data.role === 'parent' && response.data.utilisateur.parent) {
        localStorage.setItem('parent_id', response.data.utilisateur.parent.id);
      }
      if (response.data.role === 'surveillant' && response.data.utilisateur.surveillant) {
        localStorage.setItem('surveillant_id', response.data.utilisateur.surveillant.id);
      }
      if (response.data.role === 'étudiant' && response.data.etudiant) {
        localStorage.setItem('etudiant_id', response.data.etudiant.id);
      }
      if (response.data.role === 'professeur' && response.data.professeur) {
        localStorage.setItem('professeur_id', response.data.professeur.id);
      }

      // Redirection selon le rôle
      const roleRedirect = {
        admin: '/admin',
        professeur: '/enseignant/dashboard',
        étudiant: '/etudiant/dashboard',
        parent: '/parent',
        surveillant: '/surveillant',
      };

      navigate(roleRedirect[response.data.role] || '/');
      
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Matricule ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSuccess = () => {
    // Après le changement de mot de passe, fermer le modal et réinitialiser
    setShowPasswordModal(false);
    setUserData(null);
    setMatricule('');
    setMotDePasse('');
    setErrorMessage('Mot de passe changé avec succès. Veuillez vous reconnecter.');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container-unique">
        <div className="login-header">
          <h1 className="login-title-special">Connexion</h1>
        </div>

        {errorMessage && (
          <div className={`login-message ${errorMessage.includes('succès') ? 'login-success-message' : 'login-error-message'}`}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label className="login-input-label">Matricule</label>
            <input
              className="login-input-field"
              type="text"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="login-input-group">
            <label className="login-input-label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                className="login-input-field"
                type={showPassword ? 'text' : 'password'}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#C0392B',
                  cursor: 'pointer',
                  padding: '5px',
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn-primary" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span 
                  style={{
                    display: 'inline-block',
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}
                />
                Connexion en cours...
              </>
            ) : 'Se Connecter'}
          </button>
        </form>

        {/* Modal de changement de mot de passe */}
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordChangeSuccess}
          userData={userData}
        />
      </div>
    </div>
  );
};

export default Login;