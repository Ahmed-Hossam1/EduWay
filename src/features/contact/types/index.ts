import { LucideIcon } from "lucide-react";

export interface ContactInfoItem {
  id: string;
  title: string;
  value: string;
  description: string;
  href?: string;
  icon: LucideIcon;
}

export interface ContactFormField {
  name: "fullName" | "email" | "subject";
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: LucideIcon;
  halfWidth?: boolean;
}

export interface ContactFaq {
  id: string;
  question: string;
  answer: string;
}
