"use client";

import Image from "next/image";
import { ArrowDownIcon } from "@/icons";

export default function Home() {
  return (
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-6 lg:grid-cols-2 lg:px-10 lg:py-8">
        <div className="flex flex-col justify-center">
          <p className="mb-5 text-lg text-slate-500 dark:text-slate-400">
            Crafted for fast-moving apps, software products, and SaaS startups
          </p>
          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl dark:text-slate-50">
            Next.js Template for{" "}
            <span className="text-indigo-500 dark:text-indigo-400">
              Fast App Development
            </span>
            .
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A clean, modern Next.js starter template designed to help you launch
            websites and applications quickly, with built-in light and dark mode
            support.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-md bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              Download Now
              <ArrowDownIcon className="rounded-full border border-current/20 items-center flex text-xs text-slate-100" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-4 text-base font-semibold text-slate-900 dark:text-slate-50"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-400 text-lg dark:border-slate-800">
                ▶
              </span>
              <span>
                Watch Demo
                <span className="block font-normal text-slate-600 dark:text-slate-400">
                  Watch the product experience
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative hidden sm:flex items-center justify-center">
          <div className="absolute right-10 top-8 h-72 w-72 rounded-full bg-indigo-300/70 blur-3xl dark:bg-indigo-500/20" />
          <div className="relative w-full max-w-115 overflow-hidden rounded-[2.8rem] border border-slate-200 bg-slate-900 shadow-[0_35px_90px_rgba(79,70,229,0.18)] dark:border-slate-800">
            <div className="relative h-140 w-full">
              <Image
                src="/images/developer.jpg"
                alt="Developer workspace"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 460px"
              />

              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="rounded-3xl border border-white/15 bg-black/35 p-5 text-white shadow-2xl backdrop-blur-md sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                    Developer mode
                  </p>
                  <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                    Build faster with a clean Next.js starter.
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                    A focused hero image, soft blur, and strong contrast for a
                    polished landing page in light and dark mode.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
