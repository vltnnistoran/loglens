import { TextField } from "@mui/material";

interface TextLogInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextLogInput({ value, onChange }: TextLogInputProps) {
  return (
    <TextField
      fullWidth
      multiline
      minRows={13}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={`Paste your log output here...

Example:
2024-01-15T10:23:45.123Z INFO [App] Server
started on port 3000
2024-01-15T10:24:01.456Z ERROR [DB] Connection
refused: timeout after 30s`}
      variant="outlined"
      slotProps={{
        htmlInput: {
          "aria-label": "Log text input",
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          fontFamily: "monospace",
          fontSize: "1rem",
          color: "#cbd5e1",
          backgroundColor: "rgba(2, 6, 23, 0.35)",
          borderRadius: 2,
          "& fieldset": {
            borderColor: "rgba(139, 92, 246, 0.55)",
          },
          "&:hover fieldset": {
            borderColor: "#8b5cf6",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#8b5cf6",
          },
        },
      }}
    />
  );
}