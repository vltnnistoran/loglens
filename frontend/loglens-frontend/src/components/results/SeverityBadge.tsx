import { Chip } from "@mui/material";
import type { SeverityLevel } from "../../models/AnalysisResult";

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const color =
    severity === "High"
      ? "error"
      : severity === "Medium"
      ? "warning"
      : "success";

  return <Chip label={severity} color={color} size="small" />;
}