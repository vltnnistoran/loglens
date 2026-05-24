import { Box } from "@mui/material";

interface TextLogInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextLogInput({ value, onChange }: TextLogInputProps) {
  return (
    <Box sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Paste your log output here...\n\nExample:\n2024-01-15T10:23:45.123Z INFO [App] Server started on port 3000\n2024-01-15T10:24:01.456Z ERROR [DB] Connection refused: timeout after 30s`}
        aria-label="Log text input"
        style={{
          width: "100%",
          height: "100%",
          resize: "none",
          boxSizing: "border-box",
          fontFamily: "monospace",
          fontSize: "0.95rem",
          color: "#cbd5e1",
          backgroundColor: "rgba(2, 6, 23, 0.35)",
          border: "1px solid rgba(139, 92, 246, 0.55)",
          borderRadius: "8px",
          padding: "12px 14px",
          outline: "none",
          overflowY: "auto",
          lineHeight: 1.6,
          display: "block",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#8b5cf6";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(139, 92, 246, 0.55)";
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#8b5cf6";
        }}
        onMouseLeave={(e) => {
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.55)";
          }
        }}
      />
    </Box>
  );
}