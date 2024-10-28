import { useState } from "react";
import "./assets/scss/App.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Img from "./components/Img/Img";
import Todo from "./components/Todo/Todo";
import { TodoProps } from "./interfaces/interfaces";
import { fetchTodos, addTodoAPI, deleteAllTodosAPI } from "./services/toDoService";
import Dots from "./components/Todo/Dots/Dots";

function App() {
  const queryClient = useQueryClient();

  const [task, setTask] = useState("");

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task.trim()) {
      addTodoMutation.mutate({ task });
      setTask("");
    } else return;
  };

  const deleteAllTodos = () => {
    deleteAllTodosMutation.mutate();
  };

  const { data: todos, error, isError, isLoading } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
  const addTodoMutation = useMutation({
    mutationFn: addTodoAPI,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<TodoProps[]>(["todos"]);

      // Optimistically update the cache with the new task
      queryClient.setQueryData<TodoProps[]>(["todos"], (oldTodos) => [
        ...(oldTodos || []),
        { id: Date.now().toString(), task: newTodo.task, done: false }, // Temporary data
      ]);

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteAllTodosMutation = useMutation({
    mutationFn: deleteAllTodosAPI,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<TodoProps[]>(["todos"]);

      queryClient.setQueryData<TodoProps[]>(["todos"], []);

      return { previousTodos };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const isAddingTodos = addTodoMutation.isPending;
  const isDeletingTodos = deleteAllTodosMutation.isPending;

  if (isLoading) {
    return (
      <div className="App">
        <span className="App__loading">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="App">
        <span className="App__error">Error: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="App">
      <main className="App__main main">
        <form className="main__input" onSubmit={addTodo}>
          <input
            type="text"
            placeholder="Type here to add a task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={isAddingTodos}
          />
          {isAddingTodos || isDeletingTodos ? (
            <Dots />
          ) : (
            <button type="submit" className="main__add-button">
              <Img img="plus" />
              Add
            </button>
          )}
        </form>
        <hr className="main__line" />
        {todos && todos.map((todo: TodoProps) => <Todo key={todo.id} id={todo.id} task={todo.task} done={todo.done} />)}
      </main>
      <button type="button" className="App__clear-all-button" onClick={deleteAllTodos}>
        <Img img="delete" />
        Clear all tasks
      </button>
    </div>
  );
}

export default App;
