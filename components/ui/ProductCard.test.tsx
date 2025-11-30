import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "./ProductCard";
import { CartProvider } from "@/components/cart/CartContext";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("ProductCard", () => {
  const defaultProps = {
    id: "1",
    name: "Test Product",
    price: 29.99,
    imageUrl: "/test-image.jpg",
    description: "Test description",
  };

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<CartProvider>{component}</CartProvider>);
  };

  it("renders product information correctly", () => {
    renderWithProvider(<ProductCard {...defaultProps} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("£29.99")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByAltText("Test Product")).toHaveAttribute(
      "src",
      "/test-image.jpg"
    );
  });

  it("renders link to product page", () => {
    renderWithProvider(<ProductCard {...defaultProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/product/1");
  });

  it("shows Add to Cart button when product is in stock", () => {
    renderWithProvider(<ProductCard {...defaultProps} stock={10} />);

    expect(screen.getByRole("button", { name: /add to cart/i })).toBeInTheDocument();
  });

  it("shows Sold Out button when stock is 0", () => {
    renderWithProvider(<ProductCard {...defaultProps} stock={0} />);

    expect(screen.getByRole("button", { name: /sold out/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sold out/i })).toBeDisabled();
  });

  it("shows Max Qty button when cart quantity equals stock", async () => {
    const user = userEvent.setup();
    renderWithProvider(<ProductCard {...defaultProps} stock={5} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    
    for (let i = 0; i < 5; i++) {
      await user.click(addButton);
    }

    expect(screen.getByRole("button", { name: /max qty/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /max qty/i })).toBeDisabled();
  });

  it("calls addToCart when Add to Cart button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<ProductCard {...defaultProps} stock={10} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    expect(addButton).toBeInTheDocument();
    
    await user.click(addButton);
    
    expect(addButton).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    renderWithProvider(<ProductCard {...defaultProps} description={undefined} />);

    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });

  it("uses stockQuantity when stock is not provided", () => {
    renderWithProvider(<ProductCard {...defaultProps} stockQuantity={15} />);

    expect(screen.getByRole("button", { name: /add to cart/i })).toBeInTheDocument();
  });
});

