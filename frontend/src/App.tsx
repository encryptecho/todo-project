import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

const API = "http://127.0.0.1:8000/api/tasks/";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(API);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const addTask = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    try {
      await axios.post(API, { title: trimmed });
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      await axios.patch(`${API}${task.id}/update/`, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API}${id}/delete/`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1>Task Manager</h1>

        <div className="form">
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <span
                className={task.completed ? "completed" : ""}
                onClick={() => toggleComplete(task)}
              >
                {task.title}
              </span>

              <div className="actions">
                <button onClick={() => toggleComplete(task)}>
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button className="delete" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;