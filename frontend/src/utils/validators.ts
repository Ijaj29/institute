const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPassword(value: string): boolean {
  return value.trim().length >= 6;
}

export interface LoginValidationResult {
  email?: string;
  password?: string;
}

export function validateLoginForm(email: string, password: string): LoginValidationResult {
  const errors: LoginValidationResult = {};

  if (!email.trim()) {
    errors.email = 'Enter your registered email address.';
  } else if (!isValidEmail(email)) {
    errors.email = 'That email address doesn\'t look right.';
  }

  if (!password) {
    errors.password = 'Enter your password.';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}
