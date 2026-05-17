import { Box, Typography } from "@mui/material";

export function AppHeader() {
  return (
    <Box component="header" sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1">
        LogLens
      </Typography>

      <Typography variant="body1" color="text.secondary">
        AI-assisted log analysis for DevOps monitoring scenarios
      </Typography>
    </Box>
  );
}