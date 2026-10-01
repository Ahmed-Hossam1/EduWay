import { User } from "lucide-react";
import { StepOneInputField } from "../types";

export const stepOnePersonalFields: StepOneInputField[] = [
  {
    name: "firstName",
    id: "teacher-onboarding-first-name",
    label: "First Name",
    placeholder: "e.g. Sarah",
    type: "text",
    icon: User,
    required: true,
    helperText: "Your legal or preferred given name",
  },
  {
    name: "lastName",
    id: "teacher-onboarding-last-name",
    label: "Last Name",
    placeholder: "e.g. Jenkins",
    type: "text",
    icon: User,
    required: true,
    helperText: "Your family or surname",
  },
];
