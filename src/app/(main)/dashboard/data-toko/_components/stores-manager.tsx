"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createStoreAction, deleteStoreAction } from "@/actions/stores";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2Icon } from "lucide-react";

type StoreRow = {
  id: number;
  namaToko: string;
  createdAt: Date;
};

type StoresManagerProps = {
  initialStores: StoreRow[];
};

const createStoreFormSchema = z.object({
  namaToko: z.string().trim().min(2, "Nama toko minimal 2 karakter.").max(255, "Nama toko maksimal 255 karakter."),
});

type CreateStoreFormValues = z.infer<typeof createStoreFormSchema>;

export function StoresManager({ initialStores }: StoresManagerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const form = useForm<CreateStoreFormValues>({
    resolver: zodResolver(createStoreFormSchema),
    mode: "onChange",
    defaultValues: {
      namaToko: "",
    },
  });

  const onSubmit = async (values: CreateStoreFormValues) => {
    setIsSubmitting(true);
    const result = await createStoreAction(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    form.reset({ namaToko: "" });
    router.refresh();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus toko ini?")) {
      return;
    }

    setDeletingId(id);
    const result = await deleteStoreAction({ id });
    setDeletingId(null);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-3">
        <FieldGroup>
          <Controller
            control={form.control}
            name="namaToko"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nama-toko">Nama Toko</FieldLabel>
                <Input
                  {...field}
                  id="nama-toko"
                  placeholder="Contoh: Toko Merdeka"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
          Tambah Toko
        </Button>
      </form>

      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Nama Toko</TableHead>
              <TableHead>Dibuat Pada</TableHead>
              <TableHead className="w-12 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialStores.length > 0 ? (
              initialStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{store.namaToko}</TableCell>
                  <TableCell>{new Date(store.createdAt).toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(store.id)}
                      disabled={deletingId === store.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Belum ada data toko. Tambahkan toko pertama Anda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
