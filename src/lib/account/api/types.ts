export interface AuthSignIn {
  action?: "SIGN_IN" | "SIGN_UP";
}

export interface SessionPayload {
  user: {
    userId: number;
    email: string;
    role: string;
  };
  expiresAt: Date;
  [key: string]: any;
}

export type Session = {
  user: {
    userId?: number;
    email?: string;
    role?: string;
  };
  isAuth: boolean;
  expiresAt?: Date;
};
