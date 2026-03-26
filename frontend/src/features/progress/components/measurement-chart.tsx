"use client";

import type { BodyMeasurement } from "@/api/services/progress.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MeasurementChartProps = {
  measurements: BodyMeasurement[];
  site?: string;
};

export function MeasurementChart({
  measurements,
  site,
}: MeasurementChartProps) {
  const filtered = site
    ? measurements.filter((m) => m.site === site)
    : measurements;

  if (filtered.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No data available for this metric.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Site</TableHead>
          <TableHead className="text-right">Value (cm)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((m) => (
          <TableRow key={m.id}>
            <TableCell>{m.measuredAt}</TableCell>
            <TableCell>{m.site}</TableCell>
            <TableCell className="text-right">
              {m.valueCm}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
