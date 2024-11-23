import express from "express";
import userRouter from "./routes/users.mjs";
import productRouter from "./routes/products.mjs";
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(productRouter);

const PORT = process.env.PORT || 5000;

app.get(
  "/",

  (req, res) => {
    res.status(201).send({ msg: "hello world" });
  }
);

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
