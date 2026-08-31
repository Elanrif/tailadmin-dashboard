"use client";

import { User } from "../api/types";
import { useState } from "react";
import {
  User as UserIcon,
  MapPin,
  Mail,
  CalendarDays,
  Hash,
} from "lucide-react";
import Image from "next/image";
import { Addresses } from "@/lib/addresses/component/addresses";
import notFound from "@/app/not-found";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userByIdOptions } from "../api/queries/queries.client";

export default function UserDetails({ userId }: { userId: number }) {
  const [activeTab, setActiveTab] = useState<"info" | "addresses">("info");
  const { data } = useSuspenseQuery(userByIdOptions(userId));
  if (!data.ok) {
    notFound();
    return null;
  }
  const user: User = data.data;

  const tabs = [
    {
      id: "info" as const,
      label: "Informations",
      icon: UserIcon,
    },
    {
      id: "addresses" as const,
      label: "Adresses",
      count: user.addrSize || 0,
      icon: MapPin,
    },
  ];

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="flex max-h-[90vh] flex-col overflow-y-auto bg-white dark:bg-gray-950">
      {/* ========================================================= */}
      {/* STICKY HEADER */}
      {/* ========================================================= */}

      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
        <div className="px-6 pb-0 pt-6 lg:px-10">
          {/* User identity */}
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-500 dark:text-gray-300">
                    {initials || <UserIcon className="h-8 w-8" />}
                  </span>
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="truncate text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h1>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  Utilisateur
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>

                <span className="hidden text-gray-300 sm:inline dark:text-gray-700">
                  •
                </span>

                <span className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" />
                  {user.id}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="mt-6 flex gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  <span>{tab.label}</span>

                  {tab.count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}

                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}

      <main className="px-6 py-6 lg:px-10">
        {/* ======================================================= */}
        {/* INFORMATIONS */}
        {/* ======================================================= */}

        {activeTab === "info" && (
          <div className="mx-auto max-w-3xl">
            {/* Section title */}
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Informations personnelles
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Informations principales de l&apos;utilisateur.
              </p>
            </div>

            {/* Personal information card */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              {/* First name */}
              <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Prénom
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {user.firstName || "—"}
                  </p>
                </div>

                <UserIcon className="hidden h-5 w-5 text-gray-300 sm:block dark:text-gray-600" />
              </div>

              {/* Last name */}
              <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Nom
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {user.lastName || "—"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Adresse email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-900 dark:text-white">
                    {user.email || "—"}
                  </p>
                </div>

                <Mail className="hidden h-5 w-5 shrink-0 text-gray-300 sm:block dark:text-gray-600" />
              </div>

              {/* Created */}
              <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Date de création
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(user.createdAt)}
                  </p>
                </div>

                <CalendarDays className="hidden h-5 w-5 text-gray-300 sm:block dark:text-gray-600" />
              </div>

              {/* Updated */}
              <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Dernière modification
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>

                <CalendarDays className="hidden h-5 w-5 text-gray-300 sm:block dark:text-gray-600" />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* ADDRESSES */}
        {/* ======================================================= */}

        {activeTab === "addresses" && <Addresses queryParams={{ userId: user.id }} />}
      </main>
    </div>
  );
}
