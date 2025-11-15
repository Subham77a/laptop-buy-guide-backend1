import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Detail from './models/details.js'; // import with .js extension
// import { CohereClient } from 'cohere-ai';
import dotenv from "dotenv"
dotenv.config();


const app = express();
const PORT = process.env.port||3000;

app.use(cors(process.env.URI));
app.use(express.json()); // to parse JSON body


// MongoDB connection
console.log("process",process.env.MONGO_DB_URI)
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
      return res.json({
        success: false,
        message: 'User not found.',
      });
    }

    // Compare passwords (plain text for now — later use bcrypt)
    if (user.password !== password) {
      return res.json({
        success: false,
        message: 'Incorrect password.',
      });
    }

    // ✅ Login successful — send only safe user info
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        name: user.name,
        username: user.username,
      },
    });

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

// Add skill route
// app.post('/skills', async (req, res) => {
//   try {
//     const { username, skills } = req.body;

//     if (!username || !skills || !Array.isArray(skills) || skills.length === 0) {
//       return res.status(400).json({ success: false, message: 'Username and at least one skill are required.' });
//     }

//     await Skill.updateOne(
//       { username },
//       { $push: { skills: { $each: skills } } },
//       { upsert: true } // create if not exists
//     );

//     res.status(201).json({ success: true, message: 'Skills saved successfully!' });
//   } catch (error) {
//     console.error('Error saving skills:', error);
//     res.status(500).json({ success: false, message: 'Error saving skills', error: error.message });
//   }
// });


// app.get('/dashboard', async (req, res) => {
//   const prompt = "I know React JS, JavaScript, Node.js. Suggest skills to learn next with reasons.";

//   try {
//     if (!process.env.COHERE_API_KEY) {
//       return res.status(500).json({ error: 'Cohere API key not set' });
//     }

//     const generate = await cohere.generate({
//       model: 'command-xlarge-nightly',
//       prompt,
//       max_tokens: 500,
//       temperature: 0.7,
//     });

//     if (generate.generations && generate.generations.length > 0) {
//       res.json({ result: generate.generations[0].text });
//     } else {
//       res.status(500).json({ error: 'No generations returned from Cohere' });
//     }
//   } catch (error) {
//     console.error('Cohere API error:', error);
//     res.status(500).json({ error: 'Error generating AI response' });
//   }
// });


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
