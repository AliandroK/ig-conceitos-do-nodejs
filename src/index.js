const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
 
  const {username} = request.headers;
  const user = users.find(element => element.username === username);

  if(!user){
    return response.status(404).json({error:"User not found!"}); 
  }

  request.user = user;
  
  return next();
}

function checksExistsUserTodo(request, response, next){
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find(element => element.id === id);
  
  if(!todo){
    return response.status(404).json({error:"TODO not found!"});
  }

  request.todo = todo;

  return next();

}


app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;
  
  const userExist = users.find(element => element.username === username);

  if(userExist){
    return response.status(400).json({error: "Username already exists!"}); 
  }

  const user ={
               id: uuidv4(), 
               name,
               username,
               todos : []
              }; 

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {user} = request;

  return response.status(200).json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;  
  const {user} = request;

  const todo = {
                id : uuidv4(),
                title,
                done : false,
                deadline : new Date(deadline),
                created_at : new Date()
              };

  user.todos.push(todo);

  return response.status(201).json(todo);                

});

app.put('/todos/:id', checksExistsUserAccount, checksExistsUserTodo, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;
  // const {id} = request.params;

  const {user} = request;

  const {todo} = request //user.todos.find(element => element.id === id);

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsUserTodo, (request, response) => {
  // Complete aqui
  // const {id} = request.params;
  const {user} = request;

  const {todo} = request;  //user.todos.find(element => element.id === id);

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checksExistsUserTodo, (request, response) => {
  // Complete aqui

  const {user} = request;
  
  const {todo} = request;  //user.todos.find(element => element.id === id);

  const index = user.todos.findIndex(element => element.id === todo.id);

  user.todos.splice(index, 1);

  return response.status(204).send();

});

module.exports = app;