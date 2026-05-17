import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyAltOutlinedIcon from "@mui/icons-material/PsychologyAltOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import { Box, Tooltip, Typography } from "@mui/material";

const features = [
    {
        icon: <PsychologyAltOutlinedIcon sx={{ fontSize: 28 }} />,
        title: "Intelligent Analysis",
        description: "Detect anomalies and explain root causes",
    },
    {
        icon: <SecurityOutlinedIcon sx={{ fontSize: 28 }} />,
        title: "Secure & Private",
        description: "Your data will not be stored",
    },
    {
        icon: <SpeedOutlinedIcon sx={{ fontSize: 28 }} />,
        title: "Fast & Reliable",
        description: "Get insights in seconds",
    },
];

export function AppHeader() {
  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        textAlign: "left",
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2,  mr: "auto" }}>
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
        {features.map((feature, index) => (
          <Box
            key={feature.title}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {index > 0 && (
              <Box
                sx={{
                  width: "1px",
                  height: 36,
                  background: "rgba(148,163,184,0.2)",
                  mx: 3,
                }}
              />
            )}

            <Tooltip
              title={feature.description}
              arrow
              placement="bottom"
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#111827",
                    color: "#f8fafc",
                    border: "1px solid rgba(148,163,184,0.2)",
                    fontSize: "0.8rem",
                  },
                },
                arrow: {
                  sx: {
                    color: "#111827",
                  },
                },
              }}
            >
              <Box
                tabIndex={0}
                role="button"
                aria-label={`${feature.title}: ${feature.description}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "help",
                  borderRadius: 2,
                  px: 1,
                  py: 0.75,
                  transition: "background-color 0.2s ease",
                  "&:hover, &:focus-visible": {
                    backgroundColor: "rgba(139,92,246,0.12)",
                    outline: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    color: "#8b5cf6",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {feature.icon}
                </Box>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  {feature.title}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Box>
  );
}