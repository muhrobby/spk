/**
 * Simple Additive Weighting (SAW) Calculator for KPI Tracker
 */

export interface EvaluationData {
  sales_aktual: number;
  sales_target: number;
  availability_ratio: number;
  incomplete_store: number;
  total_online: number;
  incomplete_shopee: number;
  total_shopee: number;
  on_time_shopee: number;
  total_invoice_shopee: number;
  on_time_global: number;
  total_invoice_global: number;
  complain_total: number;
  total_shopee_complain: number;
}

export function calculateSAW(data: EvaluationData) {
  // --- Score Normalization Helpers ---

  // C1: Sales Ratio (Benefit)
  const getC1Score = (aktual: number, target: number) => {
    if (target === 0) return 5; // Fixed based on QC suggestion
    const ratio = aktual / target;
    if (ratio >= 1.15) return 5;
    if (ratio >= 1.0) return 4;
    if (ratio >= 0.95) return 3;
    if (ratio >= 0.85) return 2;
    return 1;
  };

  // C2: Availability (Benefit)
  const getC2Score = (ratio: number) => {
    // If ratio is NaN or negative, return 5 as a safe default based on PRD
    if (ratio === 0) return 5; 
    if (ratio >= 0.9) return 5;
    if (ratio >= 0.7) return 4;
    if (ratio >= 0.6) return 3;
    if (ratio >= 0.5) return 2;
    return 1;
  };

  // C3 & C4: Incomplete Ratio (Cost) - Lower is better (higher score)
  const getIncompleteScore = (inc: number, total: number) => {
    if (total === 0) return 5; // perfect score for no orders
    const ratio = inc / total;
    if (ratio < 0.01) return 5;
    if (ratio < 0.02) return 4;
    if (ratio < 0.03) return 3;
    if (ratio < 0.04) return 2;
    return 1;
  };

  // C5 & C6: On Time Ratio (Benefit)
  const getOnTimeScore = (ot: number, total: number) => {
    if (total === 0) return 5; // perfect score for no orders
    const ratio = ot / total;
    if (ratio >= 0.99) return 5;
    if (ratio >= 0.98) return 4;
    if (ratio >= 0.95) return 3;
    if (ratio >= 0.9) return 2;
    return 1;
  };

  // C7: Complain Ratio (Cost) - Lower is better (higher score)
  const getComplainScore = (comp: number, total: number) => {
    if (total === 0) return 5; // perfect score for no orders
    const ratio = comp / total;
    if (ratio < 0.005) return 5;
    if (ratio <= 0.01) return 4;
    if (ratio <= 0.015) return 3;
    if (ratio <= 0.02) return 2;
    return 1;
  };

  // --- Calculate Criteria Scores ---

  const c1 = getC1Score(data.sales_aktual, data.sales_target);
  const c2 = getC2Score(data.availability_ratio);
  const c3 = getIncompleteScore(data.incomplete_store, data.total_online);
  const c4 = getIncompleteScore(data.incomplete_shopee, data.total_shopee);
  const c5 = getOnTimeScore(data.on_time_shopee, data.total_invoice_shopee);
  const c6 = getOnTimeScore(data.on_time_global, data.total_invoice_global);
  const c7 = getComplainScore(data.complain_total, data.total_shopee_complain);

  // --- Final Weighted Sum ---
  // Weights: C1=10%, C2=5%, C3=15%, C4=20%, C5=20%, C6=15%, C7=15%
  // Formula: ((C1*10) + (C2*5) + (C3*15) + (C4*20) + (C5*20) + (C6*15) + (C7*15)) / 5
  // Note: Dividing by 5 because the max score (5) * total weights (100) = 500. 500/5 = 100.

  const finalScore =
    (c1 * 10 + c2 * 5 + c3 * 15 + c4 * 20 + c5 * 20 + c6 * 15 + c7 * 15) / 5;

  return {
    score: parseFloat(finalScore.toFixed(2)),
    criteria: { c1, c2, c3, c4, c5, c6, c7 },
  };
}
