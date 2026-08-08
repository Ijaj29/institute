import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateLoginForm } from '@/utils/validators';
import { AuthApiError } from '@/services/authService';
import type { LoginFormErrors } from '@/types/auth.types';
import { sha512 } from 'js-sha512';
import { getDashboardPathForRole } from '@/utils/roleRoutes';
import { sessionService } from '@/services/sessionService';

export function LoginForm() {
  const { signIn, isAuthenticating } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // const validation = validateLoginForm(email, password);
    // if (Object.keys(validation).length > 0) {
    //   setErrors(validation);
    //   return;
    // }

    setErrors({});
    try {
      await signIn({ email, password: sha512(sha512(password) + "1234"), remember });
      // navigate('/dashboard');
      const user = sessionService.getUser(); // <-- this line must be present before it's used below
      navigate(getDashboardPathForRole(user?.role), { replace: true });

    } catch (err) {
      const message =
        err instanceof AuthApiError ? err.message : 'Something went wrong. Please try again.';
      setErrors({ form: message });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-5">
      <TextField
        label="Email address"
        type="email"
        placeholder="you@institute.edu"
        autoComplete="email"
        icon={<Mail size={18} strokeWidth={1.75} />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        autoComplete="current-password"
        icon={<Lock size={18} strokeWidth={1.75} />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-ink-400 hover:text-ink-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
          </button>
        }
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-ink-400">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-ink-100 text-sage focus:ring-sage/40"
          />
          Keep me signed in
        </label>
        <a href="#" className="font-medium text-sage-600 hover:text-sage">
          Forgot password?
        </a>
      </div>

      {errors.form && (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {errors.form}
        </p>
      )}

      <Button type="submit" isLoading={isAuthenticating}>
        {isAuthenticating ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-ink-400">
        New to Meridian?{' '}
        <a href="#" className="font-medium text-sage-600 hover:text-sage">
          Contact your administrator
        </a>
      </p>
    </form>
  );
}
