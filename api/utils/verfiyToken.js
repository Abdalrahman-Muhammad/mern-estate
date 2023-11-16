import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verfiyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(new errorHandler(401, "Unautorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new errorHandler(403, "forbidden"));
    req.user = user;
    next();
  });
};
