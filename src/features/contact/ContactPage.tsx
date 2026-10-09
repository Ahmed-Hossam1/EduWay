import { Badge } from "@/components/ui/badge";
import { ContactForm } from "./components/ContactForm";
import { ContactInfoCards } from "./components/ContactInfoCards";
import { ContactFaqs } from "./components/ContactFaqs";

export function ContactPage() {
  return (
    <>
      <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          {/* Intro + contact info */}
          <div>
            <Badge variant="accent" className="h-auto px-3 py-1 font-semibold">
              Contact us
            </Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              We&apos;d love to <span className="text-primary">hear from you</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
              Have a question about a course, becoming an instructor or your account? Send us a message and we&apos;ll help you out.
            </p>

            <div className="mt-8">
              <ContactInfoCards />
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <ContactFaqs />
    </>
  );
}
