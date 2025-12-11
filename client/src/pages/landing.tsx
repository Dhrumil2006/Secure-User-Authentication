import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield, Lock, UserCheck, Key } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">SecureAuth</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild data-testid="button-login-header">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Secure Authentication
              <span className="block text-primary">Made Simple</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Protect your applications with enterprise-grade security. Simple to integrate, 
              powerful to use, and trusted by developers worldwide.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild data-testid="button-get-started">
                <a href="/api/login">Get Started</a>
              </Button>
              <Button variant="outline" size="lg" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Why Choose SecureAuth?</h2>
              <p className="mt-4 text-muted-foreground">
                Built with modern security standards to keep your users safe
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card data-testid="card-feature-security">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>End-to-End Security</CardTitle>
                  <CardDescription>
                    Industry-standard encryption protects all user data and sessions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card data-testid="card-feature-oauth">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Multiple Sign-In Options</CardTitle>
                  <CardDescription>
                    Support for Google, GitHub, Apple, X, and email/password authentication
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card data-testid="card-feature-sessions">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Session Management</CardTitle>
                  <CardDescription>
                    Automatic session handling with secure token refresh and expiration
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <Card className="mx-auto max-w-3xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
              <p className="mt-4 text-muted-foreground">
                Sign in now to access your secure dashboard and protected resources.
              </p>
              <Button className="mt-6" size="lg" asChild data-testid="button-sign-in-cta">
                <a href="/api/login">Sign In Now</a>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground md:px-6">
          <p>Secure Authentication System. Built with security in mind.</p>
        </div>
      </footer>
    </div>
  );
}
