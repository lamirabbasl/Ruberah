// pages/admin/batches/[id]/page.js
"use client";

import PaymentsTab from "@/components/admin/PaymentsTab";

const BatchPage = ({ params }) => {
  const { id } = params;
  return <PaymentsTab batchId={id} />;
};

export default BatchPage;
