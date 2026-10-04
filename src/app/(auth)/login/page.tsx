import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    registered?: string;
    verified?: string;
    reset?: string;
  }>;
}) {
  const params = await searchParams;
  return (
    <LoginForm
      registered={params.registered === "1"}
      verified={params.verified === "1"}
      reset={params.reset === "1"}
    />
  );
}