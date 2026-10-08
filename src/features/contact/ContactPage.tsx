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
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Contact us
            </span>
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
