import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  console.log(`inside`);
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "user created successfully!" });
  } catch (error) {
    next(error);
  }
};
