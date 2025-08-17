import { ErrorMessage } from "formik";

const FileUploadField = ({ 
  label, 
  name, 
  preview, 
  currentFile,
  onChange, 
  onRemove,
  disabled 
}) => (
  <div>
    <label className="block text-sm font-semibold  mb-1">
      {label}
    </label>
    
    {preview ? (
      <div className="relative group">
        <img
          src={preview}
          alt="Preview"
          className="w-full h-48 object-contain rounded-lg shadow-md border p-1 bg-white"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onRemove}
            className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
            title="Remove image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="mt-1 text-sm text-gray-500 truncate">
          {currentFile?.name}
        </div>
      </div>
    ) : (
      <label className="block">
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg px-4 py-8 text-center bg-white transition cursor-pointer">
          <input
            type="file"
            id={name}
            name={name}
            accept="image/*"
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={disabled}
          />
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      </label>
    )}
    
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm font-semibold mt-1"
    />
  </div>
);

export default FileUploadField;