"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Logo } from "../../components/Logo";
import { navItems } from "../../data";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${item.isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search courses"
            className="text-muted-foreground hover:text-foreground rounded-full"
          >
            <Search className="size-4" />
          </Button>

          <AnimatedThemeToggler />

          <Link href="/login">
            <Button
              variant="outline"
              className="rounded-full px-5 text-sm font-medium border-border hover:bg-muted"
            >
              Log in
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              variant="default"
              className="rounded-full px-5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm"
            >
              Sign up
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <AnimatedThemeToggler />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="rounded-full"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-1 transition-colors hover:text-primary ${item.isActive ? "text-primary font-semibold" : "text-foreground"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full rounded-full justify-center"
              >
                Log in
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="default"
                className="w-full rounded-full justify-center bg-primary text-primary-foreground"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
