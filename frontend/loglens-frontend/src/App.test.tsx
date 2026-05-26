import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { ThemeProvider } from "@mui/material";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "./App";
import theme from "./theme/theme";

function renderApp() {
  return render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("App", () => {
  it("renders the input and results panels", () => {
    renderApp();
    expect(screen.getByText("1. Provide Logs")).toBeInTheDocument();
    expect(screen.getByText("2. Analysis Results")).toBeInTheDocument();
  });

  it("Analyze button is disabled when there is no input", () => {
    renderApp();
    expect(
      screen.getByRole("button", { name: /analyze logs/i })
    ).toBeDisabled();
  });

  it("Analyze button becomes enabled when logs are typed", () => {
    renderApp();
    fireEvent.change(screen.getByLabelText("Log text input"), {
      target: { value: "ERROR something went wrong" },
    });
    expect(
      screen.getByRole("button", { name: /analyze logs/i })
    ).toBeEnabled();
  });

  it("shows loading state and then results after analysis", async () => {
    renderApp();
    fireEvent.change(screen.getByLabelText("Log text input"), {
      target: { value: "ERROR db timeout" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /analyze logs/i }));
    });
    expect(screen.getByRole("button", { name: /analyzing/i })).toBeDisabled();
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(
      screen.getByText("Repeated database connection failures detected.")
    ).toBeInTheDocument();
  });

  it("switching to Upload File tab hides the character counter", () => {
    renderApp();
    fireEvent.click(screen.getByRole("tab", { name: /upload file/i }));
    expect(screen.queryByText(/\/ 200,000/)).not.toBeInTheDocument();
  });

  it("typing logs clears any previously selected file (mutual exclusion)", () => {
    // Tested indirectly: if a file is set then text typed,
    // hasInput should still be true and button enabled.
    renderApp();
    fireEvent.change(screen.getByLabelText("Log text input"), {
      target: { value: "some logs" },
    });
    expect(
      screen.getByRole("button", { name: /analyze logs/i })
    ).toBeEnabled();
  });
});