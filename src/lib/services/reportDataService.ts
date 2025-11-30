import { supabase } from '@/utils/supabase';

// Type definitions for payment record from database
export interface PaymentRecord {
  id: number;
  cnp: string;
  nume: string;
  prenume: string;
  cod_student: string;
  email_institutional: string;
  telefon: string;
  program: string;
  specializare: string;
  an: string;
  forma: string;
  tip_plata: string;
  nume_curs: string;
  semestru: string;
  numar_credite: string;
  tarif_curs: number;
  scholarship_type: string;
  final_amount: number;
  created_at: string;
}

// Aggregated statistics interfaces
export interface ProgramStats {
  program: string;
  count: number;
  percentage: number;
  totalAmount: number;
}

export interface SpecializationStats {
  specializare: string;
  count: number;
  totalAmount: number;
}

export interface PaymentTypeStats {
  tipPlata: string;
  count: number;
  percentage: number;
  totalAmount: number;
  amountPercentage: number;
}

export interface CourseStats {
  courseName: string;
  count: number;
  totalAmount: number;
}

export interface CreditStats {
  credits: string;
  count: number;
  percentage: number;
}

export interface FormaStats {
  forma: string;
  count: number;
  percentage: number;
  totalAmount: number;
  amountPercentage: number;
}

export interface ScholarshipStats {
  type: string;
  count: number;
  percentage: number;
  totalAmount: number;
  averageAmount: number;
}

export interface FinancialStats {
  totalAmount: number;
  averageAmount: number;
  minAmount: number;
  maxAmount: number;
  ranges: { range: string; count: number }[];
}

export interface TimeStats {
  dailyPayments: { date: string; count: number }[];
  hourlyDistribution: { hour: string; count: number }[];
  mostActiveHour: string;
  mostActiveDate: string;
}

export interface ReportData {
  totalPayments: number;
  programStats: ProgramStats[];
  topProgram: ProgramStats | null;
  specializationStats: SpecializationStats[];
  topSpecialization: SpecializationStats | null;
  paymentTypeStats: PaymentTypeStats[];
  topPaymentType: PaymentTypeStats | null;
  highestRevenuePaymentType: PaymentTypeStats | null;
  topCourses: CourseStats[];
  creditStats: CreditStats[];
  topCreditValue: CreditStats | null;
  formaStats: FormaStats[];
  scholarshipStats: ScholarshipStats[];
  financialStats: FinancialStats;
  timeStats: TimeStats;
  generatedAt: string;
}

/**
 * Fetches all payments from the database and normalizes tip_plata for Buget students
 */
export async function fetchAllPayments(): Promise<PaymentRecord[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    throw new Error(`Failed to fetch payments: ${error.message}`);
  }

  // Normalize tip_plata: if forma is 'Buget', automatically set tip_plata to 'Plată refacere curs'
  const normalizedData = (data || []).map(payment => ({
    ...payment,
    tip_plata: payment.forma === 'Buget' ? 'Plată refacere curs' : payment.tip_plata,
  }));

  return normalizedData;
}

/**
 * Computes program distribution statistics
 */
