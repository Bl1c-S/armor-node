import {AuthResponse, AuthUser, LoginCredentials, RegisterCredentials,} from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";

export class AuthApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthApiError";
    this.statusCode = statusCode;
  }
}

export const authApi = {
  /**
   * Registers a new user with email and password.
   */
  async register(credentials: RegisterCredentials): Promise<void> {
    const url = `${API_BASE_URL}/api/auth/email/register`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message = "Registration failed. Please check your credentials.";
      try {
        const json = JSON.parse(errorText);
        message = json.message || json.detail || json.title || errorText || message;
      } catch {
        if (errorText) message = errorText;
      }
      throw new AuthApiError(message, response.status);
    }
  },

  /**
   * Logs in a user using email and password, returning access and refresh tokens.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const url = `${API_BASE_URL}/api/auth/email/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthApiError("Invalid email or password.", 401);
      }
      const errorText = await response.text();
      throw new AuthApiError(
        errorText || "Login failed. Please try again later.",
        response.status
      );
    }

    return (await response.json()) as AuthResponse;
  },

  /**
   * Refreshes access token using refresh token.
   */
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const url = `${API_BASE_URL}/api/auth/email/refresh`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new AuthApiError("Refresh token expired or invalid.", response.status);
    }

    return (await response.json()) as AuthResponse;
  },

  /**
   * Fetches current authenticated user details from the backend.
   */
  async getMe(accessToken: string): Promise<AuthUser> {
    const url = `${API_BASE_URL}/api/auth/email/me`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new AuthApiError("Failed to fetch user session.", response.status);
    }

    return (await response.json()) as AuthUser;
  },
};
