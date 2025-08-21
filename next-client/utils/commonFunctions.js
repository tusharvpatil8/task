import toast from "react-hot-toast";

export const SuccessToast = (message) =>
  toast.success(message, {
    position: "top-right",
    style: {
      padding: "12px",
      background: "#000000",
      color: "#fff",
      fontSize: "14px",
    },
  });

export const ErrorToast = (message) =>
  toast.error(message, {
    position: "top-right",
    style: {
      padding: "12px",
      background: "#000000",
      color: "#fff",
      fontSize: "14px",
    },
  });

export const formatDate = (date) => {
  const options = { month: "numeric", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};

export function formatDateString(isoString) {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const amPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${day}/${month}/${year}, ${hours}:${minutes} ${amPm}`;
}

export function capitalizeFirstLetter(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

