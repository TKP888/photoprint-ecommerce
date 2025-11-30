import { GET } from "./route";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/products/filterProducts", () => ({
  buildProductQuery: jest.fn(),
}));

describe("GET /api/search", () => {
  let mockSupabase: any;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = {
      limit: jest.fn().mockResolvedValue({
        data: [{ id: "1", name: "Test Product" }],
        error: null,
      }),
    };

    mockSupabase = {};

    require("@/lib/supabase/server").createClient.mockReturnValue(mockSupabase);
    require("@/lib/products/filterProducts").buildProductQuery.mockReturnValue(
      mockQuery
    );
  });

  it("returns 400 when query is missing", async () => {
    const request = new Request("http://localhost/api/search");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Search query must be at least 2 characters");
  });

  it("returns 400 when query is too short", async () => {
    const request = new Request("http://localhost/api/search?q=a");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Search query must be at least 2 characters");
  });

  it("returns 400 when query is only whitespace", async () => {
    const request = new Request("http://localhost/api/search?q=  ");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Search query must be at least 2 characters");
  });

  it("successfully returns search results", async () => {
    const request = new Request("http://localhost/api/search?q=test");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.products).toEqual([{ id: "1", name: "Test Product" }]);
  });

  it("trims query before searching", async () => {
    const request = new Request("http://localhost/api/search?q=  test  ");

    await GET(request);

    expect(
      require("@/lib/products/filterProducts").buildProductQuery
    ).toHaveBeenCalledWith(mockSupabase, {
      search: "test",
      sort: "name_asc",
    });
  });

  it("calls buildProductQuery with correct parameters", async () => {
    const request = new Request("http://localhost/api/search?q=product");

    await GET(request);

    expect(
      require("@/lib/products/filterProducts").buildProductQuery
    ).toHaveBeenCalledWith(mockSupabase, {
      search: "product",
      sort: "name_asc",
    });
  });

  it("limits results to 8 products", async () => {
    const request = new Request("http://localhost/api/search?q=test");

    await GET(request);

    expect(mockQuery.limit).toHaveBeenCalledWith(8);
  });

  it("returns 500 when database query fails", async () => {
    mockQuery.limit.mockResolvedValue({
      data: null,
      error: { message: "Database error" },
    });

    const request = new Request("http://localhost/api/search?q=test");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to search products");
    expect(data.details).toBe("Database error");
  });

  it("handles errors gracefully", async () => {
    require("@/lib/products/filterProducts").buildProductQuery.mockImplementation(
      () => {
        throw new Error("Unexpected error");
      }
    );

    const request = new Request("http://localhost/api/search?q=test");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to process search");
  });
});

