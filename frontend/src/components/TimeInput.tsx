import React from "react";

interface TimeInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, name, value, onChange, disabled = false }) => {
  return (
    <div className="flex flex-col gap-1 ml-2 my-2">
      <label htmlFor={name} className="text-sm text-gray-700 dark:text-white">
        {label}
      </label>
      <input
        type="time"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
          disabled ? "bg-gray-100 text-gray-400" : "border-gray-300 focus:ring-blue-500"
        }`}
      />
    </div>
  );
};

export default TimeInput;