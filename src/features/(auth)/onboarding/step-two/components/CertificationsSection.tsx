"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Award, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

interface CertificationsSectionProps {
  className?: string;
}

export function CertificationsSection({ className }: CertificationsSectionProps) {
  const [certifications, setCertifications] = useState<CertificationItem[]>([
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2024",
    },
  ]);

  const handleAddCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      year: new Date().getFullYear().toString(),
    };
    setCertifications((prev) => [...prev, newCert]);
  };

  const handleRemoveCert = (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateCert = (
    id: string,
    field: keyof CertificationItem,
    value: string
  ) => {
    setCertifications((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <div className={`space-y-3 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            Certifications & Accreditations (Optional)
          </label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add relevant industry licenses, certificates, or degrees to strengthen your credibility.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCert}
          className="gap-1.5 text-xs h-8"
        >
          <Plus className="size-3.5" />
          <span>Add Certificate</span>
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-border bg-card/40 text-center">
          <Award className="size-8 text-muted-foreground/60 mb-2" />
          <p className="text-xs text-muted-foreground">
            No certifications added yet.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddCert}
            className="mt-2 text-xs text-primary hover:text-primary-hover gap-1"
          >
            <Plus className="size-3" />
            Add your first certification
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="relative p-3.5 rounded-xl border border-border bg-card/60 space-y-3 group"
            >
              <div className="flex items-center justify-between pb-1 border-b border-border/40">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Award className="size-3.5 text-primary" />
                  Certificate #{index + 1}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleRemoveCert(cert.id)}
                  className="text-muted-foreground hover:text-destructive size-6"
                  aria-label="Remove certification"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <Input
                    placeholder="Certificate Name (e.g. Meta Frontend Certificate)"
                    value={cert.name}
                    onChange={(e) =>
                      handleUpdateCert(cert.id, "name", e.target.value)
                    }
                    fullWidth
                  />
                </div>
                <div className="sm:col-span-4">
                  <Input
                    placeholder="Issuing Org (e.g. Meta / Coursera)"
                    value={cert.issuer}
                    onChange={(e) =>
                      handleUpdateCert(cert.id, "issuer", e.target.value)
                    }
                    fullWidth
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    placeholder="Year"
                    value={cert.year}
                    onChange={(e) =>
                      handleUpdateCert(cert.id, "year", e.target.value)
                    }
                    fullWidth
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
