import { buildProductQuery } from "./filterProducts";
import { SupabaseClient } from "@supabase/supabase-js";

describe("buildProductQuery", () => {
  let mockSupabase: jest.Mocked<SupabaseClient>;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = {
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };

    mockSupabase = {
      from: jest.fn().mockReturnValue(mockQuery),
    } as any;
  });

  it("should create a basic query without filters", () => {
    buildProductQuery(mockSupabase, {});

    expect(mockSupabase.from).toHaveBeenCalledWith("products");
    expect(mockQuery.select).toHaveBeenCalledWith("*");
  });

  it("should add search filter", () => {
    buildProductQuery(mockSupabase, { search: "test product" });

    expect(mockQuery.or).toHaveBeenCalledWith(
      "name.ilike.%test product%,description.ilike.%test product%"
    );
  });

  it("should trim search term", () => {
    buildProductQuery(mockSupabase, { search: "  test  " });

    expect(mockQuery.or).toHaveBeenCalledWith(
      "name.ilike.%test%,description.ilike.%test%"
    );
  });

  it("should add minPrice filter", () => {
    buildProductQuery(mockSupabase, { minPrice: "10" });

    expect(mockQuery.gte).toHaveBeenCalledWith("price", 10);
  });

  it("should ignore invalid minPrice", () => {
    buildProductQuery(mockSupabase, { minPrice: "invalid" });

    expect(mockQuery.gte).not.toHaveBeenCalled();
  });

  it("should add maxPrice filter", () => {
    buildProductQuery(mockSupabase, { maxPrice: "100" });

    expect(mockQuery.lte).toHaveBeenCalledWith("price", 100);
  });

  it("should ignore invalid maxPrice", () => {
    buildProductQuery(mockSupabase, { maxPrice: "invalid" });

    expect(mockQuery.lte).not.toHaveBeenCalled();
  });

  it("should sort by name ascending by default", () => {
    buildProductQuery(mockSupabase, {});

    expect(mockQuery.order).toHaveBeenCalledWith("name", {
      ascending: true,
    });
  });

  it("should sort by price descending", () => {
    buildProductQuery(mockSupabase, { sort: "price_desc" });

    expect(mockQuery.order).toHaveBeenCalledWith("price", {
      ascending: false,
    });
  });

  it("should handle newest sort option", () => {
    buildProductQuery(mockSupabase, { sort: "newest_desc" });

    expect(mockQuery.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
  });

  it("should combine multiple filters", () => {
    buildProductQuery(mockSupabase, {
      search: "test",
      minPrice: "10",
      maxPrice: "100",
      sort: "price_asc",
    });

    expect(mockQuery.or).toHaveBeenCalled();
    expect(mockQuery.gte).toHaveBeenCalledWith("price", 10);
    expect(mockQuery.lte).toHaveBeenCalledWith("price", 100);
    expect(mockQuery.order).toHaveBeenCalledWith("price", {
      ascending: true,
    });
  });
});

