import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features API", href: "/features" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Users management", href: "/dashboard/users" },
      { label: "Profile", href: "/account/profile" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "UI components", href: "/dashboard/buttons" },
      { label: "Tables", href: "/dashboard/basic-tables" },
      { label: "Charts", href: "/dashboard/line-chart" },
      { label: "Calendar", href: "/dashboard/calendar" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Create account", href: "/sign-up" },
      { label: "Reset password", href: "/reset-password" },
      { label: "My account", href: "/account" },
    ],
  },
];

export default function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2fr]">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-50"
            >
              <span className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-4 w-4 rounded-full bg-indigo-500" />
                <span className="h-7 w-2 rounded-full bg-indigo-400" />
                <span className="h-4 w-4 rounded-full bg-indigo-500" />
              </span>
              <span>El-Anrif</span>
            </Link>

            <p className="mt-4 text-sm leading-6">
              A modern Next.js admin dashboard template for SaaS teams,
              authenticated apps, API-driven features, and clean product
              launches.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-500"
              >
                Start building
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
              >
                Explore API
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm transition hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} El-Anrif. All rights reserved.
          </p>
          <p>Built with Next.js, React, Tailwind CSS, and API-first patterns.</p>
        </div>
      </div>
    </footer>
  );
}
