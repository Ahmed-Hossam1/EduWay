import { contactInfo } from "../data";

export function ContactInfoCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {contactInfo.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">{item.title}</h3>
            {item.href ? (
              <a
                href={item.href}
                className="mt-1 block text-sm font-medium text-primary hover:text-primary-hover hover:underline"
              >
                {item.value}
              </a>
            ) : (
              <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
