import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner.jsx";

describe("LoadingSpinner", () => {
  it("shows the default label", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows a custom label when provided", () => {
    render(<LoadingSpinner label="Fetching patients..." />);
    expect(screen.getByText("Fetching patients...")).toBeInTheDocument();
  });
});
