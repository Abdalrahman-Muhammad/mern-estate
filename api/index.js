import express from "express";

const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT_NUM = 3000;
app.listen(PORT_NUM, () => {
  console.log(`server running on port number ${PORT_NUM}`);
});
