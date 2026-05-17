import { Box, Container, Paper } from "@mui/material";
import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";

interface DashboardLayoutProps {
  inputPanel: ReactNode;
  resultsPanel: ReactNode;
}

export function DashboardLayout({
  inputPanel,
  resultsPanel,
}: DashboardLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <AppHeader />

        <Box
          component="main"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minHeight: 520,
            }}
          >
            {inputPanel}
          </Paper>

          <Paper
            elevation={3}
            sx={{
              p: 3,
              minHeight: 520,
            }}
          >
            {resultsPanel}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}