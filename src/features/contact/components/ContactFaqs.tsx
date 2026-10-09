import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

        <Accordion className="space-y-3">
          {contactFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="rounded-xl border border-border bg-card px-5 data-open:border-primary/40"
            >
              <AccordionTrigger className="text-sm font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
