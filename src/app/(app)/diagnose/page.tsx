import { Navbar } from '@/components/layout/Navbar';
import { DiagnoseClient } from './DiagnoseClient';

export default function DiagnosePage() {
  return (
    <>
      <Navbar title="Diagnose" />
      <DiagnoseClient />
    </>
  );
}
