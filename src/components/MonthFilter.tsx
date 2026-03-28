"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface MonthFilterProps {
  availablePeriode: string[];
}

// Fungsi pembantu untuk memformat "YYYY-MM" menjadi "Bulan Tahun" (misal: "2024-03" -> "Maret 2024")
function formatPeriode(periode: string) {
  const [year, month] = periode.split("-");
  const d = new Date(parseInt(year), parseInt(month) - 1);
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export default function MonthFilter({ availablePeriode }: MonthFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriode = searchParams.get("periode") || (availablePeriode.length > 0 ? availablePeriode[0] : "");

  return (
    <select
      value={currentPeriode}
      onChange={(e) => {
        const val = e.target.value;
        if (val) {
          router.push(`/?periode=${val}`);
        } else {
          router.push(`/`);
        }
      }}
      className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm outline-none ring-zinc-500 focus:ring-1 cursor-pointer"
    >
      {availablePeriode.length === 0 && <option value="">Belum ada data</option>}
      {availablePeriode.map((p) => (
        <option key={p} value={p}>
          {formatPeriode(p)}
        </option>
      ))}
    </select>
  );
}
