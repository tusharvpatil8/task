module.exports.CreateSlugString = (str) => {
  return str
    .toLowerCase() // Convert the name to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove non-word characters except hyphens
    .replace(/\-\-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-+/, "") // Trim leading hyphens
    .replace(/-+$/, ""); // Trim trailing hyphens
};
