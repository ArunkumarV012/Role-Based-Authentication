import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    enrollmentDate: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get('http://localhost:5000/api/students', config);
      setStudents(res.data);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to fetch students.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.post('http://localhost:5000/api/students', { ...formData, enrollmentDate: new Date().toISOString() }, config);
      setMessage('Student added successfully!');
      setFormData({ name: '', email: '', course: '', enrollmentDate: '' });
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to add student.');
    }
  };

  const handleEditClick = (student) => {
    setEditMode(true);
    setCurrentStudentId(student.id);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      enrollmentDate: student.enrollmentDate,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.put(`http://localhost:5000/api/students/${currentStudentId}`, formData, config);
      setMessage('Student updated successfully!');
      setEditMode(false);
      setCurrentStudentId(null);
      setFormData({ name: '', email: '', course: '', enrollmentDate: '' });
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to update student.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete(`http://localhost:5000/api/students/${id}`, config);
      setMessage('Student deleted successfully!');
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to delete student.');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}
      <h3>{editMode ? 'Edit Student' : 'Add New Student'}</h3>
      <form onSubmit={editMode ? handleEditSubmit : handleAddSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={onChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={onChange}
          required
        />
        <button type="submit">{editMode ? 'Update' : 'Add'}</button>
        {editMode && <button onClick={() => setEditMode(false)}>Cancel</button>}
      </form>

      <h3>All Students</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditClick(student)}>Edit</button>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;