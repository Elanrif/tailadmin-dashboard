"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import BackButton from "@/layout/back-button";
import Link from "next/link";

export default function ResetPasswordForm() {
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <BackButton link="/" text="Back to Home" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-md dark:text-white/90 sm:text-3xl">
              Forgot Your Password?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the email address linked to your account, and we’ll send you
              a link to reset your password.
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-red-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" type="email" />
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600">
                    Send Reset Link
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Wait, I remember my password...
                <Link
                  href="/sign-in"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                >
                  Click here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
