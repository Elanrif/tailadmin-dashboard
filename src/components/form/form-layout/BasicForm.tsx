"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import { BoxIcon, EyeCloseIcon, EyeIcon } from "../../../icons";
import PhoneInput from "../group-input/PhoneInput";
import Button from "@/components/ui/button/Button";

export default function BasicForm() {
  const [showPassword, setShowPassword] = useState(false);
  const countries = [
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
  };

  return (
    <ComponentCard title="Basic Form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>First Name</Label>
          <Input type="text" placeholder="Enter text here" />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input type="text" placeholder="Enter text here" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="visitor@gmail.com" />
        </div>
        <div>
          <Label>Phone</Label>
          <PhoneInput
            selectPosition="start"
            countries={countries}
            placeholder="+1 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>{" "}
      </div>
      <div>
        <Label>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
          >
            {showPassword ? (
              <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
            ) : (
              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
            )}
          </button>
        </div>
      </div>
      <div>
        <Label>Confirm Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
          >
            {showPassword ? (
              <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
            ) : (
              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
            )}
          </button>
        </div>
      </div>
      <Button
        size="sm"
        variant="primary"
        className="w-full"
      >
        Submit
      </Button>
    </ComponentCard>
  );
}
