import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const toko = sqliteTable("toko", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nama_toko: text("nama_toko").notNull(),
});

export const penilaian = sqliteTable("penilaian", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  toko_id: integer("toko_id")
    .notNull()
    .references(() => toko.id),
  periode: text("periode").notNull(), // format e.g., "2024-03"

  // C1 - Sales Aktual & Target
  sales_aktual: real("sales_aktual").notNull().default(0),
  sales_target: real("sales_target").notNull().default(0),

  // C2 - Availability
  availability_ratio: real("availability_ratio").notNull().default(0),

  // C3 - Incomplete Order Kesalahan Store
  incomplete_store: integer("incomplete_store").notNull().default(0),
  total_online: integer("total_online").notNull().default(0),

  // C4 - Incomplete Order Shopee
  incomplete_shopee: integer("incomplete_shopee").notNull().default(0),
  total_shopee: integer("total_shopee").notNull().default(0),

  // C5 - On Time Service Shopee
  on_time_shopee: integer("on_time_shopee").notNull().default(0),
  total_invoice_shopee: integer("total_invoice_shopee").notNull().default(0),

  // C6 - On Time Service Global
  on_time_global: integer("on_time_global").notNull().default(0),
  total_invoice_global: integer("total_invoice_global").notNull().default(0),

  // C7 - Tingkat Komplain
  complain_total: integer("complain_total").notNull().default(0),
  total_shopee_complain: integer("total_shopee_complain").notNull().default(0),
});
