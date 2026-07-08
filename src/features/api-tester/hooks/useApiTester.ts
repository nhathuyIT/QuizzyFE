import { useState, useCallback } from "react";

export interface ApiLog {
  id: number;
  title: string;
  result: unknown;
  success: boolean;
  time: string;
}

export function useApiTester() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const addLog = useCallback((title: string, result: unknown, success: boolean = true) => {
    setLogs((prev) => [
      { id: Date.now(), title, result, success, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const executeApi = useCallback(async (title: string, apiFunc: () => Promise<unknown>) => {
    setLoading(true);
    try {
      const res = await apiFunc();
      addLog(title, res, true);
    } catch (error: unknown) {
      addLog(title, error, false);
    } finally {
      setLoading(false);
    }
  }, [addLog]);

  return {
    logs,
    loading,
    executeApi,
    clearLogs,
  };
}
