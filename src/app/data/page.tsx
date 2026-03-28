import { db } from "@/db";
import { toko } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addToko } from "@/app/actions";

export default async function DataTokoPage() {
  const allToko = await db.select().from(toko);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Daftar Master Toko</h1>
        <Dialog>
          <DialogTrigger
            render={<Button>Tambah Toko Baru</Button>}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Toko</DialogTitle>
            </DialogHeader>
            <form action={addToko} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="nama_toko" className="text-sm font-medium">
                  Nama Toko
                </label>
                <input
                  id="nama_toko"
                  name="nama_toko"
                  type="text"
                  placeholder="Contoh: Toko Cabang Jakarta"
                  required
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm shadow-sm outline-none ring-zinc-500 focus:ring-1"
                />
              </div>
              <Button type="submit" className="w-full">
                Simpan Toko
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Nama Toko</TableHead>
              <TableHead className="text-right">Dibuat Pada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allToko.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">#{item.id}</TableCell>
                <TableCell>{item.nama_toko}</TableCell>
                <TableCell className="text-right">
                  {item.createdAt.toLocaleDateString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
            {allToko.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Belum ada toko yang terdaftar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
