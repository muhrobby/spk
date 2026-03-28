import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Store, ClipboardPen, Menu } from "lucide-react";
import { db } from "@/db";
import { penilaian } from "@/db/schema";
import { desc } from "drizzle-orm";
import MonthFilter from "@/components/MonthFilter";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KPI Tracker & SPK Toko",
  description: "Dashboard Evaluasi Kinerja Toko menggunakan Metode SAW",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ambil semua periode unik dari database, urutkan terbaru
  const dbPeriode = await db
    .select({ periode: penilaian.periode })
    .from(penilaian)
    .groupBy(penilaian.periode)
    .orderBy(desc(penilaian.periode));

  const availablePeriode = dbPeriode.map((p) => p.periode);

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-zinc-50`} suppressHydrationWarning>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-white md:flex">
            <div className="flex h-16 items-center px-6 font-bold text-xl tracking-tight border-b">
              SPK Evaluasi
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/data"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                <Store className="h-5 w-5" />
                Data Toko
              </Link>
              <Link
                href="/input"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                <ClipboardPen className="h-5 w-5" />
                Input Kinerja
              </Link>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col md:pl-64">
            {/* Header */}
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
              <div className="flex items-center gap-4">
                <button className="md:hidden">
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold text-zinc-900">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Suspense fallback={<div className="h-8 w-32 bg-zinc-200 animate-pulse rounded-md" />}>
                  <MonthFilter availablePeriode={availablePeriode} />
                </Suspense>
              </div>
            </header>

            {/* Page Content */}
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
