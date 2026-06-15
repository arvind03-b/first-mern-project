const Student = require('../models/studentModel');

exports.addStudent = async (req, res) => {
    try {
        const { studentname, email, address, phone, course } = req.body;
        const newStudent = new Student({ studentname, email, address, phone, course });
        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.error('Error getting students:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentname, email, address, phone, course } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(id, { studentname, email, address, phone, course });
        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Student.findByIdAndDelete(id);
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}