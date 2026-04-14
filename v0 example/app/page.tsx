import { Navbar } from "@/components/cargo/navbar";
import { SearchForm } from "@/components/cargo/search-form";
import { CarCard } from "@/components/cargo/car-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { clientNavItems } from "@/lib/types";
import { mockCars } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight, Shield, Clock, CreditCard, Headphones, Car, MapPin, CalendarCheck, Key } from "lucide-react";

export default function HomePage() {
  const featuredCars = mockCars.filter(car => car.status === "AVAILABLE").slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar navItems={clientNavItems} showAuth />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--cargo-glow)_0%,_transparent_50%)]" />
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              Drive with <span className="text-primary">Confidence</span>
              <br />
              Travel with <span className="text-primary">Comfort</span>. Arrive in Style
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Choose from a wide range of cars, book easily online, and enjoy a smooth, reliable driving experience wherever you go.
            </p>
          </div>

          <SearchForm variant="hero" />

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link href="/cars">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                Explore Cars
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
                About us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Vehicles</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Discover our premium selection of vehicles for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/cars">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                View All Cars
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Renting a car has never been easier. Just follow these simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: MapPin, title: "Choose Location", desc: "Select your preferred pickup and return location" },
              { icon: CalendarCheck, title: "Pick Dates", desc: "Choose your rental dates that work for you" },
              { icon: Car, title: "Select Car", desc: "Browse and select from our premium fleet" },
              { icon: Key, title: "Drive Away", desc: "Pick up your car and enjoy your journey" },
            ].map((step, index) => (
              <div key={step.title} className="relative text-center">
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose CarGO</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We provide the best car rental experience with premium service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Full Insurance", desc: "All our vehicles come with comprehensive insurance coverage" },
              { icon: Clock, title: "24/7 Support", desc: "Round-the-clock customer support for your peace of mind" },
              { icon: CreditCard, title: "Best Prices", desc: "Competitive rates with no hidden fees or charges" },
              { icon: Headphones, title: "Easy Booking", desc: "Simple online booking process with instant confirmation" },
            ].map((benefit) => (
              <Card key={benefit.title} className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-primary/10 border border-primary/20 p-12 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Hit the Road?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of satisfied customers who trust CarGO for their rental needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/cars">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                    Browse Cars
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Car<span className="text-primary">GO</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium car rental service. Drive with confidence, travel with comfort.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/cars" className="hover:text-primary transition-colors">Browse Cars</Link></li>
                <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">My Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@cargo.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Rental Street, Auto City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>2026 CarGO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
