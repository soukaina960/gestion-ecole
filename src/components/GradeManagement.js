import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message } from 'antd';
import http://127.0.0.1:8000/api from '../services/http://127.0.0.1:8000/api';

const GradeManagement = ({ course }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await http://127.0.0.1:8000/api.get(`/courses/${course.id}/assignments`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignments();
  }, [course.id]);

  useEffect(() => {
    if (selectedAssignment) {
      const fetchGrades = async () => {
        try {
          const response = await http://127.0.0.1:8000/api.get(`/assignments/${selectedAssignment.id}/grades`);
          const gradesMap = {};
          response.data.forEach(grade => {
            gradesMap[grade.student_id] = grade.grade;
          });
          setGrades(gradesMap);
        } catch (error) {
          console.error('Error fetching grades:', error);
        }
      };
      fetchGrades();
    }
  }, [selectedAssignment]);

  const handleGradeChange = (studentId, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const submitGrades = async () => {
    try {
      await http://127.0.0.1:8000/api.post(`/assignments/${selectedAssignment.id}/grades`, {
        grades: grades
      });
      message.success('Notes enregistrées avec succès!');
    } catch (error) {
      console.error('Error submitting grades:', error);
      message.error('Erreur lors de l\'enregistrement');
    }
  };

  return (
    <div className="grade-management">
      <h2>Gestion des Notes - {course.title}</h2>
      
      <div className="assignment-selector">
        <h3>Sélectionner un devoir:</h3>
        <div className="assignment-list">
          {assignments.map(assignment => (
            <Button
              key={assignment.id}
              type={selectedAssignment?.id === assignment.id ? 'primary' : 'default'}
              onClick={() => setSelectedAssignment(assignment)}
            >
              {assignment.title}
            </Button>
          ))}
        </div>
      </div>

      {selectedAssignment && (
        <div className="grade-editor">
          <Table
            dataSource={course.students}
            rowKey="id"
            pagination={false}
          >
            <Table.Column title="Étudiant" dataIndex="name" key="name" />
            <Table.Column
              title="Note"
              key="grade"
              render={(_, record) => (
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={grades[record.id] || ''}
                  onChange={(e) => handleGradeChange(record.id, e.target.value)}
                  style={{ width: 80 }}
                />
              )}
            />
          </Table>
          <Button 
            type="primary" 
            onClick={submitGrades}
            style={{ marginTop: 16 }}
          >
            Enregistrer les notes
          </Button>
        </div>
      )}
    </div>
  );
};

export default GradeManagement;