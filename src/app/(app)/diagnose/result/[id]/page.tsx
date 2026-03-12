import { Navbar } from '@/components/layout/Navbar';
import { DiagnosisResultClient } from './DiagnosisResultClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DiagnosisResultPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <Navbar title="Diagnosis" showBack backHref="/diagnose" />
      <DiagnosisResultClient id={id} />
    </>
  );
}
