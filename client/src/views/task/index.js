import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import ListTask from "./components/ListTask";
import AddTask from "./components/AddTask";

const Task = () => {
  const navigateTo = useNavigate();
  const [showAddTask, setShowAddTask] = useState(false);
  return (
    <div className="container py-4">
      {/* Top Bar */}
      <div className="border p-5 rounded-xl mb-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            📚 Task
          </h2>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <HiPlusCircle className="text-lg" />
            Create Task
          </button>
        </div>
      </div>

      {/* Task List */}
      {showAddTask ? (
        <div className="border p-5 rounded-xl mb-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
          <AddTask onClose={() => setShowAddTask(false)} />
        </div>
      ) : (
        <div className="border p-5 rounded-xl mb-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
          <ListTask />
        </div>
      )}
    </div>
  );
};

export default Task;
