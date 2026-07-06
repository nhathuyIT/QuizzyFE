"use client";

import React from "react";
import { useApiTester } from "../hooks/useApiTester";
import { LogViewer } from "./LogViewer";
import { AcademicTestPanel } from "./AcademicTestPanel";
import { AdminTestPanel } from "./AdminTestPanel";
import { ChatbotTestPanel } from "./ChatbotTestPanel";

export const ApiTesterLayout: React.FC = () => {
  const { logs, loading, executeApi, clearLogs } = useApiTester();

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 flex items-center justify-between text-gray-800">
          <span>Quizzy API Integration Tester</span>
          {loading && (
            <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full animate-pulse">
              Running Request...
            </span>
          )}
        </h1>

        <p className="mb-8 text-gray-600 bg-white p-4 rounded shadow-sm border border-gray-200">
          Click the buttons below to trigger the newly added endpoints. 
          Use the input fields to provide actual IDs instead of hardcoded mock data.
          The results will be logged in the console panel below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AcademicTestPanel onExecute={executeApi} />
          <AdminTestPanel onExecute={executeApi} />
          <ChatbotTestPanel onExecute={executeApi} />
        </div>

        <LogViewer logs={logs} onClear={clearLogs} />
      </div>
    </div>
  );
};
