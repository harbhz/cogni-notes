import AuthForm from "@/components/AuthForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginPage() {
  return (
    <div className="content-frame flex min-h-[calc(100vh-140px)] items-center justify-center py-8">
      <Card className="auth-card border-border/70 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-3 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Welcome back</p>
          <CardTitle className="text-3xl tracking-tight">Login to your notes</CardTitle>
          <CardDescription>Pick up where you left off and keep your thinking in one place.</CardDescription>
        </CardHeader>

        <AuthForm type="login" />
      </Card>
    </div>
  );
}

export default LoginPage;
