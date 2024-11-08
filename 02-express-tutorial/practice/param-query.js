const express = require("express");
const { products } = require("./data");

const app = express();

app.get("/", (req, res) => {
  res.send('<h1> Home Page </h1><a href ="/api/products"> products </a>');
});

app.get("/api/products", (req, res) => {
  const newProducts = products.map((product) => {
    const { id, name, image } = product;
    return { id, name, image };
  });
  res.json(newProducts);
});
app.get("/api/products/:productID", (req, res) => {
  const { productID } = req.params;
  const singleProduct = products.find(
    (product) => product.id === Number(productID)
  );
  if(!singleProduct){
    return res.status(404).send('product does not exist')
  }
  res.json(singleProduct);
});

app.listen(5000, () => {
  console.log(" Server is listening on port 5000.....");
});
