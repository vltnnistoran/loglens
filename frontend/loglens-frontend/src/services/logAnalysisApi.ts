import type { AnalysisResult } from "../models/AnalysisResult";

export async function analyzeLogs(
  logs: string,
  file: File | null
): Promise<AnalysisResult> {
    const formData = new FormData();
  
    if (logs.trim().length > 0) {
      formData.append("Logs", logs);
    }
  
    if (file) {
      formData.append("File", file);
    }
  
    const response = await fetch(
      "http://localhost:5046/api/log-analysis/analyze",
      {
        method: "POST",
        body: formData,
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to analyze logs.");
    }
  
    return response.json();
}