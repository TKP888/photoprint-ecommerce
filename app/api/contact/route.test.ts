import { POST } from "./route";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("POST /api/contact", () => {
  let mockSupabase: any;
  let mockInsert: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockInsert = jest.fn().mockResolvedValue({ error: null });
    
    mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
        }),
      },
      from: jest.fn().mockReturnValue({
        insert: mockInsert,
      }),
    };

    require("@/lib/supabase/server").createClient.mockReturnValue(mockSupabase);
  });

  it("returns 400 when name is missing", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        message: "This is a test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Name, email, and message are required");
  });

  it("returns 400 when email is missing", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        message: "This is a test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Name, email, and message are required");
  });

  it("returns 400 when message is missing", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Name, email, and message are required");
  });

  it("returns 400 when email format is invalid", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "invalid-email",
        message: "This is a test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid email format");
  });

  it("returns 400 when message is too short", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "Short",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Message must be at least 10 characters long");
  });

  it("successfully saves valid submission", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "This is a valid test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Your message has been sent successfully");
    expect(mockSupabase.from).toHaveBeenCalledWith("contact_submissions");
    expect(mockInsert).toHaveBeenCalled();
  });

  it("trims name, email, and message before saving", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "  Test User  ",
        email: "  test@example.com  ",
        message: "  This is a valid test message  ",
      }),
    });

    const response = await POST(request);
    
    expect(response.status).toBe(200);
    expect(mockSupabase.from).toHaveBeenCalledWith("contact_submissions");
    expect(mockInsert).toHaveBeenCalled();
    
    const insertCall = mockInsert.mock.calls[0]?.[0];
    if (insertCall) {
      expect(insertCall.name).toBe("Test User");
      expect(insertCall.email).toBe("test@example.com");
      expect(insertCall.message).toBe("This is a valid test message");
    }
  });

  it("returns 500 when database insert fails", async () => {
    mockInsert.mockResolvedValue({
      error: { message: "Database error", code: "23505", hint: "Duplicate key" },
    });

    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "This is a valid test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to save submission");
    expect(data.details).toBe("Database error");
  });

  it("handles JSON parse errors", async () => {
    const request = {
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to process contact form");
  });
});

