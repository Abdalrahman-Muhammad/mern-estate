import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "user created successfully!" });
  } catch (error) {
    console.log("🚀 ~ file: auth.controller.js:10 ~ signup ~ error:", error);
    res.status(500).json(error.message);
  }
};
