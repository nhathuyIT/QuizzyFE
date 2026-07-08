import React, { type ReactNode } from "react";

interface EndpointGroupProps {
  title: string;
  children: ReactNode;
  themeColor: "blue" | "green" | "purple";
}

export const EndpointGroup: React.FC<EndpointGroupProps> = ({ title, children, themeColor }) => {
  return (
    <div className={`border p-4 rounded bg-white shadow-sm border-${themeColor}-200`}>
      <h3 className={`font-bold mb-4 text-${themeColor}-800`}>{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <div className="flex flex-col space-y-1 mb-2">
    <label className="text-xs font-semibold text-gray-600">{label}</label>
    <input
      type="text"
      className="border rounded p-1 text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export const ActionButton: React.FC<{
  label: string;
  onClick: () => void;
  themeColor: "blue" | "green" | "purple";
}> = ({ label, onClick, themeColor }) => {
  const bgColors = {
    blue: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
    green: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700",
    purple: "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700",
  };

  return (
    <button
      className={`block w-full text-left p-2 text-sm rounded border ${bgColors[themeColor]} transition-colors`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
