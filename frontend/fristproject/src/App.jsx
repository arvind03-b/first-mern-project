import React from 'react';
import Home from './pages/home';
import AddStudent from './pages/add-student';

function App() {
  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px 0' }}>
      <Home />

      <AddStudent />
    </div>
  );
}

export default App;
