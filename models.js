const mongoose = require('mongoose');

// 1. Model for the "Contact Us" form
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

// 2. Model for the Staff/Teacher Directory
const staffSchema = new mongoose.Schema({
  name: String,
  role: String, // e.g., "Headteacher", "Math Teacher"
  photoUrl: String, // Link to an image
  bio: String
});

// Create the models
const Contact = mongoose.model('Contact', contactSchema);
const Staff = mongoose.model('Staff', staffSchema);

// Export them so we can use them in server.js
module.exports = { Contact, Staff };
// 3. Model for News & Events
const newsSchema = new mongoose.Schema({
  title: String,
  date: { type: Date, default: Date.now },
  description: String,
  type: String // e.g., "Event", "Announcement", "Sports"
});

const News = mongoose.model('News', newsSchema);

// Export all models
module.exports = { Contact, Staff, News };
