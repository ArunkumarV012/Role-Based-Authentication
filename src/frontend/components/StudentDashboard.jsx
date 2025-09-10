import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', course: '' });
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get('http://localhost:5000/api/me', config);
      setProfile(res.data);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        course: res.data.course || '', // Handle case where course is not set
      });
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to fetch profile.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.put('http://localhost:5000/api/me', formData, config);
      setMessage('Profile updated successfully!');
      fetchProfile(); // Re-fetch data to show the updated info
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to update profile.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboardContainer}>
        <h2 style={styles.heading}>Student Dashboard</h2>
        {profile.role === 'admin' && (
          <p style={styles.message}>
            You are an Admin. <Link to="/admin-dashboard" style={styles.link}>Go to Admin Dashboard</Link>
          </p>
        )}
        <h3 style={styles.subHeading}>My Profile</h3>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={onSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Course:</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={onChange}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  dashboardContainer: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  subHeading: {
    fontSize: '1.5rem',
    marginTop: '20px',
    marginBottom: '15px',
    color: '#444',
  },
  inputGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  message: {
    marginTop: '15px',
    color: '#28a745',
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default StudentDashboard;