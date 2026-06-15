import React, { useState, useEffect } from 'react';
import './home.css';

function Home() {
  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Users list state
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Database se users fetch nahi ho paye.');
      }
    } catch (err) {
      console.error(err);
      setError('Backend server connect nahi ho raha hai.');
    }
  };

  // Run fetchUsers when page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Check if fields are empty
    if (!name || !email || !address) {
      setError('Sabhi fields ko bharna jaroori hai!');
      return;
    }

    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, address }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User successfully register ho gaya!');
        // Clear inputs
        setName('');
        setEmail('');
        setAddress('');
        // Refresh users list
        fetchUsers();
      } else {
        setError(data.error || 'User register karne me error aaya.');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error. Data save nahi ho paya.');
    }
  };

  return (
    <div className="home-page">
      <div className="form-container">
        <h2>MERN Simple Registration Form</h2>
        <p className="description">Apna database connect check karne ke liye form bharein:</p>
        
        {/* Success & Error alerts */}
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name:</label>
            <input 
              type="text" 
              placeholder="Apna naam likhein" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Email Address:</label>
            <input 
              type="email" 
              placeholder="Apna email likhein" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Home Address:</label>
            <input 
              type="text" 
              placeholder="Apna address likhein" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </div>

          <button type="submit" className="submit-btn">Save to Database</button>
        </form>
      </div>

      {/* Users table */}
      <div className="users-table-container">
        <h2>Registered Users List (Database Se Live)</h2>
        {users.length === 0 ? (
          <p className="no-data">Koi bhi user registered nahi hai. Form bharkar entry add karein!</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Home;