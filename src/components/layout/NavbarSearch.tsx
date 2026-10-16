"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { trendingSearches } from "@/config/navigation";

interface NavbarSearchProps {
  className?: string;
}

export function NavbarSearch({ className }: NavbarSearchProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" rounded="full" aria-label="Search courses" className={className} />}
      >
        <Search />
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={10} className="w-[min(50rem,calc(100vw-2rem))] gap-0 p-0">
        <form action="/courses" className="border-b border-border p-3">
          <Input
            name="q"
            type="search"
            placeholder="Search for anything"
            aria-label="Search courses"
            autoFocus
            fullWidth
            leftIcon={<Search className="size-4" />}
          />
        </form>

        {/* Trending */}
        <div className="p-2">
          <p className="px-2 pt-1 pb-2 text-sm font-bold text-foreground">Trending</p>

          <ul>
            {trendingSearches.map((courseName) => (
              <li key={courseName}>
                <Link
                  href={`/courses?q=${encodeURIComponent(courseName)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <TrendingUp className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{courseName}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
