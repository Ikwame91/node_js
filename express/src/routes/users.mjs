import { Router } from "express";
import { query, validationResult, checkSchema,matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createuservalidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId } from "../utils/middleware.mjs";
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
})


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
