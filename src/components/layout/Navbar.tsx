"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Heart, ShoppingCart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Logo } from "./Logo";
import { NavbarSearch } from "./NavbarSearch";
import { navItems } from "@/config/navigation";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { UserMenu } from "@/features/profile/components/UserMenu";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useCart } from "@/features/cart/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";

// One look for every Navbar icon (search, wishlist, cart, theme):
// round ghost button, 19px icon, muted color → darker on hover
const navbarIconClass = cn(
    buttonVariants({ variant: "ghost", size: "icon", rounded: "full" }),
    "text-muted-foreground hover:text-foreground [&_svg:not([class*='size-'])]:size-[19px]",
);

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: profile, isPending } = useProfile();
    const { data: wishlistIds = [] } = useWishlist();
    const { data: cartIds = [] } = useCart();
    const pathName = usePathname();
    const closeMobileMenu = () => setMobileMenuOpen(false);

    const isActiveLink = (href: string, pathName: string): boolean => {
        return href.split("/")[1] === pathName.split("/")[1];
    };

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
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActiveLink(item.href, pathName)
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
                    {/* Search icon  panel with the input + trending course names */}
                    <NavbarSearch className={navbarIconClass} />

                    {profile && (
                        <Link
                            href="/student/wishlist"
                            aria-label={wishlistIds.length > 0 ? `Wishlist (${wishlistIds.length})` : "Wishlist"}
                            className={cn(navbarIconClass, "relative hidden lg:inline-flex")}
                        >
                            <Heart />
                            {wishlistIds.length > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] tabular-nums">
                                    {wishlistIds.length > 99 ? "99+" : wishlistIds.length}
                                </Badge>
                            )}
                        </Link>
                    )}

                    <Link
                        href="/cart"
                        aria-label={cartIds.length > 0 ? `Cart (${cartIds.length})` : "Cart"}
                        className={cn(navbarIconClass, "relative hidden lg:inline-flex")}
                    >
                        <ShoppingCart />
                        {cartIds.length > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] tabular-nums">
                                {cartIds.length > 99 ? "99+" : cartIds.length}
                            </Badge>
                        )}
                    </Link>

                    <AnimatedThemeToggler className={navbarIconClass} />

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
                            <Button variant="outline" rounded="full" className="px-5" asChild>
                                <Link href="/auth/login">Log in</Link>
                            </Button>
                            <Button rounded="full" className="px-5 shadow-sm" asChild>
                                <Link href="/auth/signup">Sign up</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile: theme + avatar + menu */}
                <div className="flex md:hidden items-center gap-1">
                    <AnimatedThemeToggler className={navbarIconClass} />
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
                                        className={`rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-muted hover:text-primary ${isActiveLink(item.href, pathName)
                                            ? "text-primary font-semibold"
                                            : "text-foreground"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex flex-col gap-1 px-4">
                                <Separator className="mb-2" />
                                {profile && (
                                    <Link
                                        href="/student/wishlist"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                                    >
                                        <Heart className="size-5" /> Wishlist
                                        {wishlistIds.length > 0 && (
                                            <Badge className="ml-auto">{wishlistIds.length}</Badge>
                                        )}
                                    </Link>
                                )}

                                <Link
                                    href="/cart"
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                                >
                                    <ShoppingCart className="size-5" /> Cart
                                    {cartIds.length > 0 && <Badge className="ml-auto">{cartIds.length}</Badge>}
                                </Link>
                            </div>

                            {!isPending && !profile && (
                                <div className="mt-auto flex flex-col gap-2.5 p-4">
                                    <Separator className="mb-2" />
                                    <Button variant="outline" rounded="full" asChild>
                                        <Link href="/auth/login" onClick={closeMobileMenu}>
                                            Log in
                                        </Link>
                                    </Button>
                                    <Button rounded="full" asChild>
                                        <Link href="/auth/signup" onClick={closeMobileMenu}>
                                            Sign up
                                        </Link>
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
