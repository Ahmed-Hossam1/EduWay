import { Clock, Mail, MapPin, MessageSquare, Phone, User } from "lucide-react";
import { ContactFaq, ContactFormField, ContactInfoItem } from "../types";

export const contactInfo: ContactInfoItem[] = [
  {
    id: "email",
    title: "Email us",
    value: "support@eduway.com",
    description: "We reply within 24 hours.",
    href: "mailto:support@eduway.com",
    icon: Mail,
  },
  {
    id: "phone",
    title: "Call us",
    value: "+20 100 000 0000",
    description: "Sun – Thu, 9am to 5pm.",
    href: "tel:+201000000000",
    icon: Phone,
  },
  {
    id: "location",
    title: "Visit us",
    value: "Cairo, Egypt",
    description: "Smart Village, Building B12.",
    icon: MapPin,
  },
  {
    id: "hours",
    title: "Working hours",
    value: "9:00 – 17:00",
    description: "Closed on Fridays & Saturdays.",
    icon: Clock,
  },
];

export const contactFormFields: ContactFormField[] = [
  {
    name: "fullName",
    id: "contact-full-name",
    label: "Full name",
    type: "text",
    placeholder: "e.g. Sarah Jenkins",
    icon: User,
    halfWidth: true,
  },
  {
    name: "email",
    id: "contact-email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    icon: Mail,
    halfWidth: true,
  },
  {
    name: "subject",
    id: "contact-subject",
    label: "Subject",
    type: "text",
    placeholder: "How can we help?",
    icon: MessageSquare,
  },
];

export const contactFaqs: ContactFaq[] = [
  {
    id: "faq-1",
    question: "How do I become an instructor?",
    answer: "Create an account, choose the teacher role and complete the onboarding steps. Our team reviews every application.",
  },
  {
    id: "faq-2",
    question: "Can I get a refund for a course?",
    answer: "Yes, you can request a refund within 14 days of purchase if you have watched less than 30% of the course.",
  },
  {
    id: "faq-3",
    question: "Do I get a certificate?",
    answer: "Every paid course includes a certificate of completion you can share on LinkedIn.",
  },
];
