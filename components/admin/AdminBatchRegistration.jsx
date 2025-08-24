// pages/admin/batches/page.js
"use client";

import { useEffect, useState } from "react";
import { getBatches } from "@/lib/api/api";
import Link from "next/link";

const BatchesPage = () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    async function fetchBatches() {
      const data = await getBatches();
      setBatches(data);
    }
    fetchBatches();
  }, []);

  return (
    <div className="p-6 font-mitra">
      <h2 className="text-3xl font-bold mb-6">لیست دوره ها</h2>
      <ul className="space-y-4">
        {batches.map((batch) => (
          <li key={batch.id} className="p-4 bg-white rounded-xl shadow">
            <Link href={`/admin/payments/batches/${batch.id}`} className="text-indigo-600 hover:underline text-xl">
              {batch.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BatchesPage;
