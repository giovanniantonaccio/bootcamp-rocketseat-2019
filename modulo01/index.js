const express = require("express");

const server = express();
server.use(express.json());

const users = ["Giovanni", "Giulia", "Gustavo"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.id];

  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  res.json(users);
});

server.get("/users/:id", checkUserInArray, (req, res) => {
  res.json(req.user);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

server.put("/users/:id", checkUserInArray, checkUserExists, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  users[id] = name;

  return res.json(users);
});

server.delete("/users/:id", checkUserInArray, (req, res) => {
  const { id } = req.params;

  users.splice(id, 1);

  res.send();
});

server.listen(3000);
