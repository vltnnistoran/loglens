export type SeverityLevel = "Low" | "Medium" | "High";
export type ConfidenceLevel = "Low" | "Medium" | "High";

export interface AnalysisResult {
  anomalyDetected: boolean;
  severity: SeverityLevel;
  summary: string;
  explanation: string;
  possibleCauses: string[];
  suggestedFixes: string[];
  confidence: ConfidenceLevel;
}