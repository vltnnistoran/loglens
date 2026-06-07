import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import type { AnalysisResult } from "../../models/AnalysisResult";
import { AnalysisResultView } from "./AnalysisResultView";
import { EmptyState } from "./EmptyState";

interface ResultsPanelProps {
  result: AnalysisResult | null;
  loading: boolean;
}

function ResultsSkeleton() {
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Summary block */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
        <Skeleton variant="text" width="70%" height={32} />
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="rounded" width={52} height={24} />
          <Skeleton variant="text" width={70} height={20} />
          <Skeleton variant="rounded" width={52} height={24} />
        </Stack>
      </Box>

      <Skeleton variant="rectangular" height={1} />

      {/* Explanation */}
      <Box>
        <Skeleton variant="text" width="30%" height={18} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="92%" />
        <Skeleton variant="text" width="80%" />
      </Box>

      <Skeleton variant="rectangular" height={1} />

      {/* Detected Patterns */}
      <Box>
        <Skeleton variant="text" width="40%" height={18} sx={{ mb: 1 }} />
        {[...Array(4)].map((_, i) => (
          <Stack key={i} direction="row" spacing={1.5} sx={{ alignItems: "center", py: 0.6, pl: 1.5, }}>
            <Skeleton variant="circular" width={7} height={7} />
            <Skeleton variant="text" width={`${65 + i * 5}%`} />
          </Stack>
        ))}
      </Box>

      <Skeleton variant="rectangular" height={1} />

      {/* Possible causes */}
      <Box>
        <Skeleton variant="text" width="35%" height={18} sx={{ mb: 1 }} />
        {[...Array(3)].map((_, i) => (
          <Stack key={i} direction="row" spacing={1.5} sx={{ alignItems: "center", py: 0.6, pl: 1.5 }}>
            <Skeleton variant="circular" width={7} height={7} />
            <Skeleton variant="text" width={`${60 + i * 10}%`} />
          </Stack>
        ))}
      </Box>

      <Skeleton variant="rectangular" height={1} />

      {/* Suggested fixes */}
      <Box>
        <Skeleton variant="text" width="30%" height={18} sx={{ mb: 1 }} />
        {[...Array(3)].map((_, i) => (
          <Stack key={i} direction="row" spacing={1.5} sx={{ alignItems: "center", py: 0.6, pl: 1.5 }}>
            <Skeleton variant="circular" width={7} height={7} />
            <Skeleton variant="text" width={`${55 + i * 8}%`} />
          </Stack>
        ))}
      </Box>
    </Box>
  );
}

export function ResultsPanel({ result, loading }: ResultsPanelProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 3, py: 2, textAlign: "left" }}>
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
        {loading ? (
          <ResultsSkeleton />
        ) : result ? (
          <AnalysisResultView result={result} />
        ) : (
          <EmptyState />
        )}
      </Box>
    </Box>
  );
}