import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * BetterAuth core tables for PostgreSQL + Drizzle.
 * Field names follow BetterAuth conventions for compatibility.
 */
export const user = pgTable("user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

/**
 * Domain tables for SPK SAW.
 */
export const criteriaTypeEnum = pgEnum("criteria_type", ["benefit", "cost"]);

export const criteriaWeights = pgTable("criteria_weights", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  kode: varchar("kode", { length: 10 }).notNull().unique(),
  namaKriteria: varchar("nama_kriteria", { length: 255 }).notNull(),
  tipe: criteriaTypeEnum("tipe").notNull(),
  bobot: doublePrecision("bobot").notNull(),
});

export const stores = pgTable("stores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  namaToko: varchar("nama_toko", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const performanceRecords = pgTable(
  "performance_records",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    periode: varchar("periode", { length: 7 }).notNull(),
    targetSales: doublePrecision("target_sales").notNull(),
    actualSales: doublePrecision("actual_sales").notNull(),
    totalOrder: integer("total_order").notNull(),
    incompleteOrder: integer("incomplete_order").notNull(),
    slaOntime: integer("sla_ontime").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("performance_records_store_id_idx").on(table.storeId),
    unique("performance_records_store_periode_unique").on(table.storeId, table.periode),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const storesRelations = relations(stores, ({ many }) => ({
  performanceRecords: many(performanceRecords),
}));

export const performanceRecordsRelations = relations(performanceRecords, ({ one }) => ({
  store: one(stores, {
    fields: [performanceRecords.storeId],
    references: [stores.id],
  }),
}));
