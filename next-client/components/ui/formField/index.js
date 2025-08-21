import { ErrorMessage, Field } from "formik";

const FormField = ({ label, name, as = "input", ...props }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">
      {label}
    </label>
    <Field
      name={name}
      as={as}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition disabled:bg-gray-100"
      {...props}
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm font-semibold mt-1"
    />
  </div>
);
export default FormField;