require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const { Contact, Staff, News } = require('./models'); 

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== API ROUTES =====

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 1. POST /contact
app.post('/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: '✅ Message sent successfully!', data: newContact });
  } catch (error) { res.status(500).json({ message: '❌ Error saving message', error }); }
});

// 2. GET /contact
app.get('/contact', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    res.json({ messages });
  } catch (error) { res.status(500).json({ message: '❌ Error fetching messages', error }); }
});

// 3. GET /staff
app.get('/staff', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json({ staff });
  } catch (error) { res.status(500).json({ message: ' Error fetching staff', error }); }
});

// 4. POST /staff (Add)
app.post('/staff', async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    await newStaff.save();
    res.status(201).json({ message: '✅ Staff added successfully!', data: newStaff });
  } catch (error) { res.status(500).json({ message: '❌ Error adding staff', error }); }
});

// NEW: PUT /staff/:id (Edit)
app.put('/staff/:id', async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: '✅ Staff updated successfully!', data: updatedStaff });
  } catch (error) { res.status(500).json({ message: '❌ Error updating staff', error }); }
});

// NEW: DELETE /staff/:id (Delete)
app.delete('/staff/:id', async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Staff deleted successfully!' });
  } catch (error) { res.status(500).json({ message: ' Error deleting staff', error }); }
});

// 5. GET /news
app.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json({ news });
  } catch (error) { res.status(500).json({ message: '❌ Error fetching news', error }); }
});

// 6. POST /news
app.post('/news', async (req, res) => {
  try {
    const newNews = new News(req.body);
    await newNews.save();
    res.status(201).json({ message: '✅ News added successfully!', data: newNews });
  } catch (error) { res.status(500).json({ message: '❌ Error adding news', error }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Oaklands Server running on port ${PORT}`);
});
