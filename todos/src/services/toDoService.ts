import { TodoProps, NewTodo } from "../interfaces/interfaces";

export const fetchTodos = async (): Promise<TodoProps[]> => {
  const response = await fetch("http://localhost:3000/todos");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const addTodoAPI = async (newTodo: NewTodo) => {
  const response = await fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task: newTodo.task }),
  });

  const data = await response.json();
  return data;
};

export const deleteAllTodosAPI = async () => {
  const response = await fetch("http://localhost:3000/todos", {
    method: "DELETE",
  });
  const data = await response.json();
  console.log(data.message);
};

export const deleteTodoAPI = async (id: string) => {
  const response = await fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  console.log(data.message);
};

export const saveTodoAPI = async ({ id, task, done }: { id: string; task: string; done: boolean }) => {
  const response = await fetch(`http://localhost:3000/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task, done }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  const data = await response.json();
  console.log(data.message);
};
