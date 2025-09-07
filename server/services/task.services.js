const Task = require("../model/task.model");

async function TaskearchQuery(search) {
  try {
    if (search) {
      const searchText = new RegExp(search, "i");
      return {
        $or: [
          { title: { $regex: searchText } },
          { content: { $regex: searchText } },
        ],
      };
    }
    return {};
  } catch (error) {
    console.error("TaskearchQuery error:", error);
    return {};
  }
}

module.exports = {
  addTask: async (reqData) => {
    try {
      const createdTask = await Task.create(reqData);
      if (!createdTask) {
        throw createError.InternalServerError("Error Creating Task");
      }
      return createdTask;
    } catch (err) {
      throw err;
    }
  },

  editTask: async (taskId, newData) => {
    console.log("taskId", taskId);
    console.log("newData", newData);
    try {
      const task = await Task.findOneAndUpdate({ _id: taskId }, newData, {
        new: true,
      });

      if (!task) {
        throw createError.BadRequest("Invalid task id.");
      }

      await task.save();

      return task;
    } catch (err) {
      throw err;
    }
  },

  deleteTask: async (taskId) => {
    console.log("taskId", taskId);
    try {
      const task = await Task.deleteOne({ _id: taskId });
      if (!task || task.deletedCount === 0) {
        throw createError.BadRequest("Invalid task id.");
      }
      return { message: "Task deleted successfully." };
    } catch (err) {
      throw err;
    }
  },

  getOneTask: async (taskId) => {
    console.log("taskId", taskId);
    try {
      const task = await Task.findById({ _id: taskId });
      if (!task) {
        throw createError.BadRequest("Invalid task id.");
      }
      return task;
    } catch (err) {
      throw err;
    }
  },

  getAllTask: async (search, pageNo, perPage, filter) => {
    try {
      const skip = (pageNo - 1) * perPage;
      console.log("skip", skip);
      const searchQuery = await TaskearchQuery(search);
      console.log("searchQuery : ", JSON.stringify(searchQuery));
      const finalQuery = { ...filter, ...searchQuery };

      const taskList = await Task.aggregate([
        { $match: finalQuery },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: perPage },
        // Removed $lookup stage here
        {
          $project: {
            title: 1,
            content: 1,
            author: 1,
            createdAt: 1,
            publishedDate: 1,
            published: 1,
            image: 1,
            thumbnailImage: 1,
            // Removed blog_categories
          },
        },
      ]);

      const count = await Task.countDocuments(finalQuery);

      return { taskList, count };
    } catch (err) {
      throw err;
    }
  },
};
