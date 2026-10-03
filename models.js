const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String, email: String, message: String, date: { type: Date, default: Date.now }
});

const staffSchema = new mongoose.Schema({
  name: String, role: String, photoUrl: String, bio: String
});

const newsSchema = new mongoose.Schema({
  title: String, date: { type: Date, default: Date.now }, description: String, type: String
});

// NEW: Model for "Why Choose Oaklands" Features
const featureSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: { type: String, default: 'fa-star' } // Stores the FontAwesome icon name
});

const Contact = mongoose.model('Contact', contactSchema);
const Staff = mongoose.model('Staff', staffSchema);
const News = mongoose.model('News', newsSchema);
const Feature = mongoose.model('Feature', featureSchema);

module.exports = { Contact, Staff, News, Feature };
