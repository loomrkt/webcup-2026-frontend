import { VerifyEmailCard } from "@/components/auth/verify-email-card";

export const metadata = {
  title: "Vérifier l'email | Terra Nova",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return <VerifyEmailCard token={params.token ?? ""} />;
}