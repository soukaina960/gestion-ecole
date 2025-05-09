import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSave, FaSpinner, FaImage, FaSignature, FaStamp } from 'react-icons/fa';

const ConfigAttestationForm = () => {
  const [form, setForm] = useState({
    nom_ecole: '',
    annee_scolaire: '',
    telephone: '',
    fax: '',
    logo: null,
    signature: null,
    cachet: null
  });

  const [existingConfig, setExistingConfig] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewSignature, setPreviewSignature] = useState(null);
  const [previewCachet, setPreviewCachet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/config-attestations');
        if (res.data) {
          setForm(res.data);
          setExistingConfig(res.data);
          if (res.data.logo_path) setPreviewLogo(`/storage/${res.data.logo_path}`);
          if (res.data.signature_path) setPreviewSignature(`/storage/${res.data.signature_path}`);
          if (res.data.cachet_path) setPreviewCachet(`/storage/${res.data.cachet_path}`);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration:", error);
      }
    };
    
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));

    if (files && files[0]) {
      const previewUrl = URL.createObjectURL(files[0]);
      if (name === "logo") setPreviewLogo(previewUrl);
      if (name === "signature") setPreviewSignature(previewUrl);
      if (name === "cachet") setPreviewCachet(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      const response = await axios.post('http://127.0.0.1:8000/api/config-attestations', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage('Configuration enregistrée avec succès !');
      setForm(response.data);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setErrorMessage(error.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearPreview = (type) => {
    if (type === 'logo') {
      setPreviewLogo(null);
      setForm(prev => ({ ...prev, logo: null }));
    } else if (type === 'signature') {
      setPreviewSignature(null);
      setForm(prev => ({ ...prev, signature: null }));
    } else if (type === 'cachet') {
      setPreviewCachet(null);
      setForm(prev => ({ ...prev, cachet: null }));
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0 d-flex align-items-center">
            <FaImage className="me-2" />
            Configuration des attestations
          </h2>
        </div>
        
        <div className="card-body">
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMessage}
              <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} aria-label="Close"></button>
            </div>
          )}
          
          {errorMessage && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMessage}
              <button type="button" className="btn-close" onClick={() => setErrorMessage('')} aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Nom de l'établissement *</label>
                <input 
                  type="text" 
                  name="nom_ecole" 
                  value={form.nom_ecole} 
                  onChange={handleChange} 
                  className="form-control" 
                  required 
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Année scolaire *</label>
                <input 
                  type="text" 
                  name="annee_scolaire" 
                  value={form.annee_scolaire} 
                  onChange={handleChange} 
                  className="form-control" 
                  placeholder="Ex: 2023-2024"
                  required 
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Téléphone</label>
                <input 
                  type="tel" 
                  name="telephone" 
                  value={form.telephone || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Fax</label>
                <input 
                  type="tel" 
                  name="fax" 
                  value={form.fax || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                />
              </div>

              {/* Section Logo */}
              <div className="col-12">
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h3 className="h6 mb-0 d-flex align-items-center">
                      <FaImage className="me-2 text-primary" />
                      Logo de l'établissement
                    </h3>
                  </div>
                  <div className="card-body">
                    <input 
                      type="file" 
                      name="logo" 
                      onChange={handleChange} 
                      className="form-control mb-3" 
                      accept="image/*"
                    />
                    {previewLogo && (
                      <div className="d-flex flex-column align-items-center">
                        <p className="text-muted small mb-2">Aperçu du logo:</p>
                        <div className="position-relative">
                          <img 
                            src={previewLogo} 
                            alt="Logo preview" 
                            className="img-thumbnail" 
                            style={{ maxHeight: '150px' }} 
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            onClick={() => clearPreview('logo')}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Signature */}
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h3 className="h6 mb-0 d-flex align-items-center">
                      <FaSignature className="me-2 text-primary" />
                      Signature du directeur
                    </h3>
                  </div>
                  <div className="card-body">
                    <input 
                      type="file" 
                      name="signature" 
                      onChange={handleChange} 
                      className="form-control mb-3" 
                      accept="image/*"
                    />
                    {previewSignature && (
                      <div className="d-flex flex-column align-items-center">
                        <p className="text-muted small mb-2">Aperçu de la signature:</p>
                        <div className="position-relative">
                          <img 
                            src={previewSignature} 
                            alt="Signature preview" 
                            className="img-thumbnail" 
                            style={{ maxHeight: '150px' }} 
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            onClick={() => clearPreview('signature')}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Cachet */}
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h3 className="h6 mb-0 d-flex align-items-center">
                      <FaStamp className="me-2 text-primary" />
                      Cachet de l'établissement
                    </h3>
                  </div>
                  <div className="card-body">
                    <input 
                      type="file" 
                      name="cachet" 
                      onChange={handleChange} 
                      className="form-control mb-3" 
                      accept="image/*"
                    />
                    {previewCachet && (
                      <div className="d-flex flex-column align-items-center">
                        <p className="text-muted small mb-2">Aperçu du cachet:</p>
                        <div className="position-relative">
                          <img 
                            src={previewCachet} 
                            alt="Cachet preview" 
                            className="img-thumbnail" 
                            style={{ maxHeight: '150px' }} 
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            onClick={() => clearPreview('cachet')}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-primary px-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="fa-spin me-2" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      Enregistrer la configuration
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfigAttestationForm;