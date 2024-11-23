import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createuservalidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId } from "../utils/user_middleware.mjs";
const router = Router();

router.get(
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

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
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
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.status(200).json({ success: true, data: mockUsers });
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req.params;

  const deletedUser = mockUsers.splice(findUserIndex, 1);
  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: deletedUser,
  });
});

router.post(
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

export default router;

// Validate the request body
// const allowedFields = ["name", "displayName"];
// const isValid = Object.keys(body).every((key) => allowedFields.includes(key));
// if (!isValid)
//   return res
//     .status(400)
//     .json({ success: false, message: "Invalid fields in request body" });

// //check for empty body
// if (!Object.keys(body).length)
//   return res
//     .status(400)
//     .json({ success: false, message: "Request body cannot be empty" });
