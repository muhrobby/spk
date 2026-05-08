import { LoginForm } from "../_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">Login to your account</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to login.</p>
        </div>

        <LoginForm />

        <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground text-xs">Demo Account</p>
            <div className="space-y-1.5">
              <div>
                <p className="text-muted-foreground text-xs">Email:</p>
                <p className="font-mono text-sm">admin@example.com</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Password:</p>
                <p className="font-mono text-sm">password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
