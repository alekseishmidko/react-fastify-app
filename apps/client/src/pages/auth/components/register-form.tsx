import { useAuthStore } from '@/stores/auth.store';
import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthFormCard } from './auth-form-card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { AuthFormErrorAlert } from './auth-form-error-alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function RegisterForm() {
  const register = useAuthStore((s) => s.register);
  const authError = useAuthStore((s) => s.authError);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirm-password') ?? '');

    if (password !== confirmPassword) {
      setClientError('Пароли не совпадают');

      return;
    }

    if (password.length < 8) {
      setClientError('Пароль не должен быть короче 8 символов');

      return;
    }

    if (name.length < 2) {
      setClientError('Имя не может быть меньше 2 символов');

      return;
    }

    try {
      await register({ email, password, name });
    } catch {}
  };

  const topError = clientError ?? authError;

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AuthFormCard title="Регистрация">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <AuthFormErrorAlert message={topError} />
            <Field>
              <FieldLabel htmlFor="register-name">Имя</FieldLabel>
              <Input
                id="register-name"
                name="name"
                type="text"
                placeholder="Иван Иванов"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-email">Email</FieldLabel>
              <Input
                id="register-email"
                name="email"
                type="email"
                placeholder="example@example.ru"
                autoComplete="email"
                required
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-password">Пароль</FieldLabel>
              <Input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-confirm-password">Повторите пароль</FieldLabel>
              <Input
                id="register-confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <Button type="submit" className="w-full" disabled={isAuthLoading}>
                {isAuthLoading ? 'Создание...' : 'Создать аккаунт'}
              </Button>
              <FieldDescription className="text-center">
                Уже есть аккаунт?{' '}
                <Link
                  className="underline-offset-4 hover:underline"
                  to="/login"
                  onClick={() => {
                    useAuthStore.getState().clearAuthError();
                    setClientError(null);
                  }}
                >
                  Войти
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthFormCard>
    </div>
  );
}
