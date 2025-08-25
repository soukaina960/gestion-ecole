import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChangePasswordModal = ({ isOpen, onClose, onSuccess, userData }) => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
      setErrors({});
      setSuccessMessage('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    if (errors.general) {
      setErrors({ ...errors, general: null });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    if (formData.new_password !== formData.new_password_confirmation) {
      setErrors({ new_password_confirmation: 'Les mots de passe ne correspondent pas' });
      setIsLoading(false);
      return;
    }

    if (formData.new_password.length < 8) {
      setErrors({ new_password: 'Le mot de passe doit contenir au moins 8 caractères' });
      setIsLoading(false);
      return;
    }

    try {
      const token = userData?.access_token;

      const response = await axios.post(
        'http://127.0.0.1:8000/api/change-password',
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.message) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.data?.errors) {
        const formattedErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          formattedErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ general: 'Erreur lors du changement de mot de passe' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Changer votre mot de passe</h2>
          <button onClick={onClose} style={styles.modalCloseBtn}>&times;</button>
        </div>

        <div style={styles.modalBody}>
          <p style={styles.modalDescription}>
            Pour des raisons de sécurité, veuillez changer votre mot de passe temporaire.
          </p>

          {errors.general && <div style={styles.errorMessage}>{errors.general}</div>}
          {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Mot de passe actuel */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Mot de passe actuel</label>
              <div style={styles.passwordInputContainer}>
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.current_password ? styles.inputError : {}) }}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  style={styles.togglePasswordButton}
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.current_password && <span style={styles.errorText}>{errors.current_password}</span>}
            </div>

            {/* Nouveau mot de passe */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Nouveau mot de passe (min. 8 caractères)</label>
              <div style={styles.passwordInputContainer}>
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.new_password ? styles.inputError : {}) }}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  style={styles.togglePasswordButton}
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.new_password && <span style={styles.errorText}>{errors.new_password}</span>}
            </div>

            {/* Confirmer nouveau mot de passe */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirmer le nouveau mot de passe</label>
              <div style={styles.passwordInputContainer}>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="new_password_confirmation"
                  value={formData.new_password_confirmation}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.new_password_confirmation ? styles.inputError : {}) }}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  style={styles.togglePasswordButton}
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.new_password_confirmation && <span style={styles.errorText}>{errors.new_password_confirmation}</span>}
            </div>

            <div style={styles.modalActions}>
              <button type="button" onClick={onClose} style={styles.btnSecondary} disabled={isLoading}>
                Annuler
              </button>
              <button type="submit" style={{ ...styles.btnPrimary, ...(isLoading ? styles.btnDisabled : {}) }} disabled={isLoading}>
                {isLoading ? 'Changement en cours...' : 'Changer le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Styles améliorés avec le dégradé demandé
const styles = {
  modalOverlay: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1000,
    backdropFilter: 'blur(5px)'
  },
  modalContent: { 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    width: '90%', 
    maxWidth: '500px', 
    maxHeight: '90vh', 
    overflowY: 'auto', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  modalHeader: { 
    background: 'linear-gradient(to right, #E74C3C, #C0392B)',
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '1.5rem', 
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    color: 'white'
  },
  modalTitle: { 
    margin: 0, 
    fontSize: '1.5rem', 
    fontWeight: '600', 
    color: 'white',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
  },
  modalCloseBtn: { 
    background: 'rgba(255,255,255,0.2)', 
    border: 'none', 
    fontSize: '1.5rem', 
    cursor: 'pointer', 
    color: 'white', 
    padding: 0, 
    width: '35px', 
    height: '35px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease'
  },
  modalBody: { 
    padding: '2rem' 
  },
  modalDescription: { 
    color: '#6b7280', 
    marginBottom: '1.5rem', 
    fontSize: '0.95rem', 
    lineHeight: '1.6',
    textAlign: 'center'
  },
  formGroup: { 
    marginBottom: '1.5rem' 
  },
  label: { 
    display: 'block', 
    marginBottom: '0.5rem', 
    fontWeight: '500', 
    color: '#374151', 
    fontSize: '0.9rem' 
  },
  passwordInputContainer: { 
    position: 'relative', 
    width: '100%' 
  },
  input: { 
    width: '100%', 
    padding: '0.85rem', 
    border: '1px solid #d1d5db', 
    borderRadius: '8px', 
    fontSize: '1rem', 
    boxSizing: 'border-box', 
    paddingRight: '50px',
    transition: 'all 0.2s ease',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
  },
  inputError: { 
    borderColor: '#ef4444', 
    borderWidth: '2px',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
  },
  togglePasswordButton: { 
    position: 'absolute', 
    right: '12px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    fontSize: '1.1rem', 
    padding: '5px',
    color: '#6b7280'
  },
  errorText: { 
    color: '#ef4444', 
    fontSize: '0.875rem', 
    marginTop: '0.25rem', 
    display: 'block' 
  },
  errorMessage: { 
    backgroundColor: '#fef2f2', 
    border: '1px solid #fecaca', 
    color: '#ef4444', 
    padding: '0.75rem', 
    borderRadius: '8px', 
    marginBottom: '1rem', 
    fontSize: '0.9rem' 
  },
  successMessage: { 
    backgroundColor: '#d1fae5', 
    border: '1px solid #a7f3d0', 
    color: '#065f46', 
    padding: '0.75rem', 
    borderRadius: '8px', 
    marginBottom: '1rem', 
    fontSize: '0.9rem' 
  },
  modalActions: { 
    display: 'flex', 
    justifyContent: 'flex-end', 
    gap: '1rem', 
    marginTop: '2rem' 
  },
  btnPrimary: { 
    background: 'linear-gradient(to right, #E74C3C, #C0392B)',
    color: 'white', 
    border: 'none', 
    padding: '0.85rem 1.75rem', 
    borderRadius: '8px', 
    fontWeight: '600', 
    cursor: 'pointer', 
    fontSize: '0.95rem',
    boxShadow: '0 4px 6px rgba(199, 56, 44, 0.3)',
    transition: 'all 0.2s ease'
  },
  btnSecondary: { 
    backgroundColor: '#f8f9fa', 
    color: '#495057', 
    border: '1px solid #dee2e6', 
    padding: '0.85rem 1.75rem', 
    borderRadius: '8px', 
    fontWeight: '500', 
    cursor: 'pointer', 
    fontSize: '0.95rem',
    transition: 'all 0.2s ease'
  },
  btnDisabled: { 
    opacity: 0.7, 
    cursor: 'not-allowed',
    transform: 'none !important'
  },
};

// Ajout des effets au survol
Object.assign(styles.modalCloseBtn, {
  ':hover': {
    backgroundColor: 'rgba(255,255,255,0.3)'
  }
});

Object.assign(styles.btnPrimary, {
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(199, 56, 44, 0.4)'
  },
  ':active': {
    transform: 'translateY(0)'
  }
});

Object.assign(styles.btnSecondary, {
  ':hover': {
    backgroundColor: '#e9ecef'
  }
});

Object.assign(styles.input, {
  ':focus': {
    outline: 'none',
    borderColor: '#E74C3C',
    boxShadow: '0 0 0 3px rgba(231, 76, 60, 0.1)'
  }
});

export default ChangePasswordModal;