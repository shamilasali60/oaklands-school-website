require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const { Contact, Staff, News, Feature } = require('./models'); 

const app = express();
app.use(cors());
app.use(express.json());

// Serve public files (EXCEPT admin.html, which is handled by a protected route below)
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== SECURITY MIDDLEWARE =====
function requireAdminAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    // Check if the token matches the password in Render
    if (authHeader && authHeader.split(' ')[1] === process.env.ADMIN_PASSWORD) {
        return next(); // Password is correct, allow access
    }
    // If it's a page request, redirect to login. If it's an API request, reject it.
    if (req.accepts('html')) {
        return res.status(401).sendFile(path.join(__dirname, 'public', 'login.html'));
    }
    return res.status(401).json({ message: 'Unauthorized' });
}

// ===== PUBLIC ROUTES (No password needed) =====
app.post('/contact', async (req, res) => {
  try { const newContact = new Contact(req.body); await newContact.save(); res.status(201).json({ message: '✅ Message sent!', data: newContact }); } 
  catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.get('/staff', async (req, res) => {
  try { res.json({ staff: await Staff.find() }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.get('/news', async (req, res) => {
  try { res.json({ news: await News.find().sort({ date: -1 }) }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.get('/features', async (req, res) => {
  try { res.json({ features: await Feature.find() }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});

// ===== PROTECTED ROUTES (Password required) =====
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));

// Protect the admin dashboard page
app.get('/admin', requireAdminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Protect reading messages
app.get('/contact', requireAdminAuth, async (req, res) => {
  try { res.json({ messages: await Contact.find().sort({ date: -1 }) }); } 
  catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.delete('/contact/:id', requireAdminAuth, async (req, res) => {
  try { await Contact.findByIdAndDelete(req.params.id); res.json({ message: '✅ Deleted!' }); } 
  catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});

// Protect Staff management
app.post('/staff', requireAdminAuth, async (req, res) => {
  try { const s = new Staff(req.body); await s.save(); res.status(201).json({ message: '✅ Added!', data: s }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.put('/staff/:id', requireAdminAuth, async (req, res) => {
  try { const s = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ message: '✅ Updated!', data: s }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.delete('/staff/:id', requireAdminAuth, async (req, res) => {
  try { await Staff.findByIdAndDelete(req.params.id); res.json({ message: '✅ Deleted!' }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});

// Protect News management
app.post('/news', requireAdminAuth, async (req, res) => {
  try { const n = new News(req.body); await n.save(); res.status(201).json({ message: '✅ Added!', data: n }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.put('/news/:id', requireAdminAuth, async (req, res) => {
  try { const n = await News.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ message: '✅ Updated!', data: n }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.delete('/news/:id', requireAdminAuth, async (req, res) => {
  try { await News.findByIdAndDelete(req.params.id); res.json({ message: '✅ Deleted!' }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});

// Protect Features management
app.post('/features', requireAdminAuth, async (req, res) => {
  try { const f = new Feature(req.body); await f.save(); res.status(201).json({ message: '✅ Added!', data: f }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.put('/features/:id', requireAdminAuth, async (req, res) => {
  try { const f = await Feature.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ message: '✅ Updated!', data: f }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});
app.delete('/features/:id', requireAdminAuth, async (req, res) => {
  try { await Feature.findByIdAndDelete(req.params.id); res.json({ message: '✅ Deleted!' }); } catch (error) { res.status(500).json({ message: '❌ Error', error }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { console.log(`🚀 Server running on port ${PORT}`); });
