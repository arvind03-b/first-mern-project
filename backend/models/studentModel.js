const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentname: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Student', studentSchema)