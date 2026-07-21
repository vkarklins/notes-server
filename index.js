const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:', request.path);
  console.log('Body:', request.body);
  console.log('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(requestLogger);


let contacts = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
];

app.get('/api/persons', (request, response) => {
  response.json(contacts);
});

app.get('/info', (request, response) => {
  const received = new Date();
  response.send(
    `Phonebook has info for ${contacts.length} people
    <p>${received.toString()}</p>`
  );
});

app.get('/info/:id', (request, response) => {
  const id = request.params.id;
  const contact = contacts.find(contact => contact.id === id);
  if (!contact) {
    return response.status(404).end();
  }
  response.send(
    `<p>Name: ${contact.name}
    <p>Number: ${contact.number}`
  );
});

app.delete('/api/persons/:id', (request, response) => {
  console.log('deleting');
  const id = request.params.id;
  contacts = contacts.filter(contact => contact.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const id = String(Math.floor(Math.random() * 10000000));
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'missing information'
    });
  }
  if (contacts.map(contact => contact.name).includes(request.body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }
  const newContact = {
    id,
    name: request.body.name,
    number: request.body.number
  };
  contacts.push(newContact);
  return response.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
})