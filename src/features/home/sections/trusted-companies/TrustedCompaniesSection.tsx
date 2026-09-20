import { CompanyLogos } from "./components/CompanyLogos";

export function TrustedCompaniesSection() {
  return (
    <section className="py-12 border-y border-border/60 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-8">
          Trusted by 17,000+ learners and innovative companies worldwide
        </p>
        <CompanyLogos />
      </div>
    </section>
  );
}
