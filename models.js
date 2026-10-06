const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String, email: String, message: String, date: { type: Date, default: Date.now }
});

const staffSchema = new mongoose.Schema({
  name: String, role: String, photoUrl: String, bio: String
});

// UPDATED: Added eventUrl to the news schema
const newsSchema = new mongoose.Schema({
  title: String, 
  date: { type: Date, default: Date.now }, 
  description: String, 
  type: String,
  eventUrl: String // Optional link for the event
});

const featureSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: { type: String, default: 'fa-star' }
});

const Contact = mongoose.model('Contact', contactSchema);
const Staff = mongoose.model('Staff', staffSchema);
const News = mongoose.model('News', newsSchema);
const Feature = mongoose.model('Feature', featureSchema);

module.exports = { Contact, Staff, News, Feature };
