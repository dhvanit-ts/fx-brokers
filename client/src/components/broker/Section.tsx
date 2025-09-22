"use client"

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// Update the Section component
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-400">{icon}</span>
        <span className="font-medium">{title}</span>
        <span className="ml-auto text-gray-400">
          {open ? (
            <FiChevronUp className="w-4 h-4" />
          ) : (
            <FiChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      <div
        className={`transition-all duration-200 ease-in-out ${
          open ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-6 border-t border-gray-100">{children}</div>
      </div>
    </div>
  );
};

export default Section;