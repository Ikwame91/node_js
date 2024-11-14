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

  //when filter and value are undefined

  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
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

app.post("/api/users", (req, res) => {
  const { name } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ success: false, msg: "please provide name value" });
      mockUsers.push({name})
      res.status(201).json({ success: true, data: mockUsers });
}
);
app.post("/api/users", (req, res) => {
  console.log(req.body);
  const { body } = req;
  const newuser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newuser);
  res.status(201).send(newuser);
});

app.get("/api/products", (req, res) => {
  res.send(mockProducts);
});
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
