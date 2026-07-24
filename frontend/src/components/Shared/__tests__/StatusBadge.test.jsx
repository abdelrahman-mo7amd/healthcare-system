import React from "react";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../StatusBadge.jsx";

describe("StatusBadge", () => {
  it("renders the status text", () => {
    render(<StatusBadge status="admitted" />);
    expect(screen.getByText("admitted")).toBeInTheDocument();
  });

  it("applies a status-specific class name", () => {
    render(<StatusBadge status="discharged" />);
    expect(screen.getByText("discharged")).toHaveClass("badge-discharged");
  });
});
