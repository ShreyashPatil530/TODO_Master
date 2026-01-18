import React, { useState, useEffect } from 'react';
import axios from 'axios';

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_BASE = isLocalhost
  ? "http://localhost:5000/api/todos"
  : (process.env.REACT_APP_API_URL || "https://todo-master-gamma.vercel.app");

console.log("Using API URL:", API_BASE);

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const res = await axios.get(API_BASE);
      if (res.data) {
        setTodos(res.data);
      }
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post(API_BASE, { title: newTodo });
      if (res.data) {
        setTodos([res.data, ...todos]);
        setNewTodo("");
      }
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.put(`${API_BASE}/${id}`, { completed: !completed });
      setTodos(todos.map(todo => {
        if (todo._id === id) {
          todo.completed = res.data.completed;
        }
        return todo;
      }));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 text-center">
          Task Master
        </h1>

        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="w-full bg-gray-700 text-white rounded-xl py-4 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder-gray-400"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white rounded-lg px-4 font-bold transition-all shadow-lg hover:shadow-pink-500/30"
          >
            +
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
          {todos.map(todo => (
            <div
              className={`group flex items-center bg-gray-700/50 hover:bg-gray-700 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-600 ${todo.completed ? 'opacity-50' : ''}`}
              key={todo._id}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center cursor-pointer transition-all ${todo.completed ? 'bg-green-500 border-green-500' : 'border-pink-500 hover:bg-pink-500/20'}`}
                onClick={() => toggleComplete(todo._id, todo.completed)}
              >
                {todo.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                )}
              </div>

              <div className={`flex-1 text-lg font-medium transition-all ${todo.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                {todo.title}
              </div>

              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-400/10 cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                onClick={() => deleteTodo(todo._id)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-400 text-lg">No tasks yet. Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
