import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <AuthLayout>
      <div className="mb-8 lg:hidden">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brass-600 font-display text-lg text-ink-700">
          M
        </span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-600">
        Campus Portal
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink-700">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-400">
        Sign in with your institute credentials to continue.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
