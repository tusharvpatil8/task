import React, { useEffect, useState } from "react";
import { HiArrowLeft, HiPlusCircle } from "react-icons/hi";
import ListTask from "@/components/taskForm/ListTask";
import AddTask from "@/components/taskForm/AddTask";
import useDebounce from "@/utils/hooks/useDebounce";
import { toast } from "react-toastify";
import { getTasks } from "@/services/taskService";

const PAGESIZE = 4;

const Task = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultTitle, setResultTitle] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("fadeIn");
  const [editingTask, setEditingTask] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    perPage: PAGESIZE,
  });

  const debouncedText = useDebounce(searchText, 400);

  // ✅ fetch tasks
  const getAllTaskData = async () => {
    setLoading(true);
    try {
      const payload = {
        search: debouncedText,
        perPage: pagination.perPage,
        pageNo: pagination.currentPage,
      };
      const resp = await getTasks(payload);
      if (resp?.success) {
        setTaskData(resp.data || []);
        setPagination((prev) => ({
          ...prev,
          total: resp.pagination.count || 0,
        }));
      }
    } catch {
      toast.error("Failed to load tasks!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ reset to page 1 when search changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [debouncedText]);

  // ✅ fetch on search or page change
  useEffect(() => {
    getAllTaskData();
  }, [debouncedText, pagination.currentPage]);

  // ✅ result title calculation
  useEffect(() => {
    if (!pagination?.total) {
      setResultTitle("Result 0 - 0 of 0");
      return;
    }

    const start = (pagination.currentPage - 1) * pagination.perPage + 1;
    const end = start + taskData.length - 1;
    const total = pagination.total;

    setResultTitle(
      `Result ${pagination.currentPage} - ${taskData.length} of ${total}`
    );
  }, [pagination, taskData]);

  return (
    <div className="container py-4">
      <div className="border p-5 rounded-xl mb-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            📚 Task
          </h2>

          {!showAddTask && (
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <HiPlusCircle className="text-lg" />
              Create Task
            </button>
          )}
        </div>
      </div>

      <div className="border p-5 rounded-xl mb-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
        {showAddTask ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowAddTask(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1"
              >
                <HiArrowLeft className="text-lg" />
              </button>
              <h1 className="text-lg font-bold text-gray-800">Add Task</h1>
            </div>
            <AddTask
              onClose={() => setShowAddTask(false)}
              getAllTaskData={getAllTaskData}
            />
          </>
        ) : (
          <ListTask
            taskData={taskData}
            loading={loading}
            resultTitle={resultTitle}
            selectedData={selectedData}
            isDeleteOpen={isDeleteOpen}
            modalAnimation={modalAnimation}
            editingTask={editingTask}
            searchText={searchText}
            setSearchText={setSearchText}
            setSelectedData={setSelectedData}
            setIsDeleteOpen={setIsDeleteOpen}
            setModalAnimation={setModalAnimation}
            setEditingTask={setEditingTask}
            getAllTaskData={getAllTaskData}
            pagination={pagination}
            setPagination={setPagination}
          />
        )}
      </div>
    </div>
  );
};

export default Task;
