import { Address } from "@/lib/addresses/api/types";
import { Meta } from "@/lib/shared/types";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  BANNED = "BANNED",
  DELETED = "DELETED",
}

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  addrSize?: number;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  email: string;
  role?: UserRole;
}

// ============================================================================
// REQUEST & RESPONSE TYPES
// ============================================================================

export type UserFilters = {
  page?: number;
  size?: number;
  role?: UserRole | string;
  status?: UserStatus | string;
  search?: string;
  sort?: string;
};

export type UsersResponse = {
  data: User[];
  meta: Meta;
};

export interface UserLogin {
  token: string;
  refreshToken: string;
  user: User;
}
