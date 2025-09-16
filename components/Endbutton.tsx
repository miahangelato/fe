"use client";

import React from "react";
import { useConsent } from "../contexts/ConsentContext";

const EndButton: React.FC = () => {
  const { clearAll } = useConsent();

  const handleEndProcess = () => {
    // Clear all state and localStorage
    clearAll();

    // Navigate to the main page
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleEndProcess}
      className="bg-red-800 text-3xl text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
    >
      End Process
    </button>
  );
};

export default EndButton;
