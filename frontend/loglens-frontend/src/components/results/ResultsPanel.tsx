import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { Box, Stack, Typography } from "@mui/material";
import type { AnalysisResult } from "../../models/AnalysisResult";
import { AnalysisResultView } from "./AnalysisResultView";
import { EmptyState } from "./EmptyState";

interface ResultsPanelProps {
  result: AnalysisResult | null;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 3, py: 2, textAlign: "left"  }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              background: "rgba(99,102,241,0.18)",
              color: "#6366f1",
              flexShrink: 0,
            }}
          >
            <AssessmentOutlinedIcon />
          </Box>

          <Box>
            <Typography variant="h6">2. Analysis Results</Typography>
            <Typography color="text.secondary" variant="body2">
              AI-generated insights and recommendations
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ borderTop: "1px solid rgba(148,163,184,0.15)", flex: 1, overflow: "auto" }}>
        {result ? <AnalysisResultView result={result} /> : <EmptyState />}
      </Box>
    </Box>
  );
}