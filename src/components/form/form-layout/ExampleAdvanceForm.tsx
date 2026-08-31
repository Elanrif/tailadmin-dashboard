"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import { BoxIcon } from "../../../icons";
import PhoneInput from "../group-input/PhoneInput";
import TextArea from "../input/TextArea";
import Button from "@/components/ui/button/Button";

export default function ExampleAdvanceForm() {
  const countries = [
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
  };

  const [message, setMessage] = useState("");

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
      <div>
        <Label>Description</Label>
        <TextArea
          value={message}
          onChange={(value) => setMessage(value)}
          rows={6}
        />
      </div>
      <Button
        size="sm"
        variant="primary"
        className="w-full"
        endIcon={<BoxIcon />}
      >
        Submit
      </Button>
    </ComponentCard>
  );
}
