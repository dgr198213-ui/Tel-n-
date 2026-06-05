export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  provider: string;
}

export interface IAuthGateway {
  verifyToken(token: string): Promise<AuthUser | null>;
  getUserById(id: string): Promise<AuthUser | null>;
}
