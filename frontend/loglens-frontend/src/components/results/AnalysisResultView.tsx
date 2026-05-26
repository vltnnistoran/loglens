import { Box, Divider, Stack, Typography } from "@mui/material";
import type { AnalysisResult } from "../../models/AnalysisResult";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { SeverityBadge } from "./SeverityBadge";

interface AnalysisResultViewProps {
  result: AnalysisResult;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          fontSize: "0.9rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "rgba(226,232,240,0.85)",
          display: "block",
          mb: 1,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", py: 0.6, pl: 1.5 }}>
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "#6366f1",
          flexShrink: 0,
        }}
      />
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.65 }}>
        {text}
      </Typography>
    </Stack>
  );
}

export function AnalysisResultView({ result }: AnalysisResultViewProps) {
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>

      {/* Summary block */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.35, mb: 1.5 }}>
          {result.summary}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center" }}>
          <Typography variant="body1" sx={{ color: "rgba(226,232,240,0.9)", letterSpacing: "0.03em", fontWeight: 600 }}>
            Severity
          </Typography>
          <SeverityBadge severity={result.severity} />
          <Box sx={{ width: "1px", height: 14, backgroundColor: "rgba(148,163,184,0.3)" }} />
          <Typography variant="body1" sx={{ color: "rgba(226,232,240,0.9)", letterSpacing: "0.03em", fontWeight: 600 }}>
            Confidence
          </Typography>
          <ConfidenceBadge confidence={result.confidence} />
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(148,163,184,0.08)" }} />

      <Section title="Explanation">
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {result.explanation}
        </Typography>
      </Section>

      <Divider sx={{ borderColor: "rgba(148,163,184,0.08)" }} />

      <Section title="Possible Causes">
        {result.possibleCauses.map((cause) => (
          <BulletItem key={cause} text={cause} />
        ))}
      </Section>

      <Divider sx={{ borderColor: "rgba(148,163,184,0.08)" }} />

      <Section title="Suggested Fixes">
        {result.suggestedFixes.map((fix) => (
          <BulletItem key={fix} text={fix} />
        ))}
      </Section>

    </Box>
  );
}