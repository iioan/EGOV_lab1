import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "@/lib/redux/store";

// Types
type Forma = "Buget" | "Taxă";
type TipPlata = "Plată taxă școlarizare" | "Plată refacere curs";
type Program = "Licență" | "Master" | "Doctorat";
type Periodicitate = "semestrial" | "anual";

type BreakdownRow = { label: string; value: string | number };

export interface PaymentTotalState {
  finalAmount: number;
  breakdown: BreakdownRow[];
}

const initialState: PaymentTotalState = {
  finalAmount: 0,
  breakdown: [],
};

const paymentTotalSlice = createSlice({
  name: "paymentTotal",
  initialState,
  reducers: {
    setFinalTotal(
      state,
      action: PayloadAction<{ finalAmount: number; breakdown: BreakdownRow[] }>
    ) {
      state.finalAmount = action.payload.finalAmount;
      state.breakdown = action.payload.breakdown;
    },
    resetTotal(state) {
      state.finalAmount = 0;
      state.breakdown = [];
    },
  },
});

export const { setFinalTotal, resetTotal } = paymentTotalSlice.actions;
export default paymentTotalSlice.reducer;

export const recomputeTotal = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const s = getState() as any;

  // --- Read from existing slices (be resilient to key naming) ---
  const programRaw: string | undefined = s?.academicData?.program;
  const formaRaw: string | undefined = s?.academicData?.forma;

  // scholarshipType can hold the periodicity; support multiple possible keys
  const periodicityRaw: string | undefined =
    s?.scholarshipType?.perioada ??
    s?.scholarshipType?.scholarshipType;

  const tipPlataRaw: string | undefined = s?.paymentDetails?.tipPlata;
  const tarifCursRaw: number | string | undefined = s?.paymentDetails?.tarifCurs;
  const numarCrediteRaw: number | string | undefined =
    s?.paymentDetails?.numarCredite ?? s?.scholarshipType?.numarCredite;

  // --- Normalize helpers ---
  const normalizeStr = (v: any, fb: string) =>
    typeof v === "string" && v.trim().length ? v.trim() : fb;

  const normalizeNum = (v: any, fb = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fb;
  };

  const forma: Forma = (normalizeStr(formaRaw, "Buget") === "Taxă" ? "Taxă" : "Buget");
  const program: Program =
    normalizeStr(programRaw, "Licență") as Program;

  const perioada: Periodicitate | undefined = (() => {
    const v = normalizeStr(periodicityRaw, "").toLowerCase();
    if (v === "semestrial" || v === "anual") return v;
    return undefined;
  })();

  // If forma is Buget, tipPlata is always "Plată refacere curs"
  const tipPlata: TipPlata = (() => {
    if (forma === "Buget") return "Plată refacere curs";
    const v = normalizeStr(tipPlataRaw, "Plată taxă școlarizare");
    return v === "Plată refacere curs" ? v : "Plată taxă școlarizare";
  })();

  const tarifCurs = normalizeNum(tarifCursRaw, 0);
  const numarCredite = normalizeNum(numarCrediteRaw, 0);

  // Tuition per semester (fixed table)
  const tuitionPerSemester: Record<Program, number> = {
    "Licență": 4500,
    "Master": 5500,
    "Doctorat": 7500,
  };

  // 10 RON processing fee
  const processingFee = 10 ;

  // --- Compute ---
  let finalAmount = 0;
  const breakdown: BreakdownRow[] = [];

  if (forma === "Buget") {
    // Budget users never pay tuition; only refacere curs
    breakdown.push({ label: "Regim de studiu", value: "Buget" });

    if (tipPlata === "Plată refacere curs") {
      breakdown.push(
        { label: "Tip plată", value: "Plată refacere curs" },
        { label: "Tarif curs", value: tarifCurs },
        { label: "Taxă procesare administrativă", value: processingFee }

      );
      // For Buget we do NOT add processing fee (you can switch this to always add, if desired)
      finalAmount = tarifCurs + processingFee;
    } else {
      // Defensive path, should not occur due to forcing above
      breakdown.push(
        { label: "Tip plată", value: tipPlata },
        { label: "Total taxă școlarizare", value: 0 }
      );
      finalAmount = 0;
    }
  } else {
    // Forma = Taxă
    breakdown.push({ label: "Regim de studiu", value: "Taxă" });

    if (tipPlata === "Plată refacere curs") {
      breakdown.push(
        { label: "Tip plată", value: "Plată refacere curs" },
        { label: "Tarif curs", value: tarifCurs },
        { label: "Taxă procesare administrativă", value: processingFee }
      );
      finalAmount = tarifCurs + processingFee;
    } else {
      // Taxă școlarizare
      breakdown.push(
        { label: "Program", value: program },
        { label: "Periodicitate", value: perioada ? (perioada === "anual" ? "Anual (x2)" : "Semestrial (x1)") : "— nealeasă —" }
      );
      const tuitionBase = tuitionPerSemester[program] ?? 0;
      const tuitionTotal = perioada
        ? tuitionBase * (perioada === "anual" ? 2 : 1)
        : 0;
      breakdown.push(
        { label: "Taxă școlarizare", value: tuitionTotal },
        { label: "Taxă procesare administrativă", value: processingFee }
      );
      finalAmount = tuitionTotal + processingFee;
    }
  }

  // Persist to store
  dispatch(setFinalTotal({ finalAmount, breakdown }));
};


export const selectFinalAmount = (s: RootState) => (s as any)?.paymentTotal?.finalAmount ?? 0;
export const selectBreakdown = (s: RootState) => (s as any)?.paymentTotal?.breakdown ?? [];
