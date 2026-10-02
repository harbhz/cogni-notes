import AuthForm from "@/components/AuthForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SignUpPage() {
  return (
    <div className="content-frame flex min-h-[calc(100vh-140px)] items-center justify-center py-8">
      <Card className="auth-card border-border/70 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-3 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Start a practice</p>
          <CardTitle className="text-3xl tracking-tight">Make room for ideas</CardTitle>
          <CardDescription>Create a private workspace for notes you want to revisit.</CardDescription>
        </CardHeader>

        <AuthForm type="signUp" />
      </Card>
    </div>
  );
}

export default SignUpPage;
