export interface AnalysisResult {
    anomalyDetected: boolean;
    severity: "Low" | "Medium" | "High";
    summary: string;
    explanation: string;
    possibleCauses: string[];
    suggestedFixes: string[];
    confidence: "Low" | "Medium" | "High";
  }