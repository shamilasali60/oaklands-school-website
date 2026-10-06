require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const { Contact, Staff, News, Feature } = require('./models'); 

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

// Contact Routes
app.post('/contact', async (req, res) => {
  try { const newContact = new Contact(req.body); await newContact.save(); res.status(201).json({ message: '✅ Message sent!', data: newContact }); } 
  catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.get('/contact', async (req, res) => {
  try { res.json({ messages: await Contact.find().sort({ date: -1 }) }); } 
  catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.delete('/contact/:id', async (req, res) => {
  try { await Contact.findByIdAndDelete(req.params.id); res.json({ message: '✅ Message deleted!' }); } 
  catch (error) { res.status(500).json({ message: ' Error', error }); }
});

// Staff Routes
app.get('/staff', async (req, res) => {
  try { res.json({ staff: await Staff.find() }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.post('/staff', async (req, res) => {
  try { const s = new Staff(req.body); await s.save(); res.status(201).json({ message: '✅ Added!', data: s }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.put('/staff/:id', async (req, res) => {
  try { const s = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ message: '✅ Updated!', data: s }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.delete('/staff/:id', async (req, res) => {
  try { await Staff.findByIdAndDelete(req.params.id); res.json({ message: '✅ Deleted!' }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});

// News Routes
app.get('/news', async (req, res) => {
  try { res.json({ news: await News.find().sort({ date: -1 }) }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.post('/news', async (req, res) => {
  try { const n = new News(req.body); await n.save(); res.status(201).json({ message: '✅ Added!', data: n }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
// NEW: Update News Route
app.put('/news/:id', async (req, res) => {
  try { const n = await News.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ message: '✅ Updated!', data: n }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
// NEW: Delete News Route
app.delete('/news/:id', async (req, res) => {
  try { await News.findByIdAndDelete(req.params.id); res.json({ message: '✅ Deleted!' }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});

// Feature Routes
app.get('/features', async (req, res) => {
  try { res.json({ features: await Feature.find() }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.post('/features', async (req, res) => {
  try { const f = new Feature(req.body); await f.save(); res.status(201).json({ message: '✅ Added!', data: f }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.put('/features/:id', async (req, res) => {
  try { const f = await Feature.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ message: '✅ Updated!', data: f }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.delete('/features/:id', async (req, res) => {
  try { await Feature.findByIdAndDelete(req.params.id); res.json({ message: '✅ Deleted!' }); } catch (error) { res.status(500).json({ message: ' Error', error }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { console.log(`🚀 Server running on port ${PORT}`); });
