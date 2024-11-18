import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createuservalidationSchema } from "./utils/validationSchema.mjs";
const app = express();
app.use(express.json());

// const logginnMiddleware = (req, res, next) => {
//   console.log(`${req.method}- ${req.url}`);
//   next();
// };


//middleware
const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1)
    return res.status(404).json({ success: false, message: "User not found" });
  req.findUserIndex = findUserIndex;
  next();
};

const PORT = process.env.PORT || 5000;

const mockUsers = [
  { id: 1, name: "kwame", displayName: "reginald" },
  { id: 2, name: "sarah", displayName: "appietus" },
  { id: 3, name: "esinam", displayName: "gloworh" },
  { id: 4, name: "linda", displayName: "adams" },
  { id: 5, name: "betty", displayName: "quansah" },
  { id: 6, name: "jerald", displayName: "melinda" },
  { id: 7, name: "Poliop", displayName: "duraq" },
  { id: 8, name: "selina", displayName: "fishpie" },
];

const mockProducts = [
  { id: 123, name: "fowl", price: "90" },
  { id: 345, name: "chicken", price: "89" },
  { id: 678, name: "aknson", price: "37" },
];
app.get(
  "/",

  (req, res) => {
    res.status(201).send({ msg: "hello world" });
  }
);

app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("cannot be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("must be between 3-10 characters"),
  (req, res) => {
    // console.log(req["express-validator#contexts"]);
    const result = validationResult(req);
    console.log(result);

    const {
      query: { filter, value },
    } = req;
    //   const filter = req.query.filter;
    // const value = req.query.value;
    //when filter and value are undefined
    if (filter && value) {
      // Filter based on the specified property and value
      const filteredUsers = mockUsers.filter((user) =>
        user[filter]?.includes(value)
      );
      return res.send(filteredUsers);
    }
    ////if a wrong filter value is passed
    // if (!mockUsers[0].hasOwnProperty(filter)) {
    //   return res.status(400).send({ error: `Invalid filter: ${filter}` });
    // }
    return res.send(mockUsers);
  }
);

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

app.post(
  "/api/users",
  checkSchema(createuservalidationSchema),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    // result.isEmpty
    // returns true if there are no errors
    // result is not empty
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const data = matchedData(req);
    console.log(data);

    const newuser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };

    mockUsers.push(newuser);
    return res.status(201).json({
      success: true,
      msg: "user created successfully",
      data: mockUsers,
    });
  }
);

app.get("/api/products", (req, res) => {
  res.send(mockProducts);
});

//updates a record but partially
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
