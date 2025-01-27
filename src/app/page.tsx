'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from './types/task';

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
    setTasks(res.data);
  };
  
  const addTask = async () => {
    if (newTaskTitle.trim() && newTaskDescription.trim()) {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        title: newTaskTitle,
        description: newTaskDescription,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      fetchTasks();
    }
  };
  
  const updateTask = async () => {
    if (editingTask && editingTask.title.trim()) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${editingTask.id}`,
        {
          title: editingTask.title,
          description: editingTask.description,
          completed: editingTask.completed,
        }
      );
      setEditingTask(null);
      fetchTasks();
    }
  };
  
  const deleteTask = async (id: number) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 flex flex-col items-center py-10">
    <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl">
      <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-8 tracking-wide">
        ToDo App
      </h1>
      <div className="mb-8">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="w-full p-4 border-2 border-blue-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task Title"
        />
        <textarea
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          className="w-full p-4 border-2 border-blue-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task Description"
        />
        <button
          onClick={addTask}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          Add Task
        </button>
      </div>
  
      {editingTask && (
  <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl shadow-md">
    <h2 className="text-lg font-bold text-yellow-700 mb-4">
      Editing Task
    </h2>
    <input
      type="text"
      value={editingTask.title}
      onChange={(e) =>
        setEditingTask({ ...editingTask, title: e.target.value })
      }
      className="w-full p-4 border-2 border-yellow-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
    />
    <textarea
      value={editingTask.description}
      onChange={(e) =>
        setEditingTask({
          ...editingTask,
          description: e.target.value,
        })
      }
      className="w-full p-4 border-2 border-yellow-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
    />
    <button
      onClick={updateTask}
      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-300"
    >
      Update Task
    </button>
  </div>
)}

  
      <ul className="space-y-6">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200"
          >
            <div>
              <h3
                className={`text-xl font-bold ${
                  task.completed ? 'line-through text-gray-400' : 'text-blue-800'
                }`}
              >
                {task.title}
              </h3>
              <p
                className={`text-sm ${
                  task.completed ? 'line-through text-gray-400' : 'text-blue-600'
                }`}
              >
                {task.description}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setEditingTask(task)}
                className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
  
  );
};

export default Home;
