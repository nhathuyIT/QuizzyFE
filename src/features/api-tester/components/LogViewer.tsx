import React from "react";
import type { ApiLog } from "../hooks/useApiTester";

interface LogViewerProps {
  logs: ApiLog[];
  onClear: () => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs, onClear }) => {
  return (
    <div className="mt-8 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col h-96">
      <div className="bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-white font-mono text-sm uppercase tracking-wider font-semibold">
          Test Logs
        </h2>
        <button
          onClick={onClear}
          className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
        >
          Clear Logs
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4 font-mono text-sm bg-[#1e1e1e]">
        {logs.length === 0 ? (
          <p className="text-gray-500 italic text-center mt-10">
            No logs yet. Execute an API request to see results.
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <span className={`font-bold ${log.success ? "text-green-400" : "text-red-400"}`}>
                  {log.success ? "✓ SUCCESS" : "✕ ERROR"} - {log.title}
                </span>
                <span className="text-gray-500 text-xs">{log.time}</span>
              </div>
              <pre className="bg-black p-3 rounded text-gray-300 overflow-x-auto text-xs leading-relaxed border border-gray-800 whitespace-pre-wrap break-words">
                {JSON.stringify(log.result, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
