"use server";

import { db } from "@/db";
import { toko, penilaian } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function addToko(formData: FormData) {
  const namaToko = formData.get("nama_toko") as string;
  if (!namaToko) return;

  await db.insert(toko).values({ nama_toko: namaToko });
  revalidatePath("/data");
}

export async function addPenilaian(formData: FormData) {
  const toko_id = parseInt(formData.get("toko_id") as string);
  const periode = formData.get("periode") as string;
  const global_order_val = parseInt(formData.get("global_total_order") as string) || 0;
  const shopee_order_val = parseInt(formData.get("shopee_total_order") as string) || 0;

  if (!toko_id || !periode) return;

  // Server-side validation
  if (shopee_order_val > global_order_val) {
    throw new Error("Total Order Shopee tidak boleh melebihi Total Order Global!");
  }

  await db.insert(penilaian).values({
    toko_id,
    periode,
    sales_aktual: parseFloat(formData.get("sales_aktual") as string) || 0,
    sales_target: parseFloat(formData.get("sales_target") as string) || 0,
    availability_ratio: parseFloat(formData.get("availability_ratio") as string) || 0,
    incomplete_store: parseInt(formData.get("incomplete_store") as string) || 0,
    
    // Mapping input gabungan ke kolom-kolom database yang relevan
    total_online: global_order_val,
    incomplete_shopee: parseInt(formData.get("incomplete_shopee") as string) || 0,
    total_shopee: shopee_order_val,
    
    on_time_shopee: parseInt(formData.get("on_time_shopee") as string) || 0,
    total_invoice_shopee: shopee_order_val,
    
    on_time_global: parseInt(formData.get("on_time_global") as string) || 0,
    total_invoice_global: global_order_val,
    
    complain_total: parseInt(formData.get("complain_total") as string) || 0,
    total_shopee_complain: shopee_order_val,
  });

  revalidatePath("/");
}
