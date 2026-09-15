import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, StatusBadge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Hello</Badge>);
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("shows the human label for each product status", () => {
    render(<StatusBadge status="in-development" />);
    expect(screen.getByText("In development")).toBeTruthy();
    render(<StatusBadge status="research" />);
    expect(screen.getByText("Research phase")).toBeTruthy();
  });
});
