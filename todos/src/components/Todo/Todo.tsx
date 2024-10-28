import { TodoProps } from "../../interfaces/interfaces";
import Img from "../Img/Img";
import styles from "./Todo.module.scss";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodoAPI, saveTodoAPI } from "../../services/toDoService";
import Dots from "./Dots/Dots";

const Todo: React.FC<TodoProps> = ({ id, task, done }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(done);
  const [updatedTask, setUpdatedTask] = useState<string>(task);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Set the cursor to the end of the text when the isEditing state changes
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedTask(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSave = () => {
    if (task) {
      setIsEditing(false);
      saveTodoMutation.mutate({ id, task: updatedTask, done });
    }
  };

  const handleCheck = () => {
    const updatedIsChecked = !isChecked;
    setIsChecked(updatedIsChecked);
    saveTodoMutation.mutate({ id, task, done: updatedIsChecked });
  };

  const handleDelete = () => {
    deleteTodoMutation.mutate(id);
  };

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodoAPI,
    onSuccess: async (variables) => {
      console.log(`delete successful, invalidating queries...${variables}`);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const saveTodoMutation = useMutation({
    mutationFn: saveTodoAPI,
    onSuccess: async (variables) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.log("Error message set:", error);
    },
  });

  const { isPending, isError } = saveTodoMutation;

  return (
    <>
      <div className={`${styles.todo} ${isEditing && styles.active} ${isPending && styles.pending}`}>
        <input type="checkbox" className={styles.todo__checkbox} checked={isChecked} onChange={handleCheck} id={id} />

        {isEditing ? (
          <>
            <textarea
              className={styles.todo__text}
              rows={1}
              ref={textareaRef}
              value={updatedTask}
              autoFocus
              onChange={handleChange}
            />
            <div className={styles.todo__act} onClick={handleSave}>
              <Img img="save" />
            </div>
          </>
        ) : (
          <>
            <label className={`${styles.todo__text} ${isChecked ? styles.completed : ""}`} htmlFor={id}>
              {task}
            </label>

            {isPending ? (
              <Dots />
            ) : (
              <>
                {!isChecked && (
                  <div className={`${styles.todo__act} ${styles.edit}`} onClick={handleEdit}>
                    <Img img="edit" />
                  </div>
                )}
                <div className={`${styles.todo__act} ${styles.delete}`} onClick={handleDelete}>
                  <Img img="delete" />
                </div>
              </>
            )}
          </>
        )}
      </div>
      {isError && <span className={styles.error}>Failed to save the task. Please try again.</span>}
    </>
  );
};

export default Todo;
