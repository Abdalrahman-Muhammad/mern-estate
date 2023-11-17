import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
export const test = (req, res) => {
  res.json({ message: `hello from user route` });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id != req.params.id)
    return next(errorHandler(401, "you can only update your own account"));

  try {
    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          avatar: req.body.avatar,
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
        },
      },
      {
        new: true,
      }
    );
    const { password, ...userInfo } = updatedUser._doc;
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id != req.params.id)
    return next(errorHandler(401, "you can only delete your own account"));
  try {
    const id = req.user.id;
    await User.findByIdAndDelete(id);
    res.clearCookie("access_token");
    res.status(200).json("user has been deleted");
  } catch (error) {
    next(error);
  }
};
