import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { contactFaqs } from "../data";

export function ContactFaqs() {
  return (
    <section className="border-t border-border/50 bg-muted/20 py-14 sm:py-20">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Frequently asked questions"
          subtitle="Quick answers before you reach out."
        />

        <div className="space-y-3">
          {contactFaqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-xl border border-border bg-card px-5 py-4 open:border-primary/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground">
                {faq.question}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
