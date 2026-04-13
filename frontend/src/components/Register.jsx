import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    department: '',
    designation: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.managerId) {
        payload.manager = { id: payload.managerId };
        delete payload.managerId;
    }
    
    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert('Registration successful');
        navigate('/login');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
          <option value="EMPLOYEE">Employee</option>
          <option value="MANAGER">Manager</option>
          <option value="HR_MANAGER">HR Manager</option>
          <option value="REVIEW_COMMITTEE">Review Committee</option>
          <option value="ADMIN">Admin</option>
        </select>
        <input type="text" placeholder="Department" onChange={(e) => setFormData({...formData, department: e.target.value})} />
        <input type="text" placeholder="Designation" onChange={(e) => setFormData({...formData, designation: e.target.value})} />
        {formData.role === 'EMPLOYEE' && (
          <input 
            type="number" 
            placeholder="Manager ID" 
            onChange={(e) => setFormData({...formData, managerId: e.target.value})} 
          />
        )}
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;
