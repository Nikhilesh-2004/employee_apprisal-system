import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  
  // Basic form states
  const [empFormData, setEmpFormData] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
  const [assessmentData, setAssessmentData] = useState({ employeeId: '', kpiId: '1', rating: '', comments: '' });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(loggedInUser));
      fetchEmployees();
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ADMIN Action: Add Employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/employees', empFormData);
      setMessage('Employee created successfully!');
      fetchEmployees();
    } catch (err) {
      setMessage('Error creating employee.');
    }
  };

  // ADMIN Action: Delete Employee
  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/employees/${id}`);
      setMessage('Employee deleted!');
      fetchEmployees();
    } catch (err) {
      setMessage('Error deleting employee.');
    }
  };

  // Submit Appraisals
  const handleAssessmentSubmit = async (e, endpoint) => {
    e.preventDefault();
    try {
      const payload = {
        employeeId: assessmentData.employeeId || user.id,
        appraisalCycleId: 1, // hardcoded cycle for simplicity
        kpiId: assessmentData.kpiId,
        comments: assessmentData.comments,
      };
      // Different objects depending on endpoint
      if (endpoint === 'self-assessment') {
        payload.selfRating = assessmentData.rating;
        payload.selfComments = assessmentData.comments;
      } else if (endpoint === 'manager-assessment') {
        payload.managerId = user.id;
        payload.managerRating = assessmentData.rating;
        payload.managerComments = assessmentData.comments;
      } else if (endpoint === 'committee-review') {
        payload.finalRating = assessmentData.rating;
        payload.committeeRemarks = assessmentData.comments;
        payload.reviewedBy = user.id;
      }

      await axios.post(`http://localhost:8081/api/${endpoint}`, payload);
      setMessage(`Successfully submitted ${endpoint}!`);
    } catch (err) {
      setMessage(`Error submitting ${endpoint}.`);
    }
  };

  if (!user) return <p>Loading...</p>;

  // Different UI sections depending on role
  const renderDashboardContent = () => {
    switch (user.role) {
      case 'ADMIN':
        return (
          <div>
            <h3>Admin Space - Manage Users</h3>
            <form onSubmit={handleAddEmployee} style={{marginBottom: '20px'}}>
              <h4>Add New Employee</h4>
              <input type="text" placeholder="Name" value={empFormData.name} onChange={e=>setEmpFormData({...empFormData, name: e.target.value})} required/>
              <input type="email" placeholder="Email" value={empFormData.email} onChange={e=>setEmpFormData({...empFormData, email: e.target.value})} required/>
              <input type="password" placeholder="Password" value={empFormData.password} onChange={e=>setEmpFormData({...empFormData, password: e.target.value})} required/>
              <button type="submit">Create Employee</button>
            </form>
            <h4>All Employees</h4>
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td><td>{emp.name}</td><td>{emp.email}</td><td>{emp.role}</td>
                    <td><button onClick={() => handleDeleteEmployee(emp.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'MANAGER':
        return (
          <div>
            <h3>Manager Space - Submit Reviews</h3>
            <form onSubmit={(e) => handleAssessmentSubmit(e, 'manager-assessment')}>
              <label>Employee ID:</label>
              <input type="number" required value={assessmentData.employeeId} onChange={e=>setAssessmentData({...assessmentData, employeeId: e.target.value})} />
              <label>Rating (1-5):</label>
              <input type="number" min="1" max="5" required value={assessmentData.rating} onChange={e=>setAssessmentData({...assessmentData, rating: e.target.value})} />
              <label>Manager Comments:</label>
              <textarea required value={assessmentData.comments} onChange={e=>setAssessmentData({...assessmentData, comments: e.target.value})}></textarea>
              <button type="submit">Submit Assessment</button>
            </form>
            <h4>Your Team (Employees available)</h4>
            <ul>{employees.map(e => <li key={e.id}>ID: {e.id} - {e.name}</li>)}</ul>
          </div>
        );
      
      case 'REVIEW_COMMITTEE':
        return (
          <div>
            <h3>Committee Space - Final Ratings</h3>
            <form onSubmit={(e) => handleAssessmentSubmit(e, 'committee-review')}>
              <label>Employee ID:</label>
              <input type="number" required value={assessmentData.employeeId} onChange={e=>setAssessmentData({...assessmentData, employeeId: e.target.value})} />
              <label>Final Rating (1-5):</label>
              <input type="number" min="1" max="5" required value={assessmentData.rating} onChange={e=>setAssessmentData({...assessmentData, rating: e.target.value})} />
              <label>Committee Remarks:</label>
              <textarea required value={assessmentData.comments} onChange={e=>setAssessmentData({...assessmentData, comments: e.target.value})}></textarea>
              <button type="submit">Submit Final Review</button>
            </form>
          </div>
        );

      case 'HR_MANAGER':
        return (
          <div>
            <h3>HR Manager Space</h3>
            <p>Appraisal Cycle is primarily managed in the backend DB automatically for this simple project version.</p>
            <h4>All Employees in System</h4>
            <ul>{employees.map(e => <li key={e.id}>{e.name} ({e.email})</li>)}</ul>
          </div>
        );

      case 'EMPLOYEE':
      default:
        return (
          <div>
            <h3>Employee Space - Self Assessment</h3>
            <form onSubmit={(e) => handleAssessmentSubmit(e, 'self-assessment')}>
              <p>Your ID: {user.id}</p>
              <label>Your Rating (1-5):</label>
              <input type="number" min="1" max="5" required value={assessmentData.rating} onChange={e=>setAssessmentData({...assessmentData, rating: e.target.value})} />
              <label>Self Comments:</label>
              <textarea required value={assessmentData.comments} onChange={e=>setAssessmentData({...assessmentData, comments: e.target.value})}></textarea>
              <button type="submit">Submit Self Assessment</button>
            </form>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="nav">
        <h2>Welcome, {user.name} ({user.role})</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {message && <div style={{padding: '10px', backgroundColor: '#e2f0d9', color: 'green', marginBottom: '15px'}}>{message}</div>}
      {renderDashboardContent()}
    </div>
  );
}

export default Dashboard;
