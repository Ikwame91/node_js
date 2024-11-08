const express = require("express");
const logger = require('./practice/logger')
const app = express();
const authorize = require('./practice/authorize')
app.use([logger,authorize])

// req => middleware => res



app.get("/", (req, res) => {
  res.send(" Home");
});

app.get("/about", (req, res) => {
  res.send(" About page");
});

app.get("/products", (req, res) => {
  res.send(" products page");
});

app.get("/api/items", (req, res) => {
  res.send(" items page");
});
app.listen(5000, () => {
  console.log(" Server is listening on port 5000.....");
});
