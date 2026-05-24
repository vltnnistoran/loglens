import type { ReactNode } from "react";
import { Box, Container, Paper } from "@mui/material";
import { AppHeader } from "./AppHeader";

interface DashboardLayoutProps {
  inputPanel: ReactNode;
  resultsPanel: ReactNode;
}

export function DashboardLayout({ inputPanel, resultsPanel }: DashboardLayoutProps) {
  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at top left, rgba(79,70,229,0.18), transparent 35%), radial-gradient(circle at top right, rgba(124,58,237,0.16), transparent 30%), #07111f",
      }}
    >
      <AppHeader />

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Box
          component="main"
          sx={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "0.95fr 1.05fr" },
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              overflow: "auto",
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.78))",
              boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
            }}
          >
            {inputPanel}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              overflow: "auto",
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.78))",
              boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
            }}
          >
            {resultsPanel}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}