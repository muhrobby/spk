import { db } from "@/db";
import { toko, penilaian } from "@/db/schema";
import { calculateSAW } from "@/lib/saw-calculator";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardTable from "@/components/DashboardTable";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  
  // Get all available periods to determine the latest one as fallback
  const availablePeriodsData = await db
    .select({ periode: penilaian.periode })
    .from(penilaian)
    .groupBy(penilaian.periode)
    .orderBy(desc(penilaian.periode));
    
  const latestPeriode = availablePeriodsData.length > 0 ? availablePeriodsData[0].periode : "2024-03";
  
  // Use URL param if exists, otherwise fallback to latest
  const periode = (searchParams?.periode as string) || latestPeriode;

  // Fetch all stores and their evaluations for the current period
  const data = await db
    .select({
      id: toko.id,
      nama_toko: toko.nama_toko,
      penilaian: penilaian,
    })
    .from(toko)
    .leftJoin(penilaian, eq(toko.id, penilaian.toko_id))
    .where(eq(penilaian.periode, periode));

  // Process data with SAW calculation
  const scoredData = data
    .map((item) => {
      if (!item.penilaian) return null;
      const { score } = calculateSAW(item.penilaian);
      return {
        id: item.penilaian.id, // Using penilaian.id guarantees uniqueness
        nama_toko: item.nama_toko,
        score,
        raw_data: item.penilaian,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.score - a.score);

  const totalToko = scoredData.length;
  const avgScore = totalToko
    ? (scoredData.reduce((acc, curr) => acc + curr.score, 0) / totalToko).toFixed(
        1
      )
    : 0;
  const bestStore = scoredData[0]?.nama_toko || "-";


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Toko</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalToko} Toko</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toko Terbaik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestStore}</div>
          </CardContent>
        </Card>
      </div>

      <DashboardTable data={scoredData} />
    </div>
  );
}
