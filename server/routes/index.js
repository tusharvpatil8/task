const admin = require("./admin.routes");
const user = require("./user.routes");
const common = require("./common.routes");
module.exports = {
  adminAPI: (app) => {
    app.use("/admin", admin);
  },
  userAPI: (app) => {
    app.use("/user", user);
  },
  commonRoutes: (app) => {
    app.use("/common", common);
  },
};
