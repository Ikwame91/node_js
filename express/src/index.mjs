import express, { response } from "express";

const app = express();
app.use(express.json());
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
app.get("/", (req, res) => {
  res.status(201).send({ msg: "hello world" });
});

app.get("/api/users", (req, res) => {
  console.log(req.query);
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
});

app.get("/api/users/:id", (req, res) => {
  console.log(req.params);
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad request. INVALID ID" });
  const finsUser = mockUsers.find((user) => user.id === parsedId);
  if (!finsUser) return res.sendStatus(404);
  return res.send(finsUser);
});

// app.post("/api/users", (req, res) => {
//   const { name } = req.body;
//   if (!name)
//     return res
//       .status(400)
//       .json({ success: false, msg: "please provide name value" });
//       mockUsers.push({name})
//       res.status(201).json({ success: true, data: mockUsers });
// }
// );

app.post("/api/users", (req, res) => {
  console.log(req.body);
  const { body } = req;
  const newuser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  //1
  // let userIdCounter = mockUsers.length + 1;

  // const newUser = { id: userIdCounter++, ...body };

  //2
  // const newUser = {
  //   id: mockUsers.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1,
  //   ...body
  // };

  mockUsers.push(newuser);
  return res.status(201).json({
    success: true,
    msg: "user created successfully",
    data: mockUsers,
  });
});

app.get("/api/products", (req, res) => {
  res.send(mockProducts);
});

//updates a record but partially
app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  // Find and update the user using map()
  // const updatedUsers = mockUsers.map((user) => {
  //   if (user.id === parsedId) {
  //     return { id: parsedId, ...body }; // Update user with new data
  //   }
  //   return user; // Return the unmodified user
  // });

  // // If no user was updated, return 404
  // const userUpdated = updatedUsers.some((user) => user.id === parsedId);
  // if (!userUpdated) return res.sendStatus(404);

  // // Return the updated list of users
  // return res.status(200).json({ success: true, data: updatedUsers });

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return res.status(200).json({ success: true, data: mockUsers });
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
