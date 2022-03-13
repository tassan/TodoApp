const express = require('express');
const cors = require('cors');
const { v4: uuidV4 } = require('uuid');

const app = express();

function checkExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  console.log(username);
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

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const user = {
    id: uuidV4(),
    name,
    username,
    todos: []
  }

  appUsers.push(user);
  console.log(appUsers);
  return response.status(201).json(user);
});

app.get('/todos', checkExistsUserAccount, (request, response) => {
  const { user } = request;
  console.log(1);
  const todos = user.todos;

  return response.json(todos);
});

app.post('/todos', checkExistsUserAccount, (request, response) => {

});

app.put('/todos/:id', checkExistsUserAccount, (request, response) => {

})

app.listen(3000);
