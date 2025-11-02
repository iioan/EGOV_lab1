'use client';
import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import type {RootState} from '@/lib/redux/store';
import {recomputeTarif} from '@/lib/redux/features/paymentDetailsSlice'; // ensure this is exported

type Forma = 'Buget' | 'Taxă'
type TipPlata = 'Plată taxă școlarizare' | 'Plată refacere curs';
type Program = 'Licență' | 'Master' | 'Doctorat';
type Perioada = 'semestrial' | 'anual'; // normalize to lowercase

function normalize<T extends string>(v: unknown, fallback: T, toLower = false): T {
  if (typeof v !== 'string' || !v.trim()) return fallback;
  return (toLower ? (v.trim().toLowerCase() as T) : (v.trim() as T));
}

export default function TotalPayment() {
  const dispatch = useDispatch();

  // ---- SELECTORS: adjust to your actual slices/keys ----
  // Academic data (program + forma)
  const programRaw = useSelector((s: RootState) => (s as any)?.academicData?.program as string | undefined);
  const formaRaw = useSelector((s: RootState) => (s as any)?.academicData?.forma as string | undefined);

  // Scholarship type slice (periodicity for tuition)
  const perioadaRaw = useSelector((s: RootState) =>
    (s as any)?.scholarshipType?.scholarshipType as string | undefined
  );

  // Payment details (tip de plată + computed course fee)
  const tipPlataRaw = useSelector((s: RootState) => (s as any)?.paymentDetails?.tipPlata as string | undefined);
  const tarifCurs = useSelector((s: RootState) => Number((s as any)?.paymentDetails?.tarifCurs ?? 0));

  // (Optional) inputs that affect course retake price (update keys to yours)
  const specializare = useSelector((s: RootState) => (s as any)?.academicData?.specializare);
  const numarCredite = useSelector((s: RootState) => Number((s as any)?.paymentDetails?.numarCredite ?? (s as any)?.scholarshipType?.numarCredite ?? 0));

  // ---- NORMALIZE VALUES ----
  const forma = normalize<Forma>(formaRaw, 'Buget'); // default to Buget
  const tipPlata: 'Plată taxă școlarizare' | 'Plată refacere curs' = useMemo(() => {
    if (forma === 'Buget') return 'Plată refacere curs';
    const v = (tipPlataRaw ?? 'Plată taxă școlarizare').trim();
    return v === 'Plată refacere curs' ? v : 'Plată taxă școlarizare';
  }, [forma, tipPlataRaw]);  const program = normalize<Program>(programRaw, 'Licență');
  const perioada = useMemo<('semestrial' | 'anual') | undefined>(() => {
    const v = (perioadaRaw ?? '').trim().toLowerCase();
    return v === 'semestrial' || v === 'anual' ? (v as 'semestrial' | 'anual') : undefined;
  }, [perioadaRaw]);

  const tuitionPerSemester = useMemo(() => ({
    'Licență': 4500,
    'Master': 5500,
    'Doctorat': 7500
  } as Record<Program, number>), []);

  const processingFee = 10;

  const tuitionTotal = useMemo(() => {
    if (!perioada) return 0;
    const base = tuitionPerSemester[program] ?? 0;
    return base * (perioada === 'anual' ? 2 : 1);
  }, [program, perioada, tuitionPerSemester]);

  const {finalAmount, breakdown} = useMemo(() => {
    // Budget => only refacere curs is payable
    if (forma === 'Buget') {
      if (tipPlata === 'Plată refacere curs') {
        return {
          finalAmount: tarifCurs + processingFee,
          breakdown: [
            {label: 'Regim de studiu', value: 'Buget'},
            {label: 'Tip plată', value: 'Plată refacere curs'},
            {label: 'Tarif curs', value: tarifCurs},
            {label: 'Taxă procesare', value: processingFee}
          ]
        };
      }
      return {
        finalAmount: 0,
        breakdown: [
          {label: 'Regim de studiu', value: 'Buget'},
          {label: 'Tip plată', value: tipPlata},
          {label: 'Total taxă școlarizare', value: 0}
        ]
      };
    }

    // Taxă
    if (tipPlata === 'Plată refacere curs') {
      return {
        finalAmount: tarifCurs,
        breakdown: [
          {label: 'Regim de studiu', value: 'Taxă'},
          {label: 'Tip plată', value: 'Plată refacere curs'},
          {label: 'Tarif curs', value: tarifCurs},
          {label: 'Taxă procesare', value: processingFee}
        ]
      };
    }

    if (forma === 'Taxă' && tipPlata === 'Plată taxă școlarizare') {
      if (!perioada) {
        return {
          finalAmount: 0,
          breakdown: [
            {label: 'Regim de studiu', value: 'Taxă'},
            {label: 'Program', value: program},
            {label: 'Periodicitate', value: '— nealeasă —'},
            {label: 'Taxă școlarizare', value: 0},
          ]
        };
      }
    }

    // tipPlata default: taxă școlarizare
    return {
      finalAmount: tuitionTotal + processingFee,
      breakdown: [
        {label: 'Regim de studiu', value: 'Taxă'},
        {label: 'Program', value: program},
        {label: 'Periodicitate', value: perioada === 'anual' ? 'Anual (x2)' : 'Semestrial (x1)'},
        {label: 'Taxă școlarizare', value: tuitionTotal},
        {label: 'Taxă procesare', value: processingFee}
      ]
    };
  }, [forma, tipPlata, tarifaCursSafe(tarifCurs), tuitionTotal, program, perioada]);

  useEffect(() => {
    if (tipPlata === 'Plată refacere curs' || forma === 'Buget') {
      try {
        dispatch(recomputeTarif({program, specializare}) as any);
      } catch {
      }
    }
  }, [dispatch, tipPlata, forma, program, specializare, numarCredite]);

  return (
    <div className="rounded-2xl p-4 md:p-5">
      <h3 className="text-lg font-semibold tracking-tight mb-3">Total de plată</h3>

      <dl className="space-y-2 text-sm">
        {breakdown.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <dt className="dark:text-zinc-600">{row.label}</dt>
            <dd className="font-medium">{formatValue(row.value)}</dd>
          </div>
        ))}
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2"/>
        <div className="flex items-center justify-between">
          <dt className="text-base font-medium">Total</dt>
          <dd className="text-xl font-bold">{formatCurrency(finalAmount)} RON</dd>
        </div>
      </dl>

    </div>
  );
}

// Helpers
function formatCurrency(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return v.toLocaleString('ro-RO', {maximumFractionDigits: 2});
}

function formatValue(v: unknown) {
  if (typeof v === 'number') return `${formatCurrency(v)} RON`;
  return String(v ?? '');
}

function tarifaCursSafe(v: number) {
  return Number.isFinite(v) ? v : 0;
}
