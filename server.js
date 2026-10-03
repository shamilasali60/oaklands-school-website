require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
// FIX: We added 'News' to this list so the server knows about it!
const { Contact, Staff, News } = require('./models'); 

const app = express();
app.use(cors());
app.use(express.json());

// Tell Express to serve the files in the main folder
app.use(express.static(__dirname));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== API ROUTES =====

// Serve the Admin Dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 1. POST /contact - Save a contact form submission
app.post('/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: '✅ Message sent successfully!', data: newContact });
  } catch (error) {
    res.status(500).json({ message: '❌ Error saving message', error });
  }
});

// 2. GET /contact - Get all contact messages
app.get('/contact', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: '❌ Error fetching messages', error });
  }
});

// 3. GET /staff - Get all staff members
app.get('/staff', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ message: '❌ Error fetching staff', error });
  }
});

// 4. POST /staff - Add a new staff member
app.post('/staff', async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    await newStaff.save();
    res.status(201).json({ message: '✅ Staff added successfully!', data: newStaff });
  } catch (error) {
    res.status(500).json({ message: '❌ Error adding staff', error });
  }
});

// 5. GET /news - Get all news items
app.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json({ news });
  } catch (error) {
    res.status(500).json({ message: '❌ Error fetching news', error });
  }
});

// 6. POST /news - Add a new news item
app.post('/news', async (req, res) => {
  try {
    const newNews = new News(req.body);
    await newNews.save();
    res.status(201).json({ message: '✅ News added successfully!', data: newNews });
  } catch (error) {
    res.status(500).json({ message: '❌ Error adding news', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Oaklands Server running on port ${PORT}`);
});
