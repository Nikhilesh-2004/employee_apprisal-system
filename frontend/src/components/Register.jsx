import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'EMPLOYEE'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Name:</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
        <div>
          <label>Role:</label>
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="MANAGER">MANAGER</option>
            <option value="HR_MANAGER">HR_MANAGER</option>
            <option value="REVIEW_COMMITTEE">REVIEW_COMMITTEE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
