import toast from "react-hot-toast";

const useToast = () => {
  const successToast = (message) => {
    return toast.success(message, {
      style: {
        padding: "16px",
        background: "#0E0D0D",
        color: "#FFFFFF",
        borderRadius: "10px",
      },
    });
  };
  const errorToast = (message) => {
    return toast.error(message, {
      style: {
        padding: "16px",
        background: "#0E0D0D",
        color: "#FFFFFF",
        borderRadius: "10px",
      },
    });
  };
  return { successToast, errorToast };
};

export default useToast;
