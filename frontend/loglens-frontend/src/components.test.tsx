import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { describe, it, expect, vi } from "vitest";
import { SeverityBadge } from "./components/results/SeverityBadge";
import { ConfidenceBadge } from "./components/results/ConfidenceBadge";
import { EmptyState } from "./components/results/EmptyState";
import { FileLogUpload } from "./components/log-input/FileLogUpload";
import theme from "./theme/theme";

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

// ─── SeverityBadge ───────────────────────────────────────────────────────────

describe("SeverityBadge", () => {
  it("renders the severity label", () => {
    wrap(<SeverityBadge severity="High" />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it.each([
    ["High", "error"],
    ["Medium", "warning"],
    ["Low", "success"],
  ] as const)(
    "applies the correct MUI color class for severity %s",
    (severity, expectedColor) => {
      wrap(<SeverityBadge severity={severity} />);
      const chip = screen.getByText(severity).closest(".MuiChip-root");
      expect(chip?.className).toContain(`MuiChip-color${expectedColor.charAt(0).toUpperCase() + expectedColor.slice(1)}`);
    }
  );
});

// ─── ConfidenceBadge ─────────────────────────────────────────────────────────

describe("ConfidenceBadge", () => {
  it("renders the confidence label", () => {
    wrap(<ConfidenceBadge confidence="Medium" />);
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it.each([
    ["High", "success"],
    ["Medium", "warning"],
    ["Low", "error"],
  ] as const)(
    "applies the correct MUI color class for confidence %s",
    (confidence, expectedColor) => {
      wrap(<ConfidenceBadge confidence={confidence} />);
      const chip = screen.getByText(confidence).closest(".MuiChip-root");
      expect(chip?.className).toContain(`MuiChip-color${expectedColor.charAt(0).toUpperCase() + expectedColor.slice(1)}`);
    }
  );
});

// ─── EmptyState ──────────────────────────────────────────────────────────────

describe("EmptyState", () => {
  it("renders the heading", () => {
    wrap(<EmptyState />);
    expect(screen.getByText("No analysis yet")).toBeInTheDocument();
  });

  it("lists all four capability items", () => {
    wrap(<EmptyState />);
    expect(screen.getByText("Anomaly detection")).toBeInTheDocument();
    expect(screen.getByText("Possible causes")).toBeInTheDocument();
    expect(screen.getByText("Root cause explanation")).toBeInTheDocument();
    expect(screen.getByText("Recommended actions")).toBeInTheDocument();
  });
});

// ─── FileLogUpload ───────────────────────────────────────────────────────────

describe("FileLogUpload", () => {
  it("renders the upload prompt when no file is selected", () => {
    wrap(<FileLogUpload file={null} onFileChange={vi.fn()} />);
    expect(screen.getByText("Upload log file")).toBeInTheDocument();
    expect(screen.getByText(/\.log, \.txt, \.json/)).toBeInTheDocument();
  });

  it("shows the file name when a file is selected", () => {
    const file = new File(["content"], "app.log", { type: "text/plain" });
    wrap(<FileLogUpload file={file} onFileChange={vi.fn()} />);
    expect(screen.getByText("app.log")).toBeInTheDocument();
  });

  it("shows replace hint when a file is already selected", () => {
    const file = new File(["content"], "app.log", { type: "text/plain" });
    wrap(<FileLogUpload file={file} onFileChange={vi.fn()} />);
    expect(screen.getByText("Click or drag to replace")).toBeInTheDocument();
  });

  it("is keyboard accessible with Enter key", () => {
    const onFileChange = vi.fn();
    wrap(<FileLogUpload file={null} onFileChange={onFileChange} />);
    const dropzone = screen.getByRole("button", { name: /upload log file/i });
    // Firing Enter should attempt to open the file dialog (click the hidden input).
    // We can only verify no error is thrown since jsdom can't open real dialogs.
    expect(() => fireEvent.keyDown(dropzone, { key: "Enter" })).not.toThrow();
  });

  it("calls onFileChange when a file is dropped", () => {
    const onFileChange = vi.fn();
    wrap(<FileLogUpload file={null} onFileChange={onFileChange} />);
    const dropzone = screen.getByRole("button", { name: /upload log file/i });
    const file = new File(["log content"], "server.log", { type: "text/plain" });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });
    expect(onFileChange).toHaveBeenCalledWith(file);
  });
});