function computeProgramStats(payments: PaymentRecord[]): ProgramStats[] {
  const programCounts: Record<string, { count: number; totalAmount: number }> = {};

  payments.forEach(payment => {
    const program = payment.program || 'Necunoscut';
    if (!programCounts[program]) {
      programCounts[program] = { count: 0, totalAmount: 0 };
    }
    programCounts[program].count++;
    programCounts[program].totalAmount += payment.final_amount || 0;
  });

  const total = payments.length;
  return Object.entries(programCounts)
    .map(([program, data]) => ({
      program,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      totalAmount: data.totalAmount,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Computes specialization distribution statistics
 * Normalizes specialization names to uppercase for case-insensitive grouping (e.g., 'cti' → 'CTI')
 */
function computeSpecializationStats(payments: PaymentRecord[]): SpecializationStats[] {
  const specCounts: Record<string, { count: number; totalAmount: number }> = {};

  payments.forEach(payment => {
    // Normalize to uppercase for case-insensitive grouping
    const spec = (payment.specializare || 'Necunoscut').toUpperCase();
    if (!specCounts[spec]) {
      specCounts[spec] = { count: 0, totalAmount: 0 };
    }
    specCounts[spec].count++;
    specCounts[spec].totalAmount += payment.final_amount || 0;
  });

  return Object.entries(specCounts)
    .map(([specializare, data]) => ({
      specializare,
      count: data.count,
      totalAmount: data.totalAmount,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Computes payment type distribution statistics
 */
function computePaymentTypeStats(payments: PaymentRecord[]): PaymentTypeStats[] {
  const typeCounts: Record<string, { count: number; totalAmount: number }> = {};

  payments.forEach(payment => {
    const type = payment.tip_plata || 'Necunoscut';
    if (!typeCounts[type]) {
      typeCounts[type] = { count: 0, totalAmount: 0 };
    }
    typeCounts[type].count++;
    typeCounts[type].totalAmount += payment.final_amount || 0;
  });

  const total = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + (p.final_amount || 0), 0);

  return Object.entries(typeCounts)
    .map(([tipPlata, data]) => ({
      tipPlata,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      totalAmount: data.totalAmount,
      amountPercentage: totalAmount > 0 ? Math.round((data.totalAmount / totalAmount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extracts capital letters from a course name to form an acronym
 * Example: "Structuri de Date si Algoritmi" → "SDA" (extracts S, D, A - the capital letters)
 * Note: This only extracts existing uppercase letters, not first letters of each word
 */
function extractAcronym(text: string): string {
  if (!text) return '';
  // Extract only capital letters to form the acronym
  return text.replace(/[^A-Z]/g, '');
}

/**
 * Computes top courses for course retake payments
 * Groups full course names with their acronyms (e.g., 'Structuri de Date si Algoritmi' with 'SDA')
 */
function computeTopCourses(payments: PaymentRecord[]): CourseStats[] {
  // Filter only course retake payments (Plată refacere curs)
  const retakePayments = payments.filter(p =>
    p.tip_plata === 'Plată refacere curs' && p.nume_curs
  );

  // First pass: collect all courses and build acronym mapping
  // Map acronym → canonical full name (prefer longer names as canonical)
  const acronymToCanonicalName: Record<string, string> = {};
  const allCourses: { course: string; amount: number }[] = [];
  
  retakePayments.forEach(payment => {
    const course = payment.nume_curs;
    allCourses.push({ course, amount: payment.final_amount || 0 });
    
    const acronym = extractAcronym(course);
    const isAcronymOnly = course === course.toUpperCase() && !course.includes(' ');
    
    // For full course names, register them as canonical for their acronym
    if (!isAcronymOnly && acronym) {
      // Prefer longer canonical names
      if (!acronymToCanonicalName[acronym] || course.length > acronymToCanonicalName[acronym].length) {
        acronymToCanonicalName[acronym] = course;
      }
    }
  });

  // Second pass: count courses using canonical names
  const courseCounts: Record<string, { count: number; totalAmount: number }> = {};
  
  allCourses.forEach(({ course, amount }) => {
    const acronym = extractAcronym(course);
    const isAcronymOnly = course === course.toUpperCase() && !course.includes(' ');
    
    // Determine the canonical name to use for counting
    let canonicalName: string;
    if (isAcronymOnly && acronymToCanonicalName[course]) {
      // This is an acronym that has a known full name
      canonicalName = acronymToCanonicalName[course];
    } else if (!isAcronymOnly && acronym && acronymToCanonicalName[acronym]) {
      // This is a full name - use the canonical form
      canonicalName = acronymToCanonicalName[acronym];
    } else {
      // No mapping found, use as-is
      canonicalName = course;
    }
    
    if (!courseCounts[canonicalName]) {
      courseCounts[canonicalName] = { count: 0, totalAmount: 0 };
    }
    courseCounts[canonicalName].count++;
    courseCounts[canonicalName].totalAmount += amount;
  });

  return Object.entries(courseCounts)
    .map(([courseName, data]) => ({
      courseName,
      count: data.count,
      totalAmount: data.totalAmount,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5
}

/**
 * Computes credit distribution statistics
 */
function computeCreditStats(payments: PaymentRecord[]): CreditStats[] {
  const creditCounts: Record<string, number> = {};

  // Filter only course retake payments with credits
  const retakePayments = payments.filter(p =>
    p.tip_plata === 'Plată refacere curs' && p.numar_credite
  );

  retakePayments.forEach(payment => {
    const credits = payment.numar_credite;
    creditCounts[credits] = (creditCounts[credits] || 0) + 1;
  });

  const total = retakePayments.length;
  return Object.entries(creditCounts)
    .map(([credits, count]) => ({
      credits,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => parseInt(b.credits, 10) - parseInt(a.credits, 10));
}

/**
 * Computes form of education statistics (Buget vs Taxa)
 */
function computeFormaStats(payments: PaymentRecord[]): FormaStats[] {
  const formaCounts: Record<string, { count: number; totalAmount: number }> = {};

  payments.forEach(payment => {
    const forma = payment.forma || 'Necunoscut';
    if (!formaCounts[forma]) {
      formaCounts[forma] = { count: 0, totalAmount: 0 };
    }
    formaCounts[forma].count++;
    formaCounts[forma].totalAmount += payment.final_amount || 0;
  });

  const total = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + (p.final_amount || 0), 0);

  return Object.entries(formaCounts)
    .map(([forma, data]) => ({
      forma,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      totalAmount: data.totalAmount,
      amountPercentage: totalAmount > 0 ? Math.round((data.totalAmount / totalAmount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Computes scholarship type statistics (Semestrial vs Anual)
 */
function computeScholarshipStats(payments: PaymentRecord[]): ScholarshipStats[] {
  const scholarshipCounts: Record<string, { count: number; totalAmount: number }> = {};

  // Filter only tuition fee payments with scholarship type
  const tuitionPayments = payments.filter(p =>
    p.tip_plata === 'Plată taxă școlarizare' && p.scholarship_type
  );

  tuitionPayments.forEach(payment => {
    const type = payment.scholarship_type;
    if (!scholarshipCounts[type]) {
      scholarshipCounts[type] = { count: 0, totalAmount: 0 };
    }
    scholarshipCounts[type].count++;
    scholarshipCounts[type].totalAmount += payment.final_amount || 0;
  });

  const total = tuitionPayments.length;
  return Object.entries(scholarshipCounts)
    .map(([type, data]) => ({
      type,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      totalAmount: data.totalAmount,
      averageAmount: data.count > 0 ? Math.round(data.totalAmount / data.count) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Computes financial statistics
 */
function computeFinancialStats(payments: PaymentRecord[]): FinancialStats {
  const amounts = payments.map(p => p.final_amount || 0).filter(a => a > 0);

  if (amounts.length === 0) {
    return {
      totalAmount: 0,
      averageAmount: 0,
      minAmount: 0,
      maxAmount: 0,
      ranges: [],
    };
  }

  const totalAmount = amounts.reduce((sum, a) => sum + a, 0);

  // Compute ranges
  const ranges = [
    { range: '0-500 RON', min: 0, max: 500 },
    { range: '500-1000 RON', min: 500, max: 1000 },
    { range: '1000-2000 RON', min: 1000, max: 2000 },
    { range: '2000+ RON', min: 2000, max: Infinity },
  ];

  const rangeStats = ranges.map(r => ({
    range: r.range,
    count: amounts.filter(a => a >= r.min && a < r.max).length,
  }));

  return {
    totalAmount,
    averageAmount: Math.round(totalAmount / amounts.length),
    minAmount: Math.min(...amounts),
    maxAmount: Math.max(...amounts),
    ranges: rangeStats,
  };
}

/**
 * Computes time-based statistics
 */
function computeTimeStats(payments: PaymentRecord[]): TimeStats {
  const dailyCounts: Record<string, number> = {};
  const hourlyCounts: Record<string, number> = {};

  payments.forEach(payment => {
    if (payment.created_at) {
      const date = new Date(payment.created_at);
      const dateStr = date.toISOString().split('T')[0];
      const hour = date.getHours();
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;

      dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
      hourlyCounts[hourStr] = (hourlyCounts[hourStr] || 0) + 1;
    }
  });

  const dailyPayments = Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const hourlyDistribution = Object.entries(hourlyCounts)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  // Find most active hour and date
  const mostActiveHour = hourlyDistribution.length > 0
    ? hourlyDistribution.reduce((max, curr) => curr.count > max.count ? curr : max).hour
    : 'N/A';

  const mostActiveDate = dailyPayments.length > 0
    ? dailyPayments.reduce((max, curr) => curr.count > max.count ? curr : max).date
    : 'N/A';

  return {
    dailyPayments,
    hourlyDistribution,
    mostActiveHour,
    mostActiveDate,
  };
}

/**
 * Main function to compute all report data
 */
export async function computeReportData(): Promise<ReportData> {
  const payments = await fetchAllPayments();

  const programStats = computeProgramStats(payments);
  const specializationStats = computeSpecializationStats(payments);
  const paymentTypeStats = computePaymentTypeStats(payments);
  const topCourses = computeTopCourses(payments);
  const creditStats = computeCreditStats(payments);
  const formaStats = computeFormaStats(payments);
  const scholarshipStats = computeScholarshipStats(payments);
  const financialStats = computeFinancialStats(payments);
  const timeStats = computeTimeStats(payments);

  // Find highest revenue payment type
  const highestRevenuePaymentType = paymentTypeStats.length > 0
    ? paymentTypeStats.reduce((max, curr) => curr.totalAmount > max.totalAmount ? curr : max)
    : null;

  return {
    totalPayments: payments.length,
    programStats,
    topProgram: programStats[0] || null,
    specializationStats,
    topSpecialization: specializationStats[0] || null,
    paymentTypeStats,
    topPaymentType: paymentTypeStats[0] || null,
    highestRevenuePaymentType,
    topCourses,
    creditStats,
    topCreditValue: creditStats[0] || null,
    formaStats,
    scholarshipStats,
    financialStats,
    timeStats,
    generatedAt: new Date().toISOString(),
  };
}