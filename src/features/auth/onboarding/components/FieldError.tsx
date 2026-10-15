// The red error text under a custom field (cards, badges...) — same look as <Input errorText />
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-xs font-medium tracking-wide text-destructive">{message}</p>;
}
