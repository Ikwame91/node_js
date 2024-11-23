import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createuservalidationSchema } from "./utils/validationSchema.mjs";
import userRouter from "./routes/users.mjs";
import { mockUsers } from "./utils/constants.mjs";
import { resolveIndexByUserId } from "./utils/middleware.mjs";
const app = express();
app.use(express.json());
app.use(userRouter);

// const logginnMiddleware = (req, res, next) => {
//   console.log(`${req.method}- ${req.url}`);
//   next();
// };



const resolveIndexByProductID = (req, res, next) => {
  const { id } = req.params;

  const productId = parseInt(id);
  if (isNaN(productId)) return res.sendStatus(400);
  const findproductIndex = mockProducts.findIndex(
    (product) => product.id === productId
  );
  if (findproductIndex === -1)
    return res
      .status(404)
      .json({ success: false, message: "product not found" });
  req.findproductIndex = findproductIndex;

  next();
};

const PORT = process.env.PORT || 5000;

app.get(
  "/",

  (req, res) => {
    res.status(201).send({ msg: "hello world" });
  }
);

app.get("/api/products/:id", resolveIndexByProductID, (req, res) => {
  const { findproductIndex } = req;
  const product = mockProducts[findproductIndex];
  return res.json(product);
});

app.get(
  "/api/products",
  //query()--midleware/validator Validates query parameters URL Query	filter=name
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("cannot be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("must be between 3-10 characters"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);

    //if result is not empty
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const { filter, value } = req.query;

    // If filter and value are provided, filter the products
    if (filter && value) {
      const filteredProducts = mockProducts.filter((product) =>
        product[filter]?.toString().includes(value.toString())
      );
      return res.json(filteredProducts);
    }

    // Return all products if no filter is applied
    return res.json(mockProducts);
  }
);

app.post(
  "/api/products",
  //body--midleware/validator	Validates request body data	JSON/Body	{ "name": "...", "dsplayname":"...." }
  [
    body("name")
      .isString()
      .notEmpty()
      .withMessage("cannot be empty")
      .isLength({ min: 3, max: 15 })
      .withMessage("must be between 5-36 characters"),
    body("price").notEmpty(),
  ],
  (req, res) => {
    const result = validationResult(req);
    console.log(result);

    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    // const { body } = req; changed body to data assignement matched data function

    const data = matchedData(req);
    console.log(data);

    const newProducts = {
      id: mockProducts[mockProducts.length - 1].id + 1,
      ...data,
    };
    mockProducts.push(newProducts);
    return res.status(201).json({
      success: true,
      msg: "user created successfully",
      data: mockProducts,
    });
  }
);

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  const allowedFields = ["name", "displayName"];
  const isValid = Object.keys(body).every((key) => allowedFields.includes(key));
  if (!isValid) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid fields in request body" });
  }
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.status(200).json({ success: true, data: mockUsers });
});

//updates a record but partially
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  // Validate the request body
  const allowedFields = ["name", "displayName"];
  const isValid = Object.keys(body).every((key) => allowedFields.includes(key));
  if (!isValid)
    return res
      .status(400)
      .json({ success: false, message: "Invalid fields in request body" });

  //check for empty body
  if (!Object.keys(body).length)
    return res
      .status(400)
      .json({ success: false, message: "Request body cannot be empty" });

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.status(200).json({ success: true, data: mockUsers });
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req.params;

  const deletedUser = mockUsers.splice(findUserIndex, 1);
  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: deletedUser,
  });
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
