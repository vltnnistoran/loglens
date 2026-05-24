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
    <Box>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              background: "rgba(99,102,241,0.18)",
              color: "#8b5cf6",
            }}
          >
            <DescriptionOutlinedIcon />
          </Box>

          <Box>
            <Typography variant="h6">1. Provide Logs</Typography>
            <Typography color="text.secondary">
              Paste your log output or upload a log file
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ borderTop: "1px solid rgba(148,163,184,0.15)", p: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{
            mb: 2,
            minHeight: 52,
            border: "1px solid rgba(148,163,184,0.18)",
            borderRadius: 2,
            width: "fit-content",
            "& .MuiTabs-indicator": {
              backgroundColor: "#8b5cf6",
            },
            "& .MuiTab-root": {
              minHeight: 52,
              textTransform: "none",
              px: 3,
              fontSize: "1rem",
            },
            "& .Mui-selected": {
              color: "#fff !important",
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.55), rgba(79,70,229,0.35))",
            },
          }}
        >
          <Tab
            icon={<InsertDriveFileOutlinedIcon />}
            iconPosition="start"
            label="Paste Logs"
          />
          <Tab
            icon={<UploadOutlinedIcon />}
            iconPosition="start"
            label="Upload File"
          />
        </Tabs>

        {activeTab === 0 ? (
          <TextLogInput value={logs} onChange={onLogsChange} />
        ) : (
          <FileLogUpload file={file} onFileChange={onFileChange} />
        )}

        <Stack
        direction="row"
        sx={{
            mt: 2,
            justifyContent: "space-between",
            color: "text.secondary",
        }}
        >
          <Typography variant="body2">Supports .log, .txt, .json</Typography>
          <Typography variant="body2">{logs.length} / 200,000 characters</Typography>
        </Stack>

        <Button
          fullWidth
          size="large"
          variant="contained"
          disabled={!hasInput || loading}
          onClick={onAnalyze}
          startIcon={<PlayArrowOutlinedIcon />}
          sx={{
            mt: 3,
            py: 1.6,
            fontSize: "1rem",
            fontWeight: 700,
            textTransform: "none",
            background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
            "&:hover": {
              background: "linear-gradient(135deg, #4338ca, #5b21b6)",
            },
          }}
        >
          {loading ? "Analyzing..." : "Analyze Logs"}
        </Button>

        <Stack
            direction="row"
            spacing={1}
            sx={{
                mt: 3,
                justifyContent: "center",
                alignItems: "center",
                color: "text.secondary",
            }}
        >
          <VerifiedUserOutlinedIcon sx={{ fontSize: 20, color: "#8b5cf6" }} />
          <Typography variant="body2">Your data will not be stored.</Typography>
        </Stack>
      </Box>
    </Box>
  );
}