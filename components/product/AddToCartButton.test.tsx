import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddToCartButton from "./AddToCartButton";
import { CartProvider } from "@/components/cart/CartContext";

describe("AddToCartButton", () => {
  const defaultProps = {
    id: "1",
    name: "Test Product",
    price: 29.99,
    imageUrl: "/test-image.jpg",
  };

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<CartProvider>{component}</CartProvider>);
  };

  it("renders Add to Cart button when product is in stock", () => {
    renderWithProvider(<AddToCartButton {...defaultProps} stock={10} />);

    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).not.toBeDisabled();
  });

  it("shows Sold Out button when stock is 0", () => {
    renderWithProvider(<AddToCartButton {...defaultProps} stock={0} />);

    expect(screen.getByRole("button", { name: /sold out/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sold out/i })).toBeDisabled();
  });

  it("shows Max Quantity Reached when cart quantity equals stock", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AddToCartButton {...defaultProps} stock={3} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    
    for (let i = 0; i < 3; i++) {
      await user.click(addButton);
    }

    expect(
      screen.getByRole("button", { name: /max quantity reached/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /max quantity reached/i })
    ).toBeDisabled();
  });

  it("calls addToCart when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AddToCartButton {...defaultProps} stock={10} />);

    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeInTheDocument();
    
    await user.click(button);
    
    expect(button).toBeInTheDocument();
  });

  it("does not call addToCart when sold out", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AddToCartButton {...defaultProps} stock={0} />);

    const button = screen.getByRole("button", { name: /sold out/i });
    expect(button).toBeDisabled();
    
    await user.click(button);
    
    expect(button).toBeDisabled();
  });

  it("does not call addToCart when at max quantity", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AddToCartButton {...defaultProps} stock={5} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    
    for (let i = 0; i < 5; i++) {
      await user.click(addButton);
    }

    const maxButton = screen.getByRole("button", { name: /max quantity reached/i });
    expect(maxButton).toBeDisabled();
    
    await user.click(maxButton);
    
    expect(maxButton).toBeDisabled();
  });

  it("uses stockQuantity when stock is not provided", () => {
    renderWithProvider(<AddToCartButton {...defaultProps} stockQuantity={15} />);

    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });
});

