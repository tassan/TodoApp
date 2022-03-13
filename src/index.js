const express = require('express');
const cors = require('cors');
const { v4: uuidV4 } = require('uuid');

const app = express();

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = appUsers.find(user => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

app.use(cors());
app.use(express.json());

const appUsers = [];

// POST
app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const user = {
    id: uuidV4(),
    name,
    username,
    todos: []
  }

  const userExists = appUsers.find(user => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: "User already registered" });
  }

  appUsers.push(user);

  return response.status(201).json(user);
});

// GET
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const todos = user.todos;

  return response.json(todos);
});

// POST
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidV4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

// PUT
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found"})
  }

  todo.title = title;
  todo.deadline = deadline;

  return response.status(200).json(todo);
});

// PATCH
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found"})
  }

  todo.done = true;

  return response.status(200).send(todo);
});


// DELETE
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found"})
  }

  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;
