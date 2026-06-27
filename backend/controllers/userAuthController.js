// backend/controllers/userAuthController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';
import { v2 as cloudinary } from 'cloudinary';

export const registerCandidate = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file; // optional profile pic

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    let imageUrl = '';
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path);
      imageUrl = upload.secure_url;
    }

    const user = await User.create({ name, email, password: hashed, image: imageUrl });

    res.status(201).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, image: user.image },
      token: generateToken(user._id, 'candidate')
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginCandidate = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, image: user.image },
      token: generateToken(user._id, 'candidate')
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};