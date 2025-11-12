import mongoose from 'mongoose';

// Define the Schema for the user details
const detailsSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true, // Crucial for using username as a unique identifier
    trim: true    // Good practice to remove leading/trailing whitespace
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // Good practice for emails
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  }
}, {
  // Add timestamps for automatic 'createdAt' and 'updatedAt' fields
  timestamps: true 
});

// Create the Mongoose Model
// Mongoose will create a collection named 'details' (lowercase and pluralized) 
// based on the singular model name 'Detail'.
const Detail = mongoose.model('Detail', detailsSchema);

export default Detail;

// Note: In a real application, you must use a library like 'bcrypt' 
// to hash and salt the password before saving it to the database.