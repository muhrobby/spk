import { calculateSAW, EvaluationData } from "./src/lib/saw-calculator";

function testEdges() {
  console.log("🧪 Testing Edge Cases (Zero Denominators)...");

  const zeroData: EvaluationData = {
    sales_aktual: 0,
    sales_target: 0, // Should be Score 5
    availability_ratio: 0, // Should be Score 5
    incomplete_store: 0,
    total_online: 0, // Should be Score 5
    incomplete_shopee: 0,
    total_shopee: 0, // Should be Score 5
    on_time_shopee: 0,
    total_invoice_shopee: 0, // Should be Score 5
    on_time_global: 0,
    total_invoice_global: 0, // Should be Score 5
    complain_total: 0,
    total_shopee_complain: 0, // Should be Score 5
  };

  const { score, criteria } = calculateSAW(zeroData);

  console.log("\n📊 Result for all zeros:");
  console.log(`Score: ${score} (Expected: 100)`);
  console.log(`Criteria:`, criteria);

  if (score === 100) {
    console.log("\n✅ PASS: Zero cases handled with perfect score (5).");
  } else {
    console.log("\n❌ FAIL: Zero cases did not return 100.");
    process.exit(1);
  }
}

testEdges();
