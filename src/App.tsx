import React from 'react';
import { observer } from 'mobx-react';
import './App.css';
import { makeAutoObservable } from 'mobx';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createDate: Date;
}

class TaskStore {
  tasks: Task[] = [];
  newTask = '';
  isListLayout = true;

  constructor() {
    makeAutoObservable(this);
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.newTask = event.target.value;
  }

  handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      this.addTask();
    }
  }

  addTask() {
    if (this.newTask.trim() !== '') {
      const newTaskItem: Task = {
        id: String(Date.now()),
        title: this.newTask,
        completed: false,
        createDate: new Date(),
      };
      this.tasks.push(newTaskItem);
      this.newTask = '';
    }
  }

  toggleTask(taskId: string) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }
  }

  removeTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  get finishedTasks() {
    return this.tasks.filter((task) => task.completed).length;
  }

  get percentageCompleted() {
    return this.tasks.length > 0 ? (this.finishedTasks / this.tasks.length) * 100 : 0;
  }

  toggleLayout() {
    this.isListLayout = !this.isListLayout;
  }
}

const store = new TaskStore();

const App = observer(() => {
  return (
    <div className="App">
      <nav>
        <p>Almost there: {store.percentageCompleted.toFixed(2)}% done</p>
        <button onClick={() => store.toggleLayout()}>
          {store.isListLayout ? 'Switch to Tiles' : 'Switch to List'}
        </button>
      </nav>
      <div>
        <input
          type="text"
          placeholder="Enter task"
          value={store.newTask}
          onChange={(event) => store.handleInputChange(event)}
          onKeyPress={(event) => store.handleKeyPress(event)}
        />
        <button onClick={() => store.addTask()}>Add Task</button>
      </div>
      {store.isListLayout ? (
        <ul>
          {store.tasks.map((task) => (
            <li key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => store.toggleTask(task.id)}
              />
              <span className={task.completed ? 'completed' : ''}>{task.title}</span>
              <button className="remove-button" onClick={() => store.removeTask(task.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="tiles-container">
          {store.tasks.map((task) => (
            <div key={task.id} className={`task-item tile ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => store.toggleTask(task.id)}
              />
              <span>{task.title}</span>
              <button className="remove-button" onClick={() => store.removeTask(task.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default App;
