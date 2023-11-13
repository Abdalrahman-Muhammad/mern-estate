import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credential!!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    const { password: hashedPassword, ...userInfo } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userInfo);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, photo: avatar, name } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
      });
      const { password: hashedPassword, ...userInfo } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(userInfo);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
      const username =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
        avatar,
      });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: newUserPassword, ...newUserInfo } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(newUserInfo);
    }
  } catch (error) {
    next(error);
  }
};
