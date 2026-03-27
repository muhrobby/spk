import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Schema for the project will be defined here in the next phases
// Placeholder schema to test drizzle-kit
export const providers = sqliteTable("providers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
