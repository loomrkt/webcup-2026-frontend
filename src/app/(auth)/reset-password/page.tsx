import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Réinitialiser le mot de passe | Loomrkt",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return <ResetPasswordForm token={params.token ?? ""} />;
}