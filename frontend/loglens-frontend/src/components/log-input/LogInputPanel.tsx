import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FileLogUpload } from "./FileLogUpload";
import { TextLogInput } from "./TextLogInput";

interface LogInputPanelProps {
  logs: string;
  file: File | null;
  loading: boolean;
  onLogsChange: (logs: string) => void;
  onFileChange: (file: File | null) => void;
  onAnalyze: () => void;
}

export function LogInputPanel({
  logs,
  file,
  loading,
  onLogsChange,
  onFileChange,
  onAnalyze,
}: LogInputPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  const hasInput = logs.trim().length > 0 || file !== null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Panel header */}
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
              color: "#8b5cf6",
              flexShrink: 0,
            }}
          >
            <DescriptionOutlinedIcon />
          </Box>

          <Box>
            <Typography variant="h6">1. Provide Logs</Typography>
            <Typography color="text.secondary" variant="body2">
              Paste your log output or upload a log file
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Panel body */}
      <Box
        sx={{
          borderTop: "1px solid rgba(148,163,184,0.15)",
          px: 2.5,
          pt: 2,
          pb: 2.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          gap: 1.5,
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            sx={{
              minHeight: 44,
              border: "1px solid rgba(148,163,184,0.18)",
              borderRadius: 2,
              width: "fit-content",
              "& .MuiTabs-indicator": { display: "none" },
              "& .MuiTab-root": {
                minHeight: 44,
                textTransform: "none",
                px: 2.5,
                fontSize: "0.9rem",
              },
              "& .Mui-selected": {
                color: "#fff !important",
                background: "linear-gradient(135deg, rgba(124,58,237,0.55), rgba(79,70,229,0.35))",
              },
            }}
          >
            <Tab icon={<InsertDriveFileOutlinedIcon fontSize="small" />} iconPosition="start" label="Paste Logs" />
            <Tab icon={<UploadOutlinedIcon fontSize="small" />} iconPosition="start" label="Upload File" />
          </Tabs>

          {activeTab === 0 && (
            <Typography variant="body2" color="text.secondary">
              {logs.length} / 200,000
            </Typography>
          )}
        </Stack>

        {/* Tab content — grows and clips */}
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {activeTab === 0 ? (
            <TextLogInput value={logs} onChange={onLogsChange} />
          ) : (
            <FileLogUpload file={file} onFileChange={onFileChange} />
          )}
        </Box>

        <Button
          fullWidth
          size="large"
          variant="contained"
          disabled={!hasInput || loading}
          onClick={onAnalyze}
          startIcon={<PlayArrowOutlinedIcon />}
          sx={{
            flexShrink: 0,
            py: 1.4,
            fontSize: "1rem",
            fontWeight: 700,
            textTransform: "none",
            background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
            "&:hover": { background: "linear-gradient(135deg, #4338ca, #5b21b6)" },
          }}
        >
          {loading ? "Analyzing..." : "Analyze Logs"}
        </Button>

        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "center", alignItems: "center", color: "text.secondary", flexShrink: 0 }}
        >
          <VerifiedUserOutlinedIcon sx={{ fontSize: 18, color: "#8b5cf6" }} />
          <Typography variant="body2">Your data will not be stored.</Typography>
        </Stack>
      </Box>
    </Box>
  );
}