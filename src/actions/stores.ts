"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, stores } from "@/db";
import { getAuthSession } from "@/lib/auth/session";
import { firstIssueMessage, VALIDATION_MESSAGES } from "@/lib/validation/common";

const createStoreSchema = z.object({
  namaToko: z.string().trim().min(2, "Nama toko minimal 2 karakter.").max(255, "Nama toko maksimal 255 karakter."),
});

const updateStoreSchema = z.object({
  id: z.number().int().positive(),
  namaToko: z.string().trim().min(2, "Nama toko minimal 2 karakter.").max(255, "Nama toko maksimal 255 karakter."),
});

const deleteStoreSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
export type DeleteStoreInput = z.infer<typeof deleteStoreSchema>;

export type StoreActionResult = {
  success: boolean;
  message: string;
};

export async function createStoreAction(input: CreateStoreInput): Promise<StoreActionResult> {
  const session = await getAuthSession();
  if (!session) {
    return {
      success: false,
      message: VALIDATION_MESSAGES.sessionRequired,
    };
  }

  const parsed = createStoreSchema.safeParse(input);
  if (!parsed.success) {
    const firstMessage = firstIssueMessage(parsed.error, "Input nama toko tidak valid.");
    return {
      success: false,
      message: firstMessage,
    };
  }

  const normalizedName = parsed.data.namaToko;
  const existingStore = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.namaToko, normalizedName))
    .limit(1);

  if (existingStore.length > 0) {
    return {
      success: false,
      message: "Nama toko sudah terdaftar. Gunakan nama lain.",
    };
  }

  await db.insert(stores).values({
    namaToko: normalizedName,
  });

  revalidatePath("/dashboard/data-toko");

  return {
    success: true,
    message: "Data toko berhasil ditambahkan.",
  };
}

export async function updateStoreAction(input: UpdateStoreInput): Promise<StoreActionResult> {
  const session = await getAuthSession();
  if (!session) {
    return {
      success: false,
      message: VALIDATION_MESSAGES.sessionRequired,
    };
  }

  const parsed = updateStoreSchema.safeParse(input);
  if (!parsed.success) {
    const firstMessage = firstIssueMessage(parsed.error, "Input tidak valid.");
    return {
      success: false,
      message: firstMessage,
    };
  }

  const normalizedName = parsed.data.namaToko;
  const existingStore = await db
    .select({ id: stores.id })
    .from(stores)
    .where(eq(stores.namaToko, normalizedName))
    .limit(1);

  if (existingStore.length > 0 && existingStore[0].id !== parsed.data.id) {
    return {
      success: false,
      message: "Nama toko sudah terdaftar. Gunakan nama lain.",
    };
  }

  await db
    .update(stores)
    .set({ namaToko: normalizedName })
    .where(eq(stores.id, parsed.data.id));

  revalidatePath("/dashboard/data-toko");

  return {
    success: true,
    message: "Data toko berhasil diperbarui.",
  };
}

export async function deleteStoreAction(input: DeleteStoreInput): Promise<StoreActionResult> {
  const session = await getAuthSession();
  if (!session) {
    return {
      success: false,
      message: VALIDATION_MESSAGES.sessionRequired,
    };
  }

  const parsed = deleteStoreSchema.safeParse(input);
  if (!parsed.success) {
    const firstMessage = firstIssueMessage(parsed.error, "Input tidak valid.");
    return {
      success: false,
      message: firstMessage,
    };
  }

  await db.delete(stores).where(eq(stores.id, parsed.data.id));

  revalidatePath("/dashboard/data-toko");

  return {
    success: true,
    message: "Data toko berhasil dihapus.",
  };
}
