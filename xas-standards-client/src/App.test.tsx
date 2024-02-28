import { it, describe } from "vitest";
import { render } from "@testing-library/react";

import App from "./App";
import { BrowserRouter } from "react-router-dom";

describe("App", () => {
  it("renders welcome page", () => {
    render(<App />, { wrapper: BrowserRouter });
  });
});
