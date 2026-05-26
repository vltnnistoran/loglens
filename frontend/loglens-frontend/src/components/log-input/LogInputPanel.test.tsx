import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { describe, it, expect, vi } from "vitest";
import { LogInputPanel } from "../../components/log-input/LogInputPanel";
import theme from "../../theme/theme";

function renderPanel(overrides = {}) {
  const props = {
    logs: "",
    file: null,
    hasInput: false,
    loading: false,
    onLogsChange: vi.fn(),
    onFileChange: vi.fn(),
    onAnalyze: vi.fn(),
    ...overrides,
  };
  return {
    ...render(
      <ThemeProvider theme={theme}>
        <LogInputPanel {...props} />
      </ThemeProvider>
    ),
    props,
  };
}

describe("LogInputPanel", () => {
  it("renders both input tabs", () => {
    renderPanel();
    expect(screen.getByRole("tab", { name: /paste logs/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /upload file/i })).toBeInTheDocument();
  });

  it("shows the textarea on the Paste Logs tab by default", () => {
    renderPanel();
    expect(screen.getByLabelText("Log text input")).toBeInTheDocument();
  });

  it("shows the file upload zone when Upload File tab is selected", () => {
    renderPanel();
    fireEvent.click(screen.getByRole("tab", { name: /upload file/i }));
    expect(screen.getByLabelText("Upload log file")).toBeInTheDocument();
  });

  it("shows character count on the Paste Logs tab", () => {
    renderPanel({ logs: "hello" });
    expect(screen.getByText("5 / 200,000")).toBeInTheDocument();
  });

  it("hides character count on the Upload File tab", () => {
    renderPanel();
    fireEvent.click(screen.getByRole("tab", { name: /upload file/i }));
    expect(screen.queryByText(/\/ 200,000/)).not.toBeInTheDocument();
  });

  it("Analyze button is disabled when hasInput is false", () => {
    renderPanel({ hasInput: false });
    expect(screen.getByRole("button", { name: /analyze logs/i })).toBeDisabled();
  });

  it("Analyze button is enabled when hasInput is true", () => {
    renderPanel({ hasInput: true });
    expect(screen.getByRole("button", { name: /analyze logs/i })).toBeEnabled();
  });

  it("Analyze button is disabled while loading even with input", () => {
    renderPanel({ hasInput: true, loading: true });
    expect(screen.getByRole("button", { name: /analyzing/i })).toBeDisabled();
  });

  it("calls onAnalyze when the button is clicked", () => {
    const { props } = renderPanel({ hasInput: true });
    fireEvent.click(screen.getByRole("button", { name: /analyze logs/i }));
    expect(props.onAnalyze).toHaveBeenCalledOnce();
  });

  it("calls onLogsChange when text is typed", () => {
    const { props } = renderPanel();
    fireEvent.change(screen.getByLabelText("Log text input"), {
      target: { value: "new log line" },
    });
    expect(props.onLogsChange).toHaveBeenCalledWith("new log line");
  });

  it("shows privacy notice", () => {
    renderPanel();
    expect(screen.getByText("Your data will not be stored.")).toBeInTheDocument();
  });
});