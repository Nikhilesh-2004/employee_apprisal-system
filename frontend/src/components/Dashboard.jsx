import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="navbar">
        <h2>Dashboard ({user.role})</h2>
        <div className="nav-links">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        {user.role === 'ADMIN' && <AdminView />}
        {user.role === 'HR_MANAGER' && <HRView />}
        {user.role === 'MANAGER' && <ManagerView user={user} />}
        {user.role === 'EMPLOYEE' && <EmployeeView user={user} />}
        {user.role === 'REVIEW_COMMITTEE' && <CommitteeView />}
      </div>
    </div>
  );
}

// Sub-components for each role
const AdminView = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="card">
      <h3>Manage Users</h3>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Dept</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.department}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HRView = () => {
  const [cycles, setCycles] = useState([]);
  const [newCycle, setNewCycle] = useState({ cycleName: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetch('http://localhost:8081/api/cycles')
      .then(res => res.json())
      .then(data => setCycles(data));
  }, []);

  const handleCreateCycle = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/api/cycles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCycle)
    }).then(() => window.location.reload());
  };

  const updateStatus = (id, status) => {
    fetch(`http://localhost:8081/api/cycles/${id}/status?status=${status}`, { method: 'PUT' })
      .then(() => window.location.reload());
  };

  return (
    <div className="card">
      <h3>Appraisal Cycles</h3>
      <form onSubmit={handleCreateCycle}>
        <input type="text" placeholder="Cycle Name" onChange={e => setNewCycle({...newCycle, cycleName: e.target.value})} required />
        <input type="date" onChange={e => setNewCycle({...newCycle, startDate: e.target.value})} title="Start Date"/>
        <input type="date" onChange={e => setNewCycle({...newCycle, endDate: e.target.value})} title="End Date" />
        <button type="submit">Create Cycle</button>
      </form>
      <br />
      <table>
        <thead>
          <tr><th>Name</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {cycles.map(c => (
            <tr key={c.id}>
              <td>{c.cycleName}</td>
              <td>{c.status}</td>
              <td>
                {c.status === 'DRAFT' && <button onClick={() => updateStatus(c.id, 'ACTIVE')}>Activate</button>}
                {c.status === 'ACTIVE' && <button onClick={() => updateStatus(c.id, 'COMPLETED')}>Complete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ManagerView = ({ user }) => {
  const [team, setTeam] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8081/api/users/team/${user.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setTeam(Array.isArray(data) ? data : []));
      
    fetch('http://localhost:8081/api/kpis')
      .then(res => res.ok ? res.json() : [])
      .then(data => setKpis(Array.isArray(data) ? data : []));
      
    fetch('http://localhost:8081/api/cycles')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const active = data.find(c => c.status === 'ACTIVE' || c.status === 'MANAGER_REVIEW');
          setActiveCycle(active);
        }
      });
  }, [user.id]);

  const handleSubmit = async () => {
    if (!activeCycle || !selectedEmp) return;
    
    await Promise.all(kpis.map(kpi => {
      if (!ratings[kpi.id]) return Promise.resolve();
      const assessment = {
        manager: { id: user.id },
        employee: { id: selectedEmp.id },
        cycle: { id: activeCycle.id },
        kpi: { id: kpi.id },
        rating: ratings[kpi.id],
        comments: comments[kpi.id] || ""
      };
      
      return fetch('http://localhost:8081/api/manager-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment)
      });
    }));
    
    alert("Manager assessment submitted successfully!");
    setSelectedEmp(null);
    setRatings({});
    setComments({});
  };

  return (
    <div className="card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>My Team Performance</h3>
      {team.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '8px', border: '1px solid #ffeeba' }}>
          <strong>No Team Members Assigned</strong>
          <p>You don't have any employees reporting to you yet. (Manager ID: {user.id})</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>Designation</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {team.map(t => (
              <tr key={t.id} style={{ backgroundColor: selectedEmp?.id === t.id ? '#e7f3ff' : 'transparent' }}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{t.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{t.designation || 'Employee'}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <button 
                    style={{ padding: '6px 12px', backgroundColor: selectedEmp?.id === t.id ? '#0056b3' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => setSelectedEmp(t)}
                  >
                    {selectedEmp?.id === t.id ? 'Viewing' : 'Assess'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedEmp && activeCycle && (
        <div style={{ marginTop: '30px', padding: '25px', border: '2px solid #007bff', borderRadius: '12px', backgroundColor: '#f0f7ff', boxShadow: '0 8px 16px rgba(0,123,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, color: '#0056b3', fontSize: '1.4em' }}>Performance Assessment: {selectedEmp.name}</h4>
            <span style={{ padding: '5px 12px', backgroundColor: '#cfe2f3', color: '#004a99', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold' }}>{activeCycle.cycleName}</span>
          </div>
          {kpis.map(kpi => (
            <div key={kpi.id} style={{ marginBottom: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{kpi.kpiName} <span style={{ fontSize: '0.8em', color: '#666', fontWeight: 'normal' }}>({kpi.category})</span></div>
              <div style={{ color: '#007bff', margin: '5px 0' }}>Weightage: {kpi.weightage}%</div>
              
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', fontWeight: 'bold' }}>Manager Score (1-5):</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }}
                  value={ratings[kpi.id] || ''} 
                  onChange={e => setRatings({...ratings, [kpi.id]: e.target.value})}
                >
                  <option value="">Select Rating</option>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <textarea 
                  placeholder="Manager Comments" 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
                  value={comments[kpi.id] || ''} 
                  onChange={e => setComments({...comments, [kpi.id]: e.target.value})}
                ></textarea>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              style={{ flex: 2, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} 
              onClick={handleSubmit}
            >
              Submit Manager Assessment
            </button>
            <button 
              style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              onClick={() => setSelectedEmp(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeeView = ({ user }) => {
  const [kpis, setKpis] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8081/api/kpis')
      .then(res => res.ok ? res.json() : [])
      .then(data => setKpis(Array.isArray(data) ? data : []))
      .catch(() => setKpis([]));

    fetch('http://localhost:8081/api/cycles')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const active = data.find(c => c.status === 'ACTIVE' || c.status === 'SELF_ASSESSMENT');
          setActiveCycle(active);
          
          if (active) {
            fetch(`http://localhost:8081/api/self-assessments/status/${user.id}/${active.id}`)
              .then(res => res.json())
              .then(data => setIsSubmitted(data));
          }
        } else {
          setActiveCycle(null);
        }
      })
      .catch(() => setActiveCycle(null));
  }, [user.id]);

  const handleSubmit = async () => {
    if (!activeCycle) return;
    
    await Promise.all(kpis.map(kpi => {
      if (!ratings[kpi.id]) return Promise.resolve();
      const assessment = {
        employee: { id: user.id },
        cycle: { id: activeCycle.id },
        kpi: { id: kpi.id },
        rating: ratings[kpi.id],
        comments: comments[kpi.id] || ""
      };
      
      return fetch('http://localhost:8081/api/self-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment)
      });
    }));
    
    alert("Self assessment submitted successfully!");
  };

  if (!activeCycle) return <div className="card">No active appraisal cycle found.</div>;

  if (isSubmitted) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px', backgroundColor: '#e7f3ff', border: '2px solid #b3d7ff', borderRadius: '15px' }}>
        <h2 style={{ color: '#0056b3' }}>✓ Self Assessment Submitted Successfully!</h2>
        <p style={{ color: '#666', fontSize: '1.1em' }}>You have already completed your self-appraisal for the <strong>{activeCycle.cycleName}</strong> cycle.</p>
        <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#888' }}>
          Your responses have been recorded and sent to your manager for review.
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h3 style={{ borderBottom: '2px solid #4a90e2', paddingBottom: '10px', color: '#4a90e2' }}>Self Assessment Form</h3>
      <p style={{ fontWeight: 'bold', color: '#666' }}>Appraisal Cycle: {activeCycle.cycleName}</p>
      
      <div style={{ marginTop: '20px' }}>
        {kpis.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No KPIs available. Please contact HR.</p>
        ) : (
          kpis.map(kpi => (
            <div key={kpi.id} style={{ marginBottom: '25px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>{kpi.kpiName}</div>
              <div style={{ color: '#777', fontSize: '0.9em', marginBottom: '10px' }}>Category: {kpi.category} | Weightage: {kpi.weightage}%</div>
              
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Your Rating (1-5):</label>
                <select 
                  style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px', backgroundColor: 'white' }}
                  value={ratings[kpi.id] || ''} 
                  onChange={e => setRatings({...ratings, [kpi.id]: e.target.value})}
                >
                  <option value="">-- Choose Rating --</option>
                  <option value="1">1 - Unsatisfactory</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
                
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Self Comments:</label>
                <textarea 
                  placeholder="Justify your rating here..." 
                  style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
                  value={comments[kpi.id] || ''} 
                  onChange={e => setComments({...comments, [kpi.id]: e.target.value})}
                ></textarea>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button 
        style={{ width: '100%', padding: '15px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1em', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        onClick={handleSubmit}
        disabled={kpis.length === 0}
      >
        Submit My Assessment
      </button>
    </div>
  );
};

const CommitteeView = () => {
  const [users, setUsers] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [finalRating, setFinalRating] = useState('');
  const [comments, setComments] = useState('');
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/users')
      .then(res => res.ok ? res.json() : [])
      .then(data => setUsers(Array.isArray(data) ? data.filter(u => u.role === 'EMPLOYEE') : []));
      
    fetch('http://localhost:8081/api/cycles')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const active = data.find(c => c.status === 'ACTIVE' || c.status === 'COMMITTEE_REVIEW');
          setActiveCycle(active);
          
          if (active) {
            fetch(`http://localhost:8081/api/summaries/${active.id}`)
              .then(sres => sres.ok ? sres.json() : [])
              .then(sdata => setSummaries(Array.isArray(sdata) ? sdata : []));
          }
        }
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeCycle || !selectedEmp) return;
    
    const review = {
      employee: { id: selectedEmp.id },
      cycle: { id: activeCycle.id },
      finalRating: parseFloat(finalRating),
      comments: comments
    };
    
    fetch('http://localhost:8081/api/committee-reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    }).then(() => {
      alert("Committee review submitted successfully!");
      setSelectedEmp(null);
      setFinalRating('');
      setComments('');
      
      fetch(`http://localhost:8081/api/summaries/${activeCycle.id}`)
        .then(sres => sres.ok ? sres.json() : [])
        .then(sdata => setSummaries(Array.isArray(sdata) ? sdata : []));
    });
  };

  return (
    <div className="card">
      <h3>Committee Review Panel</h3>
      {!activeCycle ? <p>No active cycle found.</p> : (
        <div>
          <p>Active Cycle: {activeCycle.cycleName}</p>
          
          <h4>Employees</h4>
          <table>
            <thead>
              <tr><th>Name</th><th>Dept</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.department}</td>
                  <td><button onClick={() => setSelectedEmp(u)}>Final Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {selectedEmp && (
            <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc' }}>
              <h4>Reviewing: {selectedEmp.name}</h4>
              <input type="number" step="0.1" min="1" max="5" placeholder="Final Rating (1-5)" 
                value={finalRating} onChange={e => setFinalRating(e.target.value)} required />
              <textarea placeholder="Committee Comments" style={{ width: '100%', marginTop: '5px' }}
                value={comments} onChange={e => setComments(e.target.value)} required></textarea>
              <br />
              <button type="submit" style={{ marginTop: '10px' }}>Submit Decision</button>
              <button type="button" onClick={() => setSelectedEmp(null)} style={{ marginLeft: '10px' }}>Cancel</button>
            </form>
          )}

          <h4 style={{ marginTop: '30px' }}>Appraisal Summaries</h4>
          {summaries.length === 0 ? <p>No summaries generated yet.</p> : (
             <table>
               <thead>
                 <tr><th>Emp ID</th><th>Self Score</th><th>Manager Score</th><th>Final Score</th><th>Promoted?</th></tr>
               </thead>
               <tbody>
                 {summaries.map(s => (
                   <tr key={s.id}>
                     <td>{s.employee?.id}</td>
                     <td>{s.selfScore?.toFixed(2)}</td>
                     <td>{s.managerScore?.toFixed(2)}</td>
                     <td>{s.finalScore?.toFixed(2)}</td>
                     <td>{s.promotionRecommended ? 'Yes' : 'No'}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
