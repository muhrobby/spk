"use client";

import { useEffect, useState } from "react";

import { CalendarDays, Clock3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const;

export function SidebarDateClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const dayLabel = now ? (DAY_NAMES[now.getDay()] ?? "") : "---";
  const dateLabel = now
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(now)
    : "-- --- ----";
  const timeLabel = now
    ? new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : "--.--.--";

  return (
    <Card size="sm" className="shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <CalendarDays className="size-4" />
          Kalender
        </CardTitle>
        <CardDescription>Jadwal hari ini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="font-medium text-sm">{dayLabel}</p>
          <p className="text-muted-foreground text-xs">{dateLabel}</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Jam digital</span>
          </div>
          <span className="font-mono font-semibold text-sm tabular-nums">{timeLabel}</span>
        </div>

        <div className="space-y-1 rounded-lg border bg-muted/20 p-3 text-xs">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Nama</span>
            <span className="text-right font-medium">Muhammad Robby</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">NIM</span>
            <span className="font-medium font-mono">231011400132</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Kelas</span>
            <span className="font-medium">06TPLE003</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
