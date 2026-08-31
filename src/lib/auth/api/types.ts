/**
 * Auth types — API contracts and session shapes (no validation)
 * See: src/lib/auth/schemas/auth.ts for form validation
 */

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

/**
 * Type representing the result of session verification.
 */
export type Session = {
  user: {
    userId?: number;
    email?: string;
    role?: string;
  };
  isAuth: boolean;
  expiresAt?: Date;
};
