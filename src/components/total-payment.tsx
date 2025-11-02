"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { recomputeTotal, selectFinalAmount, selectBreakdown } from "@/lib/redux/features/paymentTotalSlice";

export default function TotalPayment() {
  const dispatch = useDispatch();

  const forma = useSelector((s: RootState) => (s as any)?.academicData?.forma);
  const program = useSelector((s: RootState) => (s as any)?.academicData?.program);
  const tipPlata = useSelector((s: RootState) => (s as any)?.paymentDetails?.tipPlata);
  const tarifCurs = useSelector((s: RootState) => (s as any)?.paymentDetails?.tarifCurs);
  const periodicitate =
    (useSelector((s: RootState) => (s as any)?.scholarshipType?.perioada ??
      (s as any)?.scholarshipType?.perioda ??
      (s as any)?.scholarshipType?.periodicity ??
      (s as any)?.scholarshipType?.scholarshipType));
  const numarCredite = useSelector((s: RootState) =>
    (s as any)?.paymentDetails?.numarCredite ??
    (s as any)?.scholarshipType?.numarCredite
  );

  useEffect(() => {
    dispatch(recomputeTotal() as any);
  }, [
    dispatch,
    forma,
    program,
    tipPlata,
    tarifCurs,
    periodicitate,
    numarCredite,
  ]);

  const finalAmount = useSelector(selectFinalAmount);
  const breakdown = useSelector(selectBreakdown);

  return (
    <div className="rounded-2xl p-4 md:p-5">
      <h3 className="text-lg font-semibold tracking-tight mb-3">Total de plată</h3>

      <dl className="space-y-2 text-sm">
        {breakdown.map((row: { label: string; value: string | number }, idx: number) => (
          <div key={idx} className="flex items-center justify-between">
            <dt className="dark:text-zinc-600">{row.label}</dt>
            <dd className="font-medium">{formatValue(row.value)}</dd>
          </div>
        ))}
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
        <div className="flex items-center justify-between">
          <dt className="text-base font-medium">Total</dt>
          <dd className="text-xl font-bold">{formatCurrency(finalAmount)} RON</dd>
        </div>
      </dl>
    </div>
  );
}

function formatCurrency(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return v.toLocaleString("ro-RO", { maximumFractionDigits: 2 });
}
function formatValue(v: unknown) {
  if (typeof v === "number") return `${formatCurrency(v)} RON`;
  return String(v ?? "");
}
