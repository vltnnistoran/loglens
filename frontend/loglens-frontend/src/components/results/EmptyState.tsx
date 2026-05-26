import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Stack, Typography } from "@mui/material";

export function EmptyState() {
  const items = [
    "Anomaly detection",
    "Possible causes",
    "Root cause explanation",
    "Recommended actions",
  ];

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 520,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: 4,
      }}
    >
      <Box
        sx={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          mb: 3,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.35), rgba(99,102,241,0.08))",
          color: "#6366f1",
        }}
      >
        <ArticleOutlinedIcon sx={{ fontSize: 72 }} />
      </Box>

      <Typography variant="h5" sx={{ mb: 1 }}>
        No analysis yet
      </Typography>

      <Box
        sx={{
          mt: 6,
          width: "100%",
          maxWidth: 560,
          border: "1px solid rgba(148,163,184,0.18)",
          borderRadius: 2,
          p: 3,
          backgroundColor: "rgba(15,23,42,0.45)",
        }}
      >
        <Typography sx={{ mb: 2, textAlign: "left" }}>
          What you&apos;ll get:
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 2,
          }}
        >
          {items.map((item) => (
            <Stack
              key={item}
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center" }}
            >
              <DoneAllIcon sx={{ color: "#6366f1", fontSize: 20 }} />
              <Typography>{item}</Typography>
            </Stack>
          ))}
        </Box>
      </Box>
    </Box>
  );
}