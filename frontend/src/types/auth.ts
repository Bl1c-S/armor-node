export interface ArmorToken {
  userId: string;
  loginProvider: string;
  name: string;
  value: string;
}

export interface ArmorTokens {
  accessToken: ArmorToken;
  refreshToken: ArmorToken;
}

export interface AuthResponse {
  tokens: ArmorTokens;
}

export interface AuthUser {
  id: string;
  email: string;
  userName?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  unique_name?: string;
  name?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface UserContextType {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}
