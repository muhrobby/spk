"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Provide a type mimicking the combined properties needed
export type DashboardRowData = {
  id: number;
  nama_toko: string;
  score: number;
  raw_data?: any; // The raw penilaian inputs
};

interface DashboardTableProps {
  data: DashboardRowData[];
}

export default function DashboardTable({ data }: DashboardTableProps) {
  const [selectedItem, setSelectedItem] = useState<DashboardRowData | null>(null);

  const getBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-500 hover:bg-green-600";
    if (score >= 60) return "bg-yellow-500 hover:bg-yellow-600 text-black";
    return "bg-red-500 hover:bg-red-600";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Peringkat Kinerja Toko (SAW)</CardTitle>
          <p className="text-sm text-zinc-500 mt-1">
            Klik baris pada tabel untuk melihat detail performa bulanan.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Rank</TableHead>
                <TableHead>Nama Toko</TableHead>
                <TableHead className="text-right">Skor Akhir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-zinc-100 transition-colors"
                  onClick={() => setSelectedItem(item)}
                >
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>{item.nama_toko}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={getBadgeColor(item.score)}>
                      {item.score}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Belum ada data penilaian untuk periode ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Detail Performa: {selectedItem?.nama_toko}
            </DialogTitle>
            <p className="text-sm text-zinc-500">
              Periode: {selectedItem?.raw_data?.periode} | Skor SAW Akhir:{" "}
              <span className="font-bold text-zinc-900">{selectedItem?.score}</span>
            </p>
          </DialogHeader>

          {selectedItem?.raw_data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-zinc-50">
                  <h3 className="font-semibold text-sm border-b pb-2 mb-3">C1: Sales Ratio (Benefit)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-zinc-500">Sales Aktual</p>
                    <p className="font-medium text-right">Rp {selectedItem.raw_data.sales_aktual.toLocaleString('id-ID')}</p>
                    <p className="text-zinc-500">Sales Target</p>
                    <p className="font-medium text-right">Rp {selectedItem.raw_data.sales_target.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-zinc-50">
                  <h3 className="font-semibold text-sm border-b pb-2 mb-3">C2: Availability (Benefit)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-zinc-500">Availability Ratio</p>
                    <p className="font-medium text-right">{(selectedItem.raw_data.availability_ratio * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-zinc-50">
                  <h3 className="font-semibold text-sm border-b pb-2 mb-3">C5 & C6: On Time Ratio (Benefit)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-zinc-500">On Time Shopee</p>
                    <p className="font-medium text-right">{selectedItem.raw_data.on_time_shopee} / {selectedItem.raw_data.total_invoice_shopee}</p>
                    <p className="text-zinc-500">On Time Global</p>
                    <p className="font-medium text-right">{selectedItem.raw_data.on_time_global} / {selectedItem.raw_data.total_invoice_global}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-zinc-50">
                  <h3 className="font-semibold text-sm border-b pb-2 mb-3">C3 & C4: Incomplete Order (Cost)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-zinc-500">Incomplete Shopee</p>
                    <p className="font-medium text-right">{selectedItem.raw_data.incomplete_shopee} / {selectedItem.raw_data.total_shopee}</p>
                    <p className="text-zinc-500">Incomplete Global</p>
                    <p className="font-medium text-right">{selectedItem.raw_data.incomplete_store} / {selectedItem.raw_data.total_online}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-zinc-50">
                  <h3 className="font-semibold text-sm border-b pb-2 mb-3">C7: Complain Rate (Cost)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-zinc-500">Total Complain</p>
                    <p className="font-medium text-right">{selectedItem.raw_data.complain_total} / {selectedItem.raw_data.total_shopee_complain}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
