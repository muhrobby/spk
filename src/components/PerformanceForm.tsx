"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addPenilaian } from "@/app/actions";

interface Toko {
  id: number;
  nama_toko: string;
}

interface PerformanceFormProps {
  allToko: Toko[];
}

export default function PerformanceForm({ allToko }: PerformanceFormProps) {
  const [globalOrder, setGlobalOrder] = useState<number>(0);
  const [shopeeOrder, setShopeeOrder] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    // Client-side validation
    const gOrder = parseInt(formData.get("global_total_order") as string) || 0;
    const sOrder = parseInt(formData.get("shopee_total_order") as string) || 0;

    if (sOrder > gOrder) {
      setError("Error: Total Order Shopee tidak boleh melebihi Total Order Global!");
      return;
    }

    setError(null);
    await addPenilaian(formData);
    // Optional: Reset form or show success message
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Informasi Dasar */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="toko_id" className="text-sm font-medium leading-none">
            Pilih Toko
          </label>
          <select
            id="toko_id"
            name="toko_id"
            required
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-zinc-500 focus:ring-1"
          >
            <option value="">-- Pilih Toko --</option>
            {allToko.map((t) => (
              <option key={t.id} value={t.id.toString()}>
                {t.nama_toko}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="periode" className="text-sm font-medium leading-none">
            Periode (Bulan)
          </label>
          <input
            id="periode"
            name="periode"
            type="month"
            required
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm shadow-sm outline-none ring-zinc-500 focus:ring-1"
          />
        </div>
      </div>

      <hr className="my-4 border-zinc-100" />

      {/* Input Utama: Total Order */}
      <div className="bg-zinc-100/50 p-4 rounded-lg border border-zinc-200 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-600">Data Transaksi Utama</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Order (Semua Marketplace)</label>
            <input
              name="global_total_order"
              type="number"
              required
              min="0"
              placeholder="Contoh: 100"
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm"
              onChange={(e) => setGlobalOrder(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Order (Shopee Only)</label>
            <input
              name="shopee_total_order"
              type="number"
              required
              min="0"
              max={globalOrder}
              placeholder="Maksimal seukuran Global Order"
              className="w-full rounded-md border px-3 py-2 text-sm shadow-sm"
              onChange={(e) => setShopeeOrder(parseInt(e.target.value) || 0)}
            />
            {shopeeOrder > globalOrder && (
              <p className="text-xs text-red-500 font-medium">⚠️ Melebihi Total Order Global!</p>
            )}
          </div>
        </div>
      </div>

      {/* Metrik Raw Data */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* C1: Sales */}
        <div className="space-y-4 rounded-lg border p-4 bg-zinc-50/50">
          <h3 className="font-semibold text-sm border-b pb-2">C1: Sales Performance</h3>
          <div className="space-y-2">
            <label className="text-xs font-medium">Sales Aktual</label>
            <input name="sales_aktual" type="number" step="any" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Sales Target</label>
            <input name="sales_target" type="number" step="any" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
          </div>
        </div>

        {/* C2: Availability */}
        <div className="space-y-4 rounded-lg border p-4 bg-zinc-50/50">
          <h3 className="font-semibold text-sm border-b pb-2">C2: Availability</h3>
          <div className="space-y-2">
            <label className="text-xs font-medium">Availability Ratio (0-1.0)</label>
            <input name="availability_ratio" type="number" step="0.01" max="1" placeholder="0.00" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
          </div>
        </div>

        {/* C3 & C4: Incomplete Orders */}
        <div className="space-y-4 rounded-lg border p-4 bg-zinc-50/50">
          <h3 className="font-semibold text-sm border-b pb-2">C3 & C4: Incomplete Orders</h3>
          <div className="space-y-2">
            <label className="text-xs font-medium">Incomplete (Store)</label>
            <input name="incomplete_store" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Incomplete (Shopee)</label>
            <input name="incomplete_shopee" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
          </div>
          <p className="text-[10px] text-zinc-400 italic mt-2">*Total order ditarik dari input utama di atas.</p>
        </div>

        {/* C5: On Time Shopee */}
        <div className="space-y-4 rounded-lg border p-4 bg-zinc-50/50">
          <h3 className="font-semibold text-sm border-b pb-2">C5: On Time Shopee</h3>
          <div className="space-y-2">
            <label className="text-xs font-medium">On Time (Shopee)</label>
            <input name="on_time_shopee" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
          </div>
        </div>

        {/* C6: On Time Global */}
        <div className="space-y-4 rounded-lg border p-4 bg-zinc-50/50">
          <h3 className="font-semibold text-sm border-b pb-2">C6: On Time Global</h3>
          <div className="space-y-2">
            <label className="text-xs font-medium">On Time (Global)</label>
            <input name="on_time_global" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
          </div>
        </div>

        {/* C7: Complain */}
        <div className="space-y-4 rounded-lg border p-4 bg-zinc-50/50">
          <h3 className="font-semibold text-sm border-b pb-2">C7: Complain Rate</h3>
          <div className="space-y-2">
            <label className="text-xs font-medium">Total Komplain</label>
            <input name="complain_total" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full lg:w-max px-12">
        Submit & Simpan Penilaian
      </Button>
    </form>
  );
}
