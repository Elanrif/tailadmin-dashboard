import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CheckboxComponents from "@/components/form/form-elements/CheckboxComponents";
import { CloudinaryImgPattern } from "@/components/form/form-elements/CloudinaryImgPattern";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import FileInputExample from "@/components/form/form-elements/FileInputExample";
import InputGroup from "@/components/form/form-elements/InputGroup";
import InputStates from "@/components/form/form-elements/InputStates";
import RadioButtons from "@/components/form/form-elements/RadioButtons";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import BasicForm from "@/components/form/form-layout/BasicForm";
import ExampleAdvanceForm from "@/components/form/form-layout/ExampleAdvanceForm";
import ExampleForm from "@/components/form/form-layout/ExampleForm";
import ExampleFormWithIcons from "@/components/form/form-layout/ExampleFormWithIcons";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FormLayout() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Form Layout" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <BasicForm />
          <ExampleForm />
        </div>
        <div className="space-y-6">
          <ExampleFormWithIcons />
          <ExampleAdvanceForm />
        </div>
      </div>
    </div>
  );
}
