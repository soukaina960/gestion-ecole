import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConfigAttestationForm = () => {
  const [form, setForm] = useState({
    nom_ecole: '',
    nom_faculte: '',
    annee_scolaire: '',
    telephone: '',
    fax: '',
    logo: null,
  });

  const [existingConfig, setExistingConfig] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  // 🔄 Charger la config existante
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/config-attestations').then((res) => {
      if (res.data) {
        setForm(res.data);
        setExistingConfig(res.data);
        setPreviewLogo(`/storage/${res.data.logo_path}`);
      }
    });
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
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));

    await axios.post('http://127.0.0.1:8000/api/config-attestations', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      

    alert('Configuration mise à jour avec succès 🎉');
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4">Configuration de l’attestation</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block">Nom de l’école</label>
          <input type="text" name="nom_ecole" value={form.nom_ecole} onChange={handleChange} className="input w-full" />
        </div>

        <div className="mb-3">
          <label className="block">Nom de la faculté</label>
          <input type="text" name="nom_faculte" value={form.nom_faculte || ''} onChange={handleChange} className="input w-full" />
        </div>

        <div className="mb-3">
          <label className="block">Année scolaire</label>
          <input type="text" name="annee_scolaire" value={form.annee_scolaire} onChange={handleChange} className="input w-full" />
        </div>

        <div className="mb-3">
          <label className="block">Téléphone</label>
          <input type="text" name="telephone" value={form.telephone || ''} onChange={handleChange} className="input w-full" />
        </div>

        <div className="mb-3">
          <label className="block">Fax</label>
          <input type="text" name="fax" value={form.fax || ''} onChange={handleChange} className="input w-full" />
        </div>

        <div className="mb-3">
          <label className="block">Logo de l’établissement</label>
          <input type="file" name="logo" onChange={handleChange} />
          {previewLogo && (
            <img src={previewLogo} alt="Logo preview" className="h-24 mt-2" />
          )}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
      </form>
    </div>
  );
};

export default ConfigAttestationForm;
