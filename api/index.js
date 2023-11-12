import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.router.js";

//database connection
main();
const app = express();

//body parser
app.use(express.json());

//routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

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
