"use client";

import Image from "next/image";
import { TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { CellActions } from "./cell-action";
import { User, UserStatus } from "@/lib/users/api/types";

interface UserTableRowProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function Row({ user, onView, onEdit, onDelete }: UserTableRowProps) {
  const getFullName = () => `${user.firstName} ${user.lastName}`;
  const getUserAvatar = () =>
    user.avatarUrl || "/images/user/default-avatar.jpg";

  const cells = [
    {
      key: "email",
      value: user.email,
    },
    {
      key: "phone",
      value: user.phoneNumber,
    },
    {
      key: "role",
      value: (
        <Badge size="sm" color={user.role === "ADMIN" ? "primary" : "success"}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: "status",
      value: (
        <Badge
          size="sm"
          color={user.status === UserStatus.ACTIVE ? "success" : "error"}
        >
          {user.status === UserStatus.ACTIVE ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <TableRow className="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-900 dark:even:bg-gray-800/60">
      {/* User */}
      <TableCell className="px-4 py-3 text-center align-middle text-theme-sm text-gray-500 dark:text-gray-400">
        {user.id}
      </TableCell>
      <TableCell className="px-4 py-3 text-center align-middle text-theme-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3 sm:ps-10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            {user.avatarUrl ? (
              <Image
                width={40}
                height={40}
                src={getUserAvatar()}
                alt={getFullName()}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            )}
          </div>

          <span className="font-medium text-gray-800 dark:text-white/90">
            {getFullName()}
          </span>
        </div>
      </TableCell>

      {/* Dynamic cells */}
      {cells.map((cell) => (
        <TableCell
          key={cell.key}
          className="px-4 py-3 text-center align-middle text-theme-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center justify-center">{cell.value}</div>
        </TableCell>
      ))}

      {/* Actions */}
      <TableCell>
        <div className="flex items-center justify-center">
          <CellActions
            user={user}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
