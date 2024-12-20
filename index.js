const express = require("express");
const app = express();
var morgan = require("morgan");

app.use(express.json());
app.use(morgan(":method :url :status :body"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.json({ method: req.method, message: "hello", ...req.body });
});

app.get("/info", (req, res) => {
  var utcSeconds = Date.now();
  var date = new Date(0);
  date.setUTCSeconds(utcSeconds);

  const message = `Phonebook has info for ${persons.length} <br><br>${date}`;

  res.send(message);
});

app.get("/api/persons", (req, res) => {
  res.json({ method: req.method, ...persons });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send("Error!");
  }
});

const generateId = () => {
  const maxId = Math.floor(Math.random() + persons.length);
  return String(maxId + 1);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  if (!body) {
    return res.status(400).json({
      error: "content missing",
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: "number is missing",
    });
  } else if (!body.name) {
    return res.status(400).json({
      error: "name is missing",
    });
  }
  const presentPersons = [];
  persons.map((person) => presentPersons.push(person.name));

  if (presentPersons.includes(body.name)) {
    return response.status(400).json({
      error: `name must be unique`,
    });
  }

  // res.json(person);
  // res.json({ method: req.method, message: person, ...req.body });
  res.json(morgan);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.debug("App listening on :3001");
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
