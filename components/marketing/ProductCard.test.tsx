import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import { products } from "@/content/products";

describe("ProductCard", () => {
  const sdk = products.find((p) => p.slug === "id-scanner-sdk")!;

  it("links to the product page and shows summary by default", () => {
    render(<ProductCard product={sdk} />);
    const link = screen.getByRole("link", { name: sdk.name });
    expect(link.getAttribute("href")).toBe("/products/id-scanner-sdk");
    expect(screen.getByText(sdk.summary)).toBeTruthy();
    expect(screen.queryByText(sdk.description)).toBeNull();
  });

  it("shows the long description when detailed", () => {
    render(<ProductCard product={sdk} detailed />);
    expect(screen.getByText(sdk.description)).toBeTruthy();
  });

  it("renders the status pill", () => {
    render(<ProductCard product={sdk} />);
    expect(screen.getByText("In development")).toBeTruthy();
  });
});
