"use client";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import BackButton from "@/layout/back-button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";

export default function TwoStepVerification() {
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <BackButton link="/" text="Back to Home" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-md dark:text-white/90 sm:text-3xl">
              Two Step Verification
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A verification code has been sent to your mobile. Please enter it
              in the field below.
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-6">
                <Field className="w-fit">
                  <FieldLabel htmlFor="round-sep">
                    Type your 6 digits security code
                  </FieldLabel>
                  <InputOTP
                    id="round-sep"
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <div className="flex items-center gap-3">
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot
                          index={0}
                          className="rounded-full h-12 w-12 [&>input]:rounded-full [&>input]:text-center"
                        />
                        <InputOTPSlot
                          index={1}
                          className="rounded-full h-12 w-12 [&>input]:rounded-full [&>input]:text-center"
                        />
                        <InputOTPSlot
                          index={2}
                          className="rounded-full h-12 w-12 [&>input]:rounded-full [&>input]:text-center"
                        />
                      </InputOTPGroup>
                      <span className="text-2xl font-bold text-gray-300 dark:text-gray-700">
                        —
                      </span>
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot
                          index={3}
                          className="rounded-full h-12 w-12 [&>input]:rounded-full [&>input]:text-center"
                        />
                        <InputOTPSlot
                          index={4}
                          className="rounded-full h-12 w-12 [&>input]:rounded-full [&>input]:text-center"
                        />
                        <InputOTPSlot
                          index={5}
                          className="rounded-full h-12 w-12 [&>input]:rounded-full [&>input]:text-center"
                        />
                      </InputOTPGroup>
                    </div>
                  </InputOTP>
                </Field>
                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600">
                    Verify my account
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Didn&apos;t get the code? {""}
                <Link
                  href="/two-step-verification"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                >
                  Resend
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
