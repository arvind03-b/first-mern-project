import React, { useState, useEffect } from 'react';
import './add-student.css';

function AddStudent() {
    // Form field states
    const [studentName, setStudentName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [course, setCourse] = useState('');

    // Feedback message states
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Students list state
    const [students, setStudents] = useState([]);

    // Edit tracking state
    const [editingId, setEditingId] = useState(null);

    // Fetch students list from backend
    const getStudents = async () => {
        try {
            const response = await fetch('/student');
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('Error getting students:', error);
        }
    };

    // Load list on page mount
    useEffect(() => {
        getStudents();
    }, []);

    // Delete student handler
    const deleteStudent = async (id) => {
        if (window.confirm('are you sure want to delete?')) {
            try {
                const response = await fetch(`/student/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setMessage('Student successfully delete ho gaya!');
                    getStudents(); // Refresh the list automatically
                } else {
                    setError('Delete karne me error aaya.');
                }
            } catch (error) {
                console.error('Error deleting student:', error);
                setError('Server connection error. Delete nahi ho paya.');
            }
        }
    };

    // Trigger edit mode: load student data into form fields
    const startEdit = (student) => {
        setEditingId(student._id);
        setStudentName(student.studentname);
        setEmail(student.email);
        setAddress(student.address);
        setPhone(student.phone);
        setCourse(student.course);
        setMessage('Student data load ho gaya hai, ab aap badlaav karke update kar sakte hain.');
        setError('');
    };

    // Cancel edit mode
    const cancelEdit = () => {
        setEditingId(null);
        setStudentName('');
        setEmail('');
        setAddress('');
        setPhone('');
        setCourse('');
        setMessage('');
        setError('');
    };

    // Form submission handler (Handles both Add [POST] and Update [PUT])
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!studentName || !email || !address || !phone || !course) {
            setError('Sabhi fields ko bharna jaroori hai!');
            return;
        }

        try {
            const isEditMode = !!editingId;
            const url = isEditMode
                ? `/student/${editingId}`
                : `/student`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentname: studentName, email, address, phone, course }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(isEditMode ? 'Student successfully update ho gaya!' : 'Student successfully register ho gaya!');
                // Clear all input states
                setStudentName('');
                setEmail('');
                setAddress('');
                setPhone('');
                setCourse('');
                setEditingId(null); // Reset edit mode

                // Fetch the updated list immediately without manual refresh
                getStudents();
            } else {
                setError(data.message || 'Operation failed.');
            }
        } catch (err) {
            console.error(err);
            setError('Server connection error. Data save nahi ho paya.');
        }
    };

    return (
        <div className="add-student-container">
            <h1>{editingId ? 'Update Student Details' : 'Add Student'}</h1>

            {/* Feedback messages */}
            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Student Name:</label>
                    <input
                        type="text"
                        placeholder="Enter your Name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Student Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Student Address:</label>
                    <input
                        type="text"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Student Phone:</label>
                    <input
                        type="text"
                        placeholder="Enter your Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Student Course:</label>
                    <input
                        type="text"
                        placeholder="Enter your Course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="submit-btn">
                        {editingId ? 'Update Data' : 'Add to DataBase'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="submit-btn" style={{ backgroundColor: '#6b7280' }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <table style={{ marginTop: '30px' }}>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student Email</th>
                        <th>Student Address</th>
                        <th>Student Phone</th>
                        <th>Student Course</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Koi students list me nahi hain.</td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.studentname}</td>
                                <td>{student.email}</td>
                                <td>{student.address}</td>
                                <td>{student.phone}</td>
                                <td>{student.course}</td>
                                <td>
                                    <button onClick={() => startEdit(student)} style={{ marginRight: '5px' }}>Edit</button>
                                    <button onClick={() => deleteStudent(student._id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AddStudent;