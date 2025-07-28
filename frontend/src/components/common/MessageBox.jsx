import React from "react";

const MessageBox = ({ type = "info", message }) => {
  if (!message) return null;

  const colors = {
    success: "bg-green-100 text-green-800 border-green-400",
    error: "bg-red-100 text-red-800 border-red-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
  };

  return (
    <div className={`border px-4 py-2 rounded mb-4 ${colors[type]}`}>
      {message}
    </div>
  );
};

export default MessageBox;
