import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { Box, Button, Typography } from "@mui/material";

interface FileLogUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileLogUpload({ file, onFileChange }: FileLogUploadProps) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    onFileChange(selectedFile);
  }

  return (
    <Box
      sx={{
        minHeight: 420,
        border: "1px dashed rgba(139, 92, 246, 0.6)",
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        p: 4,
        backgroundColor: "rgba(2, 6, 23, 0.35)",
      }}
    >
      <Box>
        <UploadFileOutlinedIcon sx={{ fontSize: 56, color: "#8b5cf6", mb: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Upload log file
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Supported formats: .log, .txt, .json
        </Typography>

        <Button variant="contained" component="label">
          Select file
          <input
            hidden
            type="file"
            accept=".log,.txt,.json"
            onChange={handleFileChange}
          />
        </Button>

        {file && (
          <Typography sx={{ mt: 3 }} color="text.secondary">
            Selected file: {file.name}
          </Typography>
        )}
      </Box>
    </Box>
  );
}