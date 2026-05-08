import { AuthScreenLayout } from '../components/auth-screen-layout';
import { RegisterForm } from '../components/register-form';

export function AuthRegisterPage() {
  return (
    <AuthScreenLayout>
      <RegisterForm />
    </AuthScreenLayout>
  );
}
