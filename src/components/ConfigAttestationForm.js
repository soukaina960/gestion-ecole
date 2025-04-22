import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConfigAttestationForm = () => {
  const [form, setForm] = useState({
    nom_ecole: '',
    annee_scolaire: '',
    telephone: '',
    fax: '',
    logo: null,
  });

  const [existingConfig, setExistingConfig] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Charger la config existante
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/config-attestations');
        if (res.data) {
          setForm(res.data);
          setExistingConfig(res.data);
          if (res.data.logo_path) {
            setPreviewLogo(`/storage/${res.data.logo_path}`);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration:", error);
      }
    };
    
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });

    if (name === "logo" && files[0]) {
      setPreviewLogo(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null) {
          data.append(key, form[key]);
        }
      });

      await axios.post('http://127.0.0.1:8000/api/config-attestations', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage('Configuration mise à jour avec succès !');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setErrorMessage('Une erreur est survenue lors de la mise à jour de la configuration.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className=" mt-4  ml-5" >
        <div className="card-header  text-black">
          <h2 className="h4 mb-0">Configuration de l'attestation</h2>
        </div>
        <div className="card-body mt-4 ">
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMessage}
              <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
            </div>
          )}
          
          {errorMessage && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMessage}
              <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom de l'école</label>
              <input 
                type="text" 
                name="nom_ecole" 
                value={form.nom_ecole} 
                onChange={handleChange} 
                className="form-control" 
                required 
              />
            </div>

           
           

            <div className="mb-3">
              <label className="form-label">Année scolaire</label>
              <input 
                type="text" 
                name="annee_scolaire" 
                value={form.annee_scolaire} 
                onChange={handleChange} 
                className="form-control" 
                required 
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Téléphone</label>
                <input 
                  type="text" 
                  name="telephone" 
                  value={form.telephone || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Fax</label>
                <input 
                  type="text" 
                  name="fax" 
                  value={form.fax || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Logo de l'établissement</label>
              <input 
                type="file" 
                name="logo" 
                onChange={handleChange} 
                className="form-control" 
                accept="image/*"
              />
              {previewLogo && (
                <div className="mt-3">
                  <p className="text-muted small">Aperçu du logo:</p>
                  <img 
                    src={previewLogo} 
                    alt="Logo preview" 
                    className="img-thumbnail" 
                    style={{ maxHeight: '150px' }} 
                  />
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enregistrement...
                  </>
                ) : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ConfigAttestationForm;