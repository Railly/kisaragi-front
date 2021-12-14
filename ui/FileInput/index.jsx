import React, { useState } from "react";
import Button from "ui/Button";

const FileInput = React.forwardRef(
  ({ label, onChange, onBlur, name, errors, disabled }, ref) => {
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
      const _file = e.target.files[0];
      setFile(_file);
      onChange(e);
    };

    return (
      <div className="w-full px-3">
        <div className="grid grid-cols-2 mb-2">
          <label
            className="flex items-center py-2 text-xs font-bold text-gray-700 uppercase select-none"
            htmlFor="grid-first-name"
          >
            {label}
          </label>
          {errors && (
            <span className="flex items-center justify-center px-2 text-sm font-medium text-center rounded select-none bg-rose-100 text-rose-600 ">
              {errors.message}
            </span>
          )}
        </div>
        <div className="relative mb-4 overflow-hidden">
          <input
            type="file"
            multiple={false}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 "
            disabled={disabled}
            ref={ref}
            name={name}
            onChange={handleChange}
            onBlur={onBlur}
          />
        </div>
      </div>
    );
  }
);

FileInput.displayName = "Select";

export default FileInput;
