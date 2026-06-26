import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { describe, it, expect } from "vitest";
import { ResultsPanel } from "../../components/results/ResultsPanel";
import type { AnalysisResult } from "../../models/AnalysisResult";
import theme from "../../theme/theme";

const mockResult: AnalysisResult = {
  anomalyDetected: true,
  severity: "High",
  summary: "Critical memory leak detected.",
  explanation: "Memory usage climbed steadily over 6 hours until OOM.",
  possibleCauses: ["Unclosed database connections", "Unbounded cache growth"],
  suggestedFixes: ["Restart the service", "Profile heap usage"],
  confidence: "High",
  detectedPatterns: [
  "High number of ERROR entries detected: 4",
  "Repeated log messages detected",
  ],
};

function renderPanel(result: AnalysisResult | null, loading = false) {
  return render(
    <ThemeProvider theme={theme}>
      <ResultsPanel result={result} loading={loading} />
    </ThemeProvider>
  );
}

describe("ResultsPanel", () => {
  it("shows the empty state when there is no result and not loading", () => {
    renderPanel(null);
    expect(screen.getByText("No analysis yet")).toBeInTheDocument();
  });

  it("shows the skeleton when loading", () => {
    const { container } = renderPanel(null, true);
    // MUI Skeleton renders with role="progressbar" by default in some versions;
    // we check that the empty state is NOT shown instead.
    expect(screen.queryByText("No analysis yet")).not.toBeInTheDocument();
    expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
  });

  it("does not show the empty state while loading", () => {
    renderPanel(null, true);
    expect(screen.queryByText("No analysis yet")).not.toBeInTheDocument();
  });

  it("renders the result summary when a result is provided", () => {
    renderPanel(mockResult);
    expect(screen.getByText("Critical memory leak detected.")).toBeInTheDocument();
  });

  it("renders possible causes", () => {
    renderPanel(mockResult);
    expect(screen.getByText("Unclosed database connections")).toBeInTheDocument();
    expect(screen.getByText("Unbounded cache growth")).toBeInTheDocument();
  });

  it("renders suggested fixes", () => {
    renderPanel(mockResult);
    expect(screen.getByText("Restart the service")).toBeInTheDocument();
    expect(screen.getByText("Profile heap usage")).toBeInTheDocument();
  });

  it("renders the explanation", () => {
    renderPanel(mockResult);
    expect(
      screen.getByText("Memory usage climbed steadily over 6 hours until OOM.")
    ).toBeInTheDocument();
  });

  it("shows result and not skeleton when result is provided and not loading", () => {
    const { container } = renderPanel(mockResult, false);
    expect(container.querySelector(".MuiSkeleton-root")).not.toBeInTheDocument();
  });

  it("always renders the panel header", () => {
    renderPanel(null);
    expect(screen.getByText("2. Analysis Results")).toBeInTheDocument();
  });
});