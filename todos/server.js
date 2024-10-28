const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.text());

let todos = [];

app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

app.delete("/todos", (req, res) => {
  todos = [];
  res.json({ message: "Todo deleted successfully", todos });
});

app.delete("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  const index = todos.findIndex((todo) => todo.id === todoId);

  if (index !== -1) {
    todos.splice(index, 1);
    res.json({ message: "Todo deleted successfully", todos });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.post("/todos", (req, res) => {
  const { task } = req.body;
  const newTodo = {
    id: uuidv4(),
    task: task,
    done: false,
  };

  todos.push(newTodo);
  res.json({ message: "Todo added successfully", todo: newTodo, todos });
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { task, done } = req.body;
  const todo = todos.find((todo) => todo.id === id);

  if (todo) {
    todo.task = task;
    todo.done = done;
    res.json({ message: "Todo saved successfully", todo });
  } else res.status(404).json({ message: "Todo not found" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
