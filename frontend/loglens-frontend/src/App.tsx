import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LogInputPanel } from "./components/log-input/LogInputPanel";
import { ResultsPanel } from "./components/results/ResultsPanel";
import type { AnalysisResult } from "./models/AnalysisResult";

function App() {
  const [logs, setLogs] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const hasInput = logs.trim().length > 0 || file !== null;

  async function handleAnalyze() {
    if (!hasInput) {
      setError("Please provide logs or upload a file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockResult: AnalysisResult = {
        anomalyDetected: true,
        severity: "Low",
        summary: "Repeated database connection failures detected.",
        explanation:
          "The logs indicate repeated failures to connect to the database service followed by timeout errors.",
        possibleCauses: [
          "Database service unavailable",
          "Incorrect connection string",
          "Network connectivity issue",
        ],
        suggestedFixes: [
          "Verify database availability",
          "Check database credentials",
          "Inspect network connectivity",
        ],
        confidence: "Low",
      };

      setResult(mockResult);
    } catch {
      setError("Failed to analyze logs.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(selectedFile: File | null) {
    setFile(selectedFile);

    if (selectedFile) {
      setLogs("");
    }
  }

  function handleLogsChange(value: string) {
    setLogs(value);

    if (value.trim().length > 0) {
      setFile(null);
    }
  }

  return (
    <>
      <DashboardLayout
        inputPanel={
          <LogInputPanel
            logs={logs}
            file={file}
            loading={loading}
            onLogsChange={handleLogsChange}
            onFileChange={handleFileChange}
            onAnalyze={handleAnalyze}
          />
        }
        resultsPanel={<ResultsPanel result={result} />}
      />

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;