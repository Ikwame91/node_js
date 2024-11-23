import { mockProducts } from "./constants.mjs";

export const resolveIndexByProductID = (req, res, next) => {
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
