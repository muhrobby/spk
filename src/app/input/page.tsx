import { db } from "@/db";
import { toko } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceForm from "@/components/PerformanceForm";

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
          <PerformanceForm allToko={allToko} />
        </CardContent>
      </Card>
    </div>
  );
}
