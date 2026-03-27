import { db } from "./index";
import { toko, penilaian } from "./schema";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Insert 5 Stores
  const stores = await db
    .insert(toko)
    .values([
      { nama_toko: "Toko Shopee A" },
      { nama_toko: "Toko Shopee B" },
      { nama_toko: "Toko Global C" },
      { nama_toko: "Toko Global D" },
      { nama_toko: "Toko Campuran E" },
    ])
    .returning();

  console.log(`✅ Inserted ${stores.length} stores.`);

  const periode = "2024-03";

  // 2. Insert evaluations for each store
  const evaluations = [
    {
      toko_id: stores[0].id,
      periode,
      sales_aktual: 120000000,
      sales_target: 100000000, // C1 Ratio: 1.2 (Score 5)
      availability_ratio: 0.95, // C2 Score 5
      incomplete_store: 2,
      total_online: 200, // C3 Ratio: 0.01 (Score 4)
      incomplete_shopee: 5,
      total_shopee: 500, // C4 Ratio: 0.01 (Score 4)
      on_time_shopee: 495,
      total_invoice_shopee: 500, // C5 Ratio: 0.99 (Score 5)
      on_time_global: 100,
      total_invoice_global: 100, // C6 Ratio: 1.0 (Score 5)
      complain_total: 1,
      total_shopee_complain: 500, // C7 Ratio: 0.002 (Score 5)
    },
    {
      toko_id: stores[1].id,
      periode,
      sales_aktual: 90000000,
      sales_target: 100000000, // C1 Ratio: 0.9 (Score 2)
      availability_ratio: 0.65, // C2 Score 3
      incomplete_store: 8,
      total_online: 200, // C3 Ratio: 0.04 (Score 1)
      incomplete_shopee: 15,
      total_shopee: 300, // C4 Ratio: 0.05 (Score 1)
      on_time_shopee: 270,
      total_invoice_shopee: 300, // C5 Ratio: 0.9 (Score 2)
      on_time_global: 50,
      total_invoice_global: 60, // C6 Ratio: 0.83 (Score 1)
      complain_total: 10,
      total_shopee_complain: 300, // C7 Ratio: 0.033 (Score 1)
    },
    {
      toko_id: stores[2].id,
      periode,
      sales_aktual: 105000000,
      sales_target: 100000000, // C1 Ratio: 1.05 (Score 4)
      availability_ratio: 0.85, // C2 Score 4
      incomplete_store: 3,
      total_online: 150, // C3 Ratio: 0.02 (Score 3)
      incomplete_shopee: 6,
      total_shopee: 200, // C4 Ratio: 0.03 (Score 2)
      on_time_shopee: 194,
      total_invoice_shopee: 200, // C5 Ratio: 0.97 (Score 3)
      on_time_global: 145,
      total_invoice_global: 150, // C6 Ratio: 0.96 (Score 3)
      complain_total: 2,
      total_shopee_complain: 200, // C7 Ratio: 0.01 (Score 4)
    },
    {
      toko_id: stores[3].id,
      periode,
      sales_aktual: 115000000,
      sales_target: 100000000, // C1 Ratio: 1.15 (Score 5)
      availability_ratio: 0.75, // C2 Score 4
      incomplete_store: 1,
      total_online: 200, // C3 Ratio: 0.005 (Score 5)
      incomplete_shopee: 3,
      total_shopee: 300, // C4 Ratio: 0.01 (Score 4)
      on_time_shopee: 298,
      total_invoice_shopee: 300, // C5 Ratio: 0.99 (Score 5)
      on_time_global: 290,
      total_invoice_global: 300, // C6 Ratio: 0.96 (Score 3)
      complain_total: 2,
      total_shopee_complain: 300, // C7 Ratio: 0.006 (Score 4)
    },
    {
      toko_id: stores[4].id,
      periode,
      sales_aktual: 80000000,
      sales_target: 100000000, // C1 Ratio: 0.8 (Score 1)
      availability_ratio: 0.55, // C2 Score 2
      incomplete_store: 10,
      total_online: 200, // C3 Ratio: 0.05 (Score 1)
      incomplete_shopee: 20,
      total_shopee: 200, // C4 Ratio: 0.1 (Score 1)
      on_time_shopee: 170,
      total_invoice_shopee: 200, // C5 Ratio: 0.85 (Score 1)
      on_time_global: 160,
      total_invoice_global: 200, // C6 Ratio: 0.8 (Score 1)
      complain_total: 5,
      total_shopee_complain: 200, // C7 Ratio: 0.025 (Score 1)
    },
  ];

  await db.insert(penilaian).values(evaluations);

  console.log("✅ Inserted evaluation data.");
  console.log("✨ Seeding completed.");
}

main().catch((err) => {
  console.error("❌ Seeding failed:");
  console.error(err);
  process.exit(1);
});
