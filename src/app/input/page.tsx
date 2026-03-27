import { db } from "@/db";
import { toko } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addPenilaian } from "@/app/actions";

export default async function InputKinerjaPage() {
  const allToko = await db.select().from(toko);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">Input Kinerja Toko</h1>
        <p className="text-sm text-zinc-500">
          Masukkan data mentah performa toko untuk diproses menggunakan algoritma SAW.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulir Penilaian Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addPenilaian} className="space-y-8">
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
                    <option key={t.id} value={t.id}>
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
                  <label className="text-xs font-medium">Total Order Online</label>
                  <input name="total_online" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Incomplete (Shopee)</label>
                  <input name="incomplete_shopee" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Total Order Shopee</label>
                  <input name="total_shopee" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
                </div>
              </div>

              {/* C5: On Time Shopee */}
              <div className="space-y-4 rounded-lg border p-4 bg-zinc-50/50">
                <h3 className="font-semibold text-sm border-b pb-2">C5: On Time Shopee</h3>
                <div className="space-y-2">
                  <label className="text-xs font-medium">On Time (Shopee)</label>
                  <input name="on_time_shopee" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Total Invoice Shopee</label>
                  <input name="total_invoice_shopee" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
                </div>
              </div>

              {/* C6: On Time Global */}
              <div className="space-y-4 rounded-lg border p-4 bg-zinc-50/50">
                <h3 className="font-semibold text-sm border-b pb-2">C6: On Time Global</h3>
                <div className="space-y-2">
                  <label className="text-xs font-medium">On Time (Global)</label>
                  <input name="on_time_global" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Total Invoice Global</label>
                  <input name="total_invoice_global" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
                </div>
              </div>

              {/* C7: Complain */}
              <div className="space-y-4 rounded-lg border p-4 bg-zinc-50/50">
                <h3 className="font-semibold text-sm border-b pb-2">C7: Complain Rate</h3>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Total Komplain</label>
                  <input name="complain_total" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Total Order Shopee (C7)</label>
                  <input name="total_shopee_complain" type="number" placeholder="0" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full lg:w-max px-12">
              Submit & Simpan Penilaian
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
