import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Detail from './models/details.js'; // import with .js extension
// import { CohereClient } from 'cohere-ai';
import dotenv from "dotenv"
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import jwt from "jsonwebtoken";


const app = express();
const PORT = process.env.port||3000;

app.use(cors());
app.use(express.json()); // to parse JSON body

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// MongoDB connection
console.log("process",process.env.URI)
mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => console.log('MongoDB connected successfully! 🎉'))
  .catch(err => console.error('MongoDB connection error:', err));

// Home route
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// const cohere = new CohereClient({
//   token: process.env.COHERE_API_KEY,
// });

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username or password missing
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
    }

    // Find user by username
 const user = await Detail.findOne({ username });

if (!user) {
  return res.status(401).json({
    success: false,
    message: "User not found",
  });
}

// ⚠️ Plain-text check for now (bcrypt later)
if (user.password !== password) {
  return res.status(401).json({
    success: false,
    message: "Incorrect password",
  });
}

// ✅ CREATE JWT
const token = jwt.sign(
  {
    id: user._id,
    username: user.username,
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// ✅ SEND TOKEN INSTEAD OF MESSAGE
res.json({
  success: true,
  token,
});

       if (user.password !== password) {
      return res.json({
        success: false,
        message: 'Incorrect password.',
      });
    }

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message,
    });
  }
});


// Add detail route
app.post('/addDetail', async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Map frontend field to schema field
    const newDetail = new Detail({
      name,
      username,
      email,
      password: password
    });

    await newDetail.save();

    res.status(201).json({ message: 'Data saved successfully!', data: newDetail });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: 'Error saving data', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
