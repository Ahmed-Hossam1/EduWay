import { Send } from "lucide-react";
import Input from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contactFormFields } from "../data";

export function ContactForm() {
  return (
    <Card className="block rounded-2xl p-6 shadow-lg sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Send us a message</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Fill in the form and our team will get back to you shortly.
      </p>

      <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {contactFormFields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.name} className={field.halfWidth ? "" : "sm:col-span-2"}>
              <Input
                id={field.id}
                name={field.name}
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                leftIcon={<Icon className="size-4" />}
              />
            </div>
          );
        })}

        <div className="sm:col-span-2">
          <Textarea
            id="contact-message"
            name="message"
            label="Message"
            placeholder="Write your message here..."
            rows={5}
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" rounded="xl" className="h-11 w-full font-semibold sm:w-auto sm:px-8">
            Send message
            <Send className="size-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
