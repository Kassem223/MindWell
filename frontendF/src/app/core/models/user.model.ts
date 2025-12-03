export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  phone?: string;
  avatar?: string;
  createdAt: string;
  connectedAccounts?: {
    google?: boolean;
    facebook?: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Login response from backend (only contains token)
export interface LoginResponse {
  token: string;
}

