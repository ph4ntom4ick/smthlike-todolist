import React, { useState, useEffect } from 'react';
import './App.css';



interface Task {
  id: string;
  title: string;
  completed: boolean;
  createDate: Date;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    const defaultTask: Task = {
      id: '1',
      title: 'Write yourself a task!',
      completed: false,
      createDate: new Date(),
    };

    setTasks([defaultTask]);
  }, []); 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskItem: Task = {
        id: String(Date.now()),
        title: newTask,
        completed: false,
        createDate: new Date(),
      };

      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const finishedTasks = tasks.filter((task) => task.completed).length;
  const percentageCompleted = tasks.length > 0 ? (finishedTasks / tasks.length) * 100 : 0;

  return (
    <div className="App">
      <nav>
      <p>Almost there: {percentageCompleted.toFixed(2)}% done</p>
      </nav>
      <div>
        <input
          type="text"
          placeholder="Enter task"
          value={newTask}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span className={task.completed ? 'completed' : ''}>{task.title}</span>
            <button className="remove-button" onClick={() => removeTask(task.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
