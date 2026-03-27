import { db } from "./src/db";
import { penilaian, toko } from "./src/db/schema";
import { calculateSAW } from "./src/lib/saw-calculator";
import { eq } from "drizzle-orm";

async function verify() {
  console.log("🔍 Verifying SAW Calculation...");

  const results = await db
    .select({
      nama_toko: toko.nama_toko,
      penilaian: penilaian,
    })
    .from(penilaian)
    .innerJoin(toko, eq(penilaian.toko_id, toko.id));

  for (const row of results) {
    const { score, criteria } = calculateSAW(row.penilaian);
    console.log(`\n🏪 Toko: ${row.nama_toko}`);
    console.log(`📊 Score: ${score}`);
    console.log(`📏 Details:`, criteria);
  }

  console.log("\n✅ Verification complete.");
}

verify().catch(console.error);
