import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { Box, Typography } from "@mui/material";
import { useRef } from "react";

interface FileLogUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileLogUpload({ file, onFileChange }: FileLogUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    onFileChange(selectedFile);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    onFileChange(droppedFile);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".log,.txt,.json"
        onChange={handleFileChange}
      />
      <Box
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
        tabIndex={0}
        aria-label="Upload log file"
        onKeyDown={(e) => e.key === "Enter" || e.key === " " ? inputRef.current?.click() : undefined}
        sx={{
          height: "100%",
          border: "1px dashed rgba(139, 92, 246, 0.6)",
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          p: 4,
          backgroundColor: "rgba(2, 6, 23, 0.35)",
          cursor: "pointer",
          transition: "border-color 0.2s, background-color 0.2s",
          "&:hover, &:focus-visible": {
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139, 92, 246, 0.07)",
            outline: "none",
          },
        }}
      >
        <Box>
          <UploadFileOutlinedIcon sx={{ fontSize: 48, color: "#8b5cf6", mb: 2 }} />

          <Typography variant="h6" sx={{ mb: 1 }}>
            {file ? file.name : "Upload log file"}
          </Typography>

          <Typography color="text.secondary">
            {file
              ? "Click or drag to replace"
              : "Click anywhere or drag & drop · .log, .txt, .json"}
          </Typography>
        </Box>
      </Box>
    </>
  );
}