"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const search = useSearchParams();
  const errorCode = search?.get("error");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const errorText =
    errorCode === "expired"
      ? "Dieser Link ist abgelaufen. Bitte fordern Sie einen neuen an."
      : errorCode === "used"
        ? "Dieser Link wurde bereits verwendet."
        : errorCode === "invalid"
          ? "Ungültiger Login-Link."
          : "";

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error || "Senden fehlgeschlagen");
        return;
      }
      setStatus("sent");
      setMessage("Wenn ein Konto zu dieser E-Mail existiert, senden wir einen Login-Link.");
    } catch {
      setStatus("error");
      setMessage("Senden fehlgeschlagen");
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Client Admin</CardTitle>
          <CardDescription>
            Melden Sie sich mit der E-Mail an, die bei der Erstellung der Website angegeben wurde.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
            {errorText ? <p className="text-sm text-destructive">{errorText}</p> : null}
            {message ? (
              <p className={`text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
                {message}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={status === "sending"}>
              {status === "sending" ? "Senden…" : "Login-Link senden"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
