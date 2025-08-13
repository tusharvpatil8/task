const { v4: uuidv4 } = require("uuid");

module.exports = {
  // -------------- Sync Helpers --------------------------------------------------------
  generateUniqueID: () => {
    const uuid = uuidv4();
    const uniqueId = uuid.replace(/-/g, "");
    return uniqueId;
  },
};
