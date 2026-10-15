const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String, email: String, message: String, date: { type: Date, default: Date.now }
});

// UPDATED: Added 'department' field
const staffSchema = new mongoose.Schema({
  name: String, 
  role: String, 
  photoUrl: String, 
  bio: String,
  department: { type: String, default: 'Primary' } 
});

const newsSchema = new mongoose.Schema({
  title: String, date: { type: Date, default: Date.now }, description: String, type: String, eventUrl: String
});

const featureSchema = new mongoose.Schema({
  title: String, description: String, icon: { type: String, default: 'fa-star' }
});

const Contact = mongoose.model('Contact', contactSchema);
const Staff = mongoose.model('Staff', staffSchema);
const News = mongoose.model('News', newsSchema);
const Feature = mongoose.model('Feature', featureSchema);

module.exports = { Contact, Staff, News, Feature };
