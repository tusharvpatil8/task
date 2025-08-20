import React, { useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineTrash,
} from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { deleteTask, getTasks } from "../../../services/taskService";
import EditTask from "./EditTask";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataNoFound from "../../../assets/svg/dataNoFound";
import useDebounce from "../../../utils/hooks/useDebounce";

const PAGESIZE = 4;


const ListTask = () => {
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

  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const debouncedText = useDebounce(searchText, 400);

  const formatDateToDDMMMYYYY = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")} ${date.toLocaleString(
      "en-US",
      { month: "short" }
    )} ${date.getFullYear()}`;
  };

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

  const onDelete = async () => {
    try {
      const resp = await deleteTask(selectedData?._id);
      if (resp?.success) {
        toast.success(resp?.message || "Task deleted successfully!");
        getAllTaskData();
      } else {
        toast.error(resp?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleteOpen(false);
    }
  };


  // ✅ show edit page
  if (editingTask) {
    return (
      <div className="container p-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            onClick={() => setEditingTask(null)}
          >
            <HiArrowLeft className="text-lg" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Edit Task</h1>
        </div>
        <EditTask
          taskId={editingTask._id}
          onClose={() => setEditingTask(null)}
          getAllTaskData={getAllTaskData}
        />
      </div>
    );
  }

  return (
    <div className="container p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <div className="px-4 py-2 rounded-lg font-semibold shadow-md bg-white">
          {resultTitle}
        </div>
        <div className="relative w-full md:w-72 rounded-lg font-semibold shadow-md bg-white">
          <HiOutlineSearch className="absolute left-3 top-3 text-lg" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {searchText && (
            <AiOutlineClose
              className={`absolute right-3 top-3 text-lg cursor-pointer text-${themeColor}-${primaryColorLevel}`}
              onClick={() => setSearchText("")}
            />
          )}
        </div>
      </div>

      {/* Tasks Grid */}
      {taskData?.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {taskData.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                <img
                  src={task.image}
                  alt={task.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{task.title}</h3>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {task.content}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {formatDateToDDMMMYYYY(task.publishedDate)}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={task.thumbnailImage}
                        alt={`${task.title} thumbnail`}
                        className="w-8 h-8 object-cover rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {task.author}
                      </span>
                    </div>
                    <div className="flex gap-2 text-lg">
                      <button
                        className="hover:text-green-500"
                        onClick={() => setEditingTask(task)}
                      >
                        <HiOutlinePencil />
                      </button>
                      <button
                        className="hover:text-red-500"
                        onClick={() => {
                          setSelectedData(task);
                          setModalAnimation("fadeIn");
                          setIsDeleteOpen(true);
                        }}
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loader */}
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-xl">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-2">
            {Array.from(
              { length: Math.ceil(pagination.total / pagination.perPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: i + 1,
                    }))
                  }
                  className={`px-4 py-2 rounded-lg border ${
                    pagination.currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 py-12">
          {loading ? "Loading..." : <DataNoFound />}
        </p>
      )}

      {/* Delete Modal */}
      {(isDeleteOpen || modalAnimation === "fadeOut") && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black/50 ${
            modalAnimation === "fadeIn" ? "animate-fadeIn" : "animate-fadeOut"
          }`}
          onAnimationEnd={() => {
            if (modalAnimation === "fadeOut") {
              setModalAnimation("fadeIn");
              setIsDeleteOpen(false);
            }
          }}
        >
          <div
            className={`bg-white p-6 rounded-xl shadow-lg max-w-sm w-full ${
              modalAnimation === "fadeIn"
                ? "animate-modalOpen"
                : "animate-modalClose"
            }`}
          >
            <h2 className="text-lg font-bold mb-4">
              Delete "{selectedData?.title}" Permanently
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalAnimation("fadeOut")}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setModalAnimation("fadeOut");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListTask;
