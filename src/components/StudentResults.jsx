import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import axios from 'axios';

const StudentResults = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/etudiants');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleGradeSubmit = async (studentId, grade) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/assignments/${selectedCourse}/submissions`, {
        student_id: studentId,
        grade: grade
      });
      fetchStudents();
    } catch (error) {
      console.error('Error submitting grade:', error);
    }
  };

  return (
    <div>
      <h2>Suivi des résultats des étudiants</h2>
      
      <TextField
        label="Filtrer par nom"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      
      <TextField
        label="Sélectionner un cours"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        style={{ marginLeft: '20px', marginBottom: '20px' }}
      />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students
              .filter(student => 
                `${student.first_name} ${student.last_name}`.toLowerCase().includes(filter.toLowerCase())
              )
              .map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.last_name}</TableCell>
                  <TableCell>{student.first_name}</TableCell>
                  <TableCell>{student.classroom_id}</TableCell>
                  <TableCell>
                    {student.grades && student.grades.map((grade, index) => (
                      <div key={index}>{grade.course}: {grade.grade}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      label="Nouvelle note"
                      onBlur={(e) => handleGradeSubmit(student.id, e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StudentResults;