"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/actions/users";

type Props = {
  type: "login" | "signUp";
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";

  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      setFormError(null);

      try {
        const result = isLoginForm
          ? await loginAction(email, password)
          : await signUpAction(email, password);

        if (result && "errorMessage" in result && result.errorMessage) {
          setFormError(result.errorMessage);
          toast({
            title: "Unable to continue",
            description: result.errorMessage,
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        setFormError(error instanceof Error ? error.message : "An unexpected error occurred");
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-2">
      <CardContent className="grid w-full gap-5">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            autoComplete={isLoginForm ? "current-password" : "new-password"}
            minLength={8}
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      {formError && (
        <p className="px-6 text-sm text-destructive" role="alert">
          {formError}
        </p>
      )}
      <CardFooter className="flex flex-col gap-5 pt-2">
        <Button className="h-11 w-full text-base">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;
