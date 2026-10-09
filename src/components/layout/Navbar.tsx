"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Logo } from "./Logo";
import { navItems } from "@/config/navigation";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { UserMenu } from "@/features/profile/components/UserMenu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: profile, isPending } = useProfile();

  const closeMobileMenu = () => setMobileMenuOpen(false);

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
            rounded="full"
            className="text-muted-foreground hover:text-foreground"
          >
            <Search />
          </Button>

          <AnimatedThemeToggler className="cursor-pointer" />

          {isPending ? (
            <Skeleton className="size-8 rounded-full" />
          ) : profile ? (
            <UserMenu
              firstName={profile.first_name}
              lastName={profile.last_name}
              avatarUrl={profile.avatar_url}
            />
          ) : (
            <>
              {/* render={<Link />} → the Button IS the link (no <button> inside <a>) */}
              <Button variant="outline" rounded="full" className="px-5" nativeButton={false} render={<Link href="/login" />}>
                Log in
              </Button>
              <Button rounded="full" className="px-5 shadow-sm" nativeButton={false} render={<Link href="/signup" />}>
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Mobile: theme + avatar + menu */}
        <div className="flex md:hidden items-center gap-2">
          <AnimatedThemeToggler />
          {profile && (
            <UserMenu
              firstName={profile.first_name}
              lastName={profile.last_name}
              avatarUrl={profile.avatar_url}
            />
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" rounded="full" aria-label="Open navigation menu">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-muted hover:text-primary ${item.isActive ? "text-primary font-semibold" : "text-foreground"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {!isPending && !profile && (
                <div className="mt-auto flex flex-col gap-2.5 p-4">
                  <Separator className="mb-2" />
                  <Button variant="outline" rounded="full" nativeButton={false} render={<Link href="/login" onClick={closeMobileMenu} />}>
                    Log in
                  </Button>
                  <Button rounded="full" nativeButton={false} render={<Link href="/signup" onClick={closeMobileMenu} />}>
                    Sign up
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
