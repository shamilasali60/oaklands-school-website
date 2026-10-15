const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String, email: String, message: String, date: { type: Date, default: Date.now }
});

const staffSchema = new mongoose.Schema({
  name: String, role: String, photoUrl: String, bio: String, department: { type: String, default: 'Primary' }
});

const newsSchema = new mongoose.Schema({
  title: String, date: { type: Date, default: Date.now }, description: String, type: String, eventUrl: String
});

const featureSchema = new mongoose.Schema({
  title: String, description: String, icon: { type: String, default: 'fa-star' }
});

// NEW: Gallery Schema
const gallerySchema = new mongoose.Schema({
  imageUrl: String,
  caption: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);
const Staff = mongoose.model('Staff', staffSchema);
const News = mongoose.model('News', newsSchema);
const Feature = mongoose.model('Feature', featureSchema);
const Gallery = mongoose.model('Gallery', gallerySchema); // NEW

module.exports = { Contact, Staff, News, Feature, Gallery }; // UPDATED
