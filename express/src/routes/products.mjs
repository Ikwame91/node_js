import { Router } from "express";
import { query, validationResult, body, matchedData } from "express-validator";
import { resolveIndexByProductID } from "../utils/product_middleware.mjs";
import { mockProducts } from "../utils/constants.mjs";
const router = Router();

router.get("/api/products/:id", resolveIndexByProductID, (req, res) => {
  const { findproductIndex } = req;
  const product = mockProducts[findproductIndex];
  return res.json(product);
});

router.get(
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

    // Return all products if no filter is routerlied
    return res.json(mockProducts);
  }
);

router.post(
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

export default router;
