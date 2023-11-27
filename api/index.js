import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.router.js";
import listingRouter from "./routes/listing.router.js";

//database connection
main();
const __dirname = path.resolve();
const app = express();

//body parser
app.use(express.json());

app.use(cookieParser());

//routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, message, statusCode });
});

//server connection
app.listen(process.env.PORT_NUM, () => {
  console.log(`server running on port number ${process.env.PORT_NUM}`);
});

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`DB connected successfully`);
  } catch (error) {
    console.log("error while connecting to database:", error.message);
  }
}
