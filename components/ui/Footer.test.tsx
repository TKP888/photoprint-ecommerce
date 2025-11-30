import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("Footer", () => {
  it("renders company name and tagline", () => {
    render(<Footer />);

    expect(screen.getByText("PhotoPrint")).toBeInTheDocument();
    expect(screen.getByText("Prints That Inspire.")).toBeInTheDocument();
  });

  it("renders all quick links", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /products/i })).toHaveAttribute("href", "/product");
    expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveAttribute("href", "/contact");
  });

  it("renders contact email", () => {
    render(<Footer />);

    expect(screen.getByText("antonypetsas@gmail.com")).toBeInTheDocument();
  });

  it("renders external social links with correct attributes", () => {
    render(<Footer />);

    const linkedInLink = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedInLink).toHaveAttribute("href", "https://www.linkedin.com/in/akpetsas/");
    expect(linkedInLink).toHaveAttribute("target", "_blank");
    expect(linkedInLink).toHaveAttribute("rel", "noopener noreferrer");

    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/TKP888");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    const websiteLink = screen.getByRole("link", { name: /website/i });
    expect(websiteLink).toHaveAttribute("href", "https://antonypetsas.dev");
    expect(websiteLink).toHaveAttribute("target", "_blank");
    expect(websiteLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders copyright notice", () => {
    render(<Footer />);

    expect(screen.getByText(/Antony Petsas 2025/i)).toBeInTheDocument();
  });
});

