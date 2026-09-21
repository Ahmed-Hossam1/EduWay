import { SectionHeading } from "../../../../components/shared/SectionHeading";
import { TestimonialCard } from "./components/TestimonialCard";
import { testimonials } from "../../data";

export function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="What Our Students Say"
          subtitle="Real stories from real learners."
          actionText="View All Reviews"
          actionHref="/reviews"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
