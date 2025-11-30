import "@testing-library/jest-dom";

global.Request = class Request {
  constructor(input, init = {}) {
    this.url = typeof input === "string" ? input : input.url;
    this.method = init.method || "GET";
    this.headers = new Headers(init.headers);
    this._body = typeof init.body === "string" ? init.body : JSON.stringify(init.body || {});
  }

  async json() {
    try {
      return JSON.parse(this._body || "{}");
    } catch {
      return {};
    }
  }
};

global.Headers = class Headers {
  constructor(init = {}) {
    this._headers = {};
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this._headers[key.toLowerCase()] = value;
      });
    }
  }

  get(name) {
    return this._headers[name.toLowerCase()];
  }

  set(name, value) {
    this._headers[name.toLowerCase()] = value;
  }
};

global.URL = class URL {
  constructor(url, base) {
    this.href = base ? new URL(url, base).href : url;
    this.searchParams = new URLSearchParams(url.includes("?") ? url.split("?")[1] : "");
  }
};

global.URLSearchParams = class URLSearchParams {
  constructor(init) {
    this._params = new Map();
    if (typeof init === "string") {
      init.split("&").forEach((pair) => {
        const [key, value] = pair.split("=");
        if (key) this._params.set(key, value || "");
      });
    }
  }

  get(name) {
    return this._params.get(name) || null;
  }

  set(name, value) {
    this._params.set(name, value);
  }
};

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || "";
    this.headers = new Headers(init.headers);
    this.ok = this.status >= 200 && this.status < 300;
  }

  async json() {
    return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
  }
};

jest.mock("@/components/auth/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: null,
    session: null,
    loading: false,
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    sendResetEmail: jest.fn(),
  }),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (data, init) => {
      return new Response(JSON.stringify(data), {
        status: init?.status || 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  },
}));

