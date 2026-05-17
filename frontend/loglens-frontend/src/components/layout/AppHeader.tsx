import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyAltOutlinedIcon from "@mui/icons-material/PsychologyAltOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import { Box, Typography } from "@mui/material";

const features = [
  { icon: <PsychologyAltOutlinedIcon sx={{ fontSize: 28 }} />, title: "Intelligent Analysis" },
  { icon: <SecurityOutlinedIcon sx={{ fontSize: 28 }} />, title: "Secure & Private" },
  { icon: <SpeedOutlinedIcon sx={{ fontSize: 28 }} />, title: "Fast & Reliable" },
];

export function AppHeader() {
  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        px: { xs: 3, md: 6 },
        py: { xs: 2.5, md: 3 },
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 3,
        background:
          "linear-gradient(135deg, rgba(30,41,91,0.98) 0%, rgba(30,27,75,0.98) 45%, rgba(49,46,129,0.95) 100%)",
        borderBottom: "1px solid rgba(148,163,184,0.12)",
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "3px",
          background: "linear-gradient(90deg, #a855f7, #6366f1, #3b82f6)",
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            flexShrink: 0,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 26, color: "#fff" }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px" }}
          >
            LogLens
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(148,163,184,0.8)", letterSpacing: "0.01em" }}>
            AI-powered log analysis for DevOps teams
          </Typography>
        </Box>
      </Box>

      {/* Features */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          flexWrap: "wrap",
        }}
      >
        {features.map((f, i) => (
          <Box key={f.title} sx={{ display: "flex", alignItems: "center" }}>
            {i > 0 && (
              <Box
                sx={{
                  width: "1px",
                  height: 36,
                  background: "rgba(148,163,184,0.2)",
                  mx: 3,
                }}
              />
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ color: "#8b5cf6", display: "flex", alignItems: "center" }}>
                {f.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                {f.title}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}