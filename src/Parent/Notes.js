import React from 'react';

const Notes = () => {
  const notes = [
    { matiere: "Mathématiques", note: 16, commentaire: "Très bien" },
    { matiere: "Physique", note: 12, commentaire: "Assez bien" },
    { matiere: "Français", note: 14, commentaire: "Bon travail" },
    { matiere: "Informatique", note: 18, commentaire: "Excellent" },
  ];

  const containerStyle = {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '30px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
    transition: '0.3s',
  };

  const matiereStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0077cc',
    marginBottom: '10px'
  };

  const noteStyle = {
    color: '#27ae60',
    fontWeight: 'bold'
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#555'
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>📚 Notes de l'élève</h2>
      <div style={gridStyle}>
        {notes.map((note, index) => (
          <div key={index} style={cardStyle}>
            <h3 style={matiereStyle}>{note.matiere}</h3>
            <p>
              <span style={labelStyle}>Note:</span>{' '}
              <span style={noteStyle}>{note.note} / 20</span>
            </p>
            <p>
              <span style={labelStyle}>Commentaire:</span>{' '}
              {note.commentaire}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
