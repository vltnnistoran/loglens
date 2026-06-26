import type { AnalysisResult } from "../models/AnalysisResult";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      15000
    );
  
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/log-analysis/analyze`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );
  
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        throw new Error(
          `Log analysis request failed (${response.status})`
        );
      }
  
      return (await response.json()) as AnalysisResult;
    } catch (error) {
      clearTimeout(timeoutId);
  
      if (error instanceof DOMException &&
          error.name === "AbortError") {
        throw new Error(
          "Request timed out after 15 seconds."
        );
      }
  
      throw error;
    }
}