import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

main();
const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

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
