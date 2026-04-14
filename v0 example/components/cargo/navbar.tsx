"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Car, User, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  navItems: NavItem[];
  showAuth?: boolean;
  isLoggedIn?: boolean;
  userName?: string;
  userRole?: "CLIENT" | "FLEET_MANAGER";
}

export function Navbar({ 
  navItems, 
  showAuth = true, 
  isLoggedIn = false, 
  userName,
  userRole 
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Car<span className="text-primary">GO</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href 
                  ? "text-primary border-b-2 border-primary pb-1" 
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {showAuth && !isLoggedIn ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Login
                </Button>
              </Link>
              <Link href="/cars">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                  Book Now
                </Button>
              </Link>
            </>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href={userRole === "FLEET_MANAGER" ? "/manager" : "/dashboard"}>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {userName || "Account"}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-background border-border">
            <div className="flex flex-col gap-6 mt-8">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary p-2 rounded-lg",
                      pathname === item.href 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {showAuth && (
                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  {!isLoggedIn ? (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/cars" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Book Now
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href={userRole === "FLEET_MANAGER" ? "/manager" : "/dashboard"} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          {userName || "Account"}
                        </Button>
                      </Link>
                      <Button variant="ghost" className="w-full text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
