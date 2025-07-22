'use client';

import PaymentsTab from "@/components/admin/PaymentsTab";

export default function Page({ params }) {
  const { id } = params;
  return <PaymentsTab batchId={id} />;
}
