const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to you");
});

app.use((err, req, res, naxt) => {
  if (err) {
    res.send(err);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
