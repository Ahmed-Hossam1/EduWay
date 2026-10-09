import { CompanyLogos } from "./components/CompanyLogos";


export function TrustedCompaniesSection() {
  return (
    <section className="py-12 border-y border-border/60 bg-muted/30">
      <div className="text-center">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-8">
          Trusted by 17,000+ learners and innovative companies worldwide
        </p>
        <CompanyLogos />
      </div>
    </section>
  );
}
