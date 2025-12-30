import jwt from "jsonwebtoken";
import Detail from "../models/details.js";

// ✅ REGISTER
export const register = async (req, res) => {
  const { username, password, name } = req.body;

  try {
    const existingUser = await Detail.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await Detail.create({ username, password, name });

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await Detail.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ success: true, token });
};

// ✅ VALIDATE TOKEN
export const validateToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};
