"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function InputOTPPattern() {
  return (
    <div className="space-y-6">

      {/* Round OTP (Spaced) */}
      <div>
        <Field className="w-fit">
          <FieldLabel htmlFor="round-spaced">Round OTP (Spaced)</FieldLabel>
          <InputOTP
            id="round-spaced"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup className="gap-3">
              <InputOTPSlot
                index={0}
                className="rounded-full h-14 w-14 [&>input]:rounded-full [&>input]:text-center [&>input]:text-lg [&>input]:font-semibold"
              />
              <InputOTPSlot
                index={1}
                className="rounded-full h-14 w-14 [&>input]:rounded-full [&>input]:text-center [&>input]:text-lg [&>input]:font-semibold"
              />
              <InputOTPSlot
                index={2}
                className="rounded-full h-14 w-14 [&>input]:rounded-full [&>input]:text-center [&>input]:text-lg [&>input]:font-semibold"
              />
              <InputOTPSlot
                index={3}
                className="rounded-full h-14 w-14 [&>input]:rounded-full [&>input]:text-center [&>input]:text-lg [&>input]:font-semibold"
              />
              <InputOTPSlot
                index={4}
                className="rounded-full h-14 w-14 [&>input]:rounded-full [&>input]:text-center [&>input]:text-lg [&>input]:font-semibold"
              />
              <InputOTPSlot
                index={5}
                className="rounded-full h-14 w-14 [&>input]:rounded-full [&>input]:text-center [&>input]:text-lg [&>input]:font-semibold"
              />
            </InputOTPGroup>
          </InputOTP>
        </Field>
      </div>

      {/* Round OTP (Compact) */}
      <div>
        <Field className="w-fit">
          <FieldLabel htmlFor="round-compact">Round OTP (Compact)</FieldLabel>
          <InputOTP
            id="round-compact"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
          >
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
          </InputOTP>
        </Field>
      </div>

      {/* Round OTP (3+3) */}
      <div>
        <Field className="w-fit">
          <FieldLabel htmlFor="round-sep">Round OTP (3+3)</FieldLabel>
          <InputOTP id="round-sep" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
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
      </div>
    </div>
  );
}
