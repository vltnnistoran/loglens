import { Chip } from "@mui/material";
import type { ConfidenceLevel } from "../../models/AnalysisResult";

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const color =
    confidence === "High"
      ? "success"
      : confidence === "Medium"
      ? "warning"
      : "error";

  return <Chip label={confidence} color={color} size="small" />;
}