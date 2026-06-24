import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LogInputPanel } from "./components/log-input/LogInputPanel";
import { ResultsPanel } from "./components/results/ResultsPanel";
import { analyzeLogs } from "./services/logAnalysisApi";
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

      const analysisResult = await analyzeLogs(logs, file);
      
      setResult(analysisResult);
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
            hasInput={hasInput}
            loading={loading}
            onLogsChange={handleLogsChange}
            onFileChange={handleFileChange}
            onAnalyze={handleAnalyze}
            onError={setError}
          />
        }
        resultsPanel={<ResultsPanel result={result} loading={loading} />}
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