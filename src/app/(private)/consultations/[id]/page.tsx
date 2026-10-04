import { ConsultationDetail } from "@/features/consultations/components/consultation-detail-page";

export default async function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConsultationDetail consultationId={id} />;
}