import { it, describe, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

vi.mock("axios");

describe("App", () => {
  vi.mocked(axios.get).mockImplementation((url) => {
    switch (url) {
      case "/api/beamlines":
        return Promise.resolve({});
      default:
        return Promise.resolve({});
    }
  });

  it("renders welcome page", async () => {
    render(<App />, { wrapper: BrowserRouter });
    expect(
      await screen.findByText(/XAS Standards Database /i)
    ).toBeInTheDocument();
  });
});
