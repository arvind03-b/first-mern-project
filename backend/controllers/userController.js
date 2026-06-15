const User = require('../models/userModel');

// 1. Save a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    // Simple validation
    if (!name || !email || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newUser = new User({
      name,
      email,
      address
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully!', user: savedUser });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 2. Fetch all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
