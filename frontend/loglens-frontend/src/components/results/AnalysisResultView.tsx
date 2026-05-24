import {
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
  } from "@mui/material";
  import type { AnalysisResult } from "../../models/AnalysisResult";
  import { SeverityBadge } from "./SeverityBadge";
  
  interface AnalysisResultViewProps {
    result: AnalysisResult;
  }
  
  export function AnalysisResultView({ result }: AnalysisResultViewProps) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
          <Typography variant="h6">{result.summary}</Typography>
          <SeverityBadge severity={result.severity} />
        </Stack>
  
        <Card sx={{ mb: 2, backgroundColor: "rgba(15,23,42,0.55)" }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
              Explanation
            </Typography>
            <Typography color="text.secondary">{result.explanation}</Typography>
          </CardContent>
        </Card>
  
        <Card sx={{ mb: 2, backgroundColor: "rgba(15,23,42,0.55)" }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
              Possible Causes
            </Typography>
            <List dense>
              {result.possibleCauses.map((cause) => (
                <ListItem key={cause}>
                  <ListItemText primary={cause} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
  
        <Card sx={{ backgroundColor: "rgba(15,23,42,0.55)" }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
              Suggested Fixes
            </Typography>
            <List dense>
              {result.suggestedFixes.map((fix) => (
                <ListItem key={fix}>
                  <ListItemText primary={fix} />
                </ListItem>
              ))}
            </List>
  
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Confidence: {result.confidence}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }