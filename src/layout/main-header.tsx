"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { useSession } from "@/lib/auth/components/auth.context";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Comments", href: "/comments" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Support", href: "#support" },
  { label: "Pages", href: "#pages" },
];

export default function MainHeader() {
  const { user, isLoading, signOut } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const activeItem = navItems.find((item) => isActiveLink(item.href));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/80 dark:border-slate-800/80 dark:bg-slate-950/90 dark:supports-backdrop-filter:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Image
          className="dark:hidden w-32 h-auto"
          src="/images/logo/logo.svg"
          alt="Logo"
          width={150}
          height={70}
          style={{ height: "auto" }}
          priority
        />
        <Image
          className="hidden dark:block w-32 h-auto"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width={150}
          height={70}
          style={{ height: "auto" }}
        />
        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-500 md:flex dark:text-slate-400">
          {navItems.map((item) => {
            const isActive = activeItem?.label === item.label;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${
                  isActive
                    ? "bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggleButton />

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          >
            <span className="text-xl leading-none">
              {mobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>

          {/* Desktop auth area */}
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="hidden rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-500 sm:inline-flex"
                  >
                    Dashboard
                  </Link>
                  <div
                    onClick={signOut}
                    className="hidden hover:cursor-pointer items-center gap-3 px-3 py-2 font-medium text-red-700 rounded-lg group text-theme-sm hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-white/5 dark:hover:text-red-300 sm:inline-flex"
                  >
                    <svg
                      className="fill-red-500 group-hover:fill-red-700 dark:group-hover:fill-red-300"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                        fill=""
                      />
                    </svg>
                    Sign out
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="hidden text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 sm:inline-flex"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="hidden rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-500 sm:inline-flex"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/80 px-4 py-4 dark:border-slate-800/80 sm:px-6 md:hidden">
          <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-2">
              {navItems.map((item) => {
                const isActive = activeItem?.label === item.label;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Dashboard
                  </Link>
                  <span
                    onClick={signOut}
                    className="w-full border border-red-300 flex justify-center hover:cursor-pointer items-center gap-3 px-3 py-2 font-medium text-red-700 rounded-lg group text-theme-sm hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-white/5 dark:hover:text-red-300"
                  >
                    <svg
                      className="fill-red-500 group-hover:fill-red-700 dark:group-hover:fill-red-300"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                        fill=""
                      />
                    </svg>
                    Sign out
                  </span>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
