/**
 * Charts Service - Lab 2 eGovernment 2025
 * 
 * This service generates chart images for the PDF report using Chart.js
 * with canvas rendering for server-side generation.
 */

import { createCanvas } from 'canvas';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {
  ReportData,
  ProgramStats,
  SpecializationStats,
  PaymentTypeStats,
  CourseStats,
  CreditStats,
  FormaStats,
  ScholarshipStats,
} from './reportDataService';

// Register all Chart.js components
Chart.register(...registerables);

// Chart dimensions
const CHART_WIDTH = 500;
const CHART_HEIGHT = 300;

// Color palette for charts
const COLORS = {
  primary: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'],
  primaryAlpha: ['rgba(79, 70, 229, 0.7)', 'rgba(124, 58, 237, 0.7)', 'rgba(236, 72, 153, 0.7)', 
                 'rgba(245, 158, 11, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(59, 130, 246, 0.7)',
                 'rgba(239, 68, 68, 0.7)', 'rgba(139, 92, 246, 0.7)'],
  border: '#E5E7EB',
};

/**
 * Generates a base64 encoded PNG from a chart configuration
 */
function renderChartToBase64(configuration: ChartConfiguration): string {
  const canvas = createCanvas(CHART_WIDTH, CHART_HEIGHT);
  const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
  
  // Create the chart
  new Chart(ctx, configuration);
  
  return canvas.toDataURL('image/png');
}

/**
 * Creates a pie chart configuration
 */
function createPieConfig(
  labels: string[],
  data: number[],
  title: string
): ChartConfiguration<'pie'> {
  return {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: COLORS.primary.slice(0, data.length),
        borderColor: 'white',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 14, weight: 'bold' },
        },
        legend: {
          position: 'bottom',
          labels: { font: { size: 10 } },
        },
      },
    },
  };
}

/**
 * Creates a bar chart configuration
 */
function createBarConfig(
  labels: string[],
  data: number[],
  title: string,
  label: string,
  horizontal: boolean = false
): ChartConfiguration<'bar'> {
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: COLORS.primaryAlpha.slice(0, data.length),
        borderColor: COLORS.primary.slice(0, data.length),
        borderWidth: 1,
      }],
    },
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: false,
      animation: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 14, weight: 'bold' },
        },
        legend: { display: false },
      },
      scales: {
        x: { grid: { color: COLORS.border } },
        y: { grid: { color: COLORS.border }, beginAtZero: true },
      },
    },
  };
}

/**
 * Creates a line chart configuration
 */
function createLineConfig(
  labels: string[],
  data: number[],
  title: string,
  label: string
): ChartConfiguration<'line'> {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: COLORS.primary[0],
        backgroundColor: COLORS.primaryAlpha[0],
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: COLORS.primary[0],
      }],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 14, weight: 'bold' },
        },
        legend: { display: false },
      },
      scales: {
        x: { grid: { color: COLORS.border } },
        y: { grid: { color: COLORS.border }, beginAtZero: true },
      },
    },
  };
}

// Interface for all generated charts
export interface ReportCharts {
  programPieChart: string;
  programBarChart: string;
  specializationBarChart: string;
  paymentTypePieChart: string;
  paymentTypeAmountBarChart: string;
  topCoursesBarChart: string;
  creditsBarChart: string;
  formaBarChart: string;
  formaPieChart: string;
  scholarshipPieChart: string;
  scholarshipBarChart: string;
  financialRangesBarChart: string;
  dailyPaymentsLineChart: string;
  hourlyDistributionBarChart: string;
}

/**
 * Generate Program Distribution Pie Chart
 */
function generateProgramPieChart(stats: ProgramStats[]): string {
  const labels = stats.map(s => s.program);
  const data = stats.map(s => s.percentage);
  const config = createPieConfig(labels, data, 'Distributie Plati per Program (%)');
  return renderChartToBase64(config);
}

/**
 * Generate Program Distribution Bar Chart
 */
function generateProgramBarChart(stats: ProgramStats[]): string {
  const labels = stats.map(s => s.program);
  const data = stats.map(s => s.count);
  const config = createBarConfig(labels, data, 'Numar Plati per Program', 'Plati');
  return renderChartToBase64(config);
}

/**
 * Generate Specialization Bar Chart
 */
function generateSpecializationBarChart(stats: SpecializationStats[]): string {
  const top5 = stats.slice(0, 5);
  const labels = top5.map(s => s.specializare);
  const data = top5.map(s => s.count);
  const config = createBarConfig(labels, data, 'Top 5 Specializari', 'Plati', true);
  return renderChartToBase64(config);
}

/**
 * Generate Payment Type Pie Chart
 */
function generatePaymentTypePieChart(stats: PaymentTypeStats[]): string {
  const labels = stats.map(s => s.tipPlata || 'Necunoscut');
  const data = stats.map(s => s.percentage);
  const config = createPieConfig(labels, data, 'Distributie Tipuri Plata (%)');
  return renderChartToBase64(config);
}

/**
 * Generate Payment Type Amount Bar Chart
 */
function generatePaymentTypeAmountBarChart(stats: PaymentTypeStats[]): string {
  const labels = stats.map(s => s.tipPlata || 'Necunoscut');
  const data = stats.map(s => s.totalAmount);
  const config = createBarConfig(labels, data, 'Suma Totala per Tip Plata (RON)', 'Suma');
  return renderChartToBase64(config);
}

/**
 * Generate Top Courses Bar Chart
 */
function generateTopCoursesBarChart(stats: CourseStats[]): string {
  if (stats.length === 0) {
    return generatePlaceholderChart('Nu exista date despre cursuri');
  }
  const labels = stats.map(s => s.courseName.length > 20 ? s.courseName.substring(0, 20) + '...' : s.courseName);
  const data = stats.map(s => s.count);
  const config = createBarConfig(labels, data, 'Top 5 Cursuri Refacute', 'Plati', true);
  return renderChartToBase64(config);
}

/**
 * Generate Credits Distribution Bar Chart
 */
function generateCreditsBarChart(stats: CreditStats[]): string {
  if (stats.length === 0) {
    return generatePlaceholderChart('Nu exista date despre credite');
  }
  const labels = stats.map(s => `${s.credits} credite`);
  const data = stats.map(s => s.count);
  const config = createBarConfig(labels, data, 'Distributie per Numar Credite', 'Plati');
  return renderChartToBase64(config);
}

/**
 * Generate Forma (Buget/Taxa) Bar Chart
 */
function generateFormaBarChart(stats: FormaStats[]): string {
  const labels = stats.map(s => s.forma);
  const data = stats.map(s => s.count);
  const config = createBarConfig(labels, data, 'Numar Plati: Buget vs Taxa', 'Plati');
  return renderChartToBase64(config);
}

/**
 * Generate Forma (Buget/Taxa) Pie Chart by Amount
 */
function generateFormaPieChart(stats: FormaStats[]): string {
  const labels = stats.map(s => s.forma);
  const data = stats.map(s => s.amountPercentage);
  const config = createPieConfig(labels, data, 'Suma Totala: Buget vs Taxa (%)');
  return renderChartToBase64(config);
}

/**
 * Generate Scholarship Type Pie Chart
 */
function generateScholarshipPieChart(stats: ScholarshipStats[]): string {
  if (stats.length === 0) {
    return generatePlaceholderChart('Nu exista date despre tipul de taxare');
  }
  const labels = stats.map(s => s.type);
  const data = stats.map(s => s.percentage);
  const config = createPieConfig(labels, data, 'Distributie Semestrial vs Anual (%)');
  return renderChartToBase64(config);
}

/**
 * Generate Scholarship Type Bar Chart by Total Amount
 */
function generateScholarshipBarChart(stats: ScholarshipStats[]): string {
  if (stats.length === 0) {
    return generatePlaceholderChart('Nu exista date despre tipul de taxare');
  }
  const labels = stats.map(s => s.type);
  const data = stats.map(s => s.totalAmount);
  const config = createBarConfig(labels, data, 'Suma Totala per Regim Taxare (RON)', 'Suma');
  return renderChartToBase64(config);
}

/**
 * Generate Financial Ranges Bar Chart
 */
function generateFinancialRangesBarChart(ranges: { range: string; count: number }[]): string {
  const labels = ranges.map(r => r.range);
  const data = ranges.map(r => r.count);
  const config = createBarConfig(labels, data, 'Distributie Plati per Interval Valoare', 'Plati');
  return renderChartToBase64(config);
}

/**
 * Generate Daily Payments Line Chart
 */
function generateDailyPaymentsLineChart(dailyPayments: { date: string; count: number }[]): string {
  if (dailyPayments.length === 0) {
    return generatePlaceholderChart('Nu exista date despre plati zilnice');
  }
  // Take last 14 days max for readability
  const last14 = dailyPayments.slice(-14);
  const labels = last14.map(d => d.date.split('-').slice(1).join('/'));
  const data = last14.map(d => d.count);
  const config = createLineConfig(labels, data, 'Evolutie Plati in Timp', 'Plati');
  return renderChartToBase64(config);
}

/**
 * Generate Hourly Distribution Bar Chart
 */
function generateHourlyDistributionBarChart(hourlyDistribution: { hour: string; count: number }[]): string {
  if (hourlyDistribution.length === 0) {
    return generatePlaceholderChart('Nu exista date despre distributia orara');
  }
  const labels = hourlyDistribution.map(h => h.hour);
  const data = hourlyDistribution.map(h => h.count);
  const config = createBarConfig(labels, data, 'Distributie Plati per Ora', 'Plati');
  return renderChartToBase64(config);
}

/**
 * Generate a placeholder chart when no data is available
 */
function generatePlaceholderChart(message: string): string {
  const config: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['Nu exista date'],
      datasets: [{
        label: message,
        data: [0],
        backgroundColor: '#E5E7EB',
        borderColor: '#9CA3AF',
        borderWidth: 1,
      }],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        title: {
          display: true,
          text: message,
          font: { size: 14 },
        },
        legend: { display: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    },
  };
  return renderChartToBase64(config);
}

/**
 * Main function to generate all charts for the report
 */
export function generateAllCharts(data: ReportData): ReportCharts {
  return {
    programPieChart: generateProgramPieChart(data.programStats),
    programBarChart: generateProgramBarChart(data.programStats),
    specializationBarChart: generateSpecializationBarChart(data.specializationStats),
    paymentTypePieChart: generatePaymentTypePieChart(data.paymentTypeStats),
    paymentTypeAmountBarChart: generatePaymentTypeAmountBarChart(data.paymentTypeStats),
    topCoursesBarChart: generateTopCoursesBarChart(data.topCourses),
    creditsBarChart: generateCreditsBarChart(data.creditStats),
    formaBarChart: generateFormaBarChart(data.formaStats),
    formaPieChart: generateFormaPieChart(data.formaStats),
    scholarshipPieChart: generateScholarshipPieChart(data.scholarshipStats),
    scholarshipBarChart: generateScholarshipBarChart(data.scholarshipStats),
    financialRangesBarChart: generateFinancialRangesBarChart(data.financialStats.ranges),
    dailyPaymentsLineChart: generateDailyPaymentsLineChart(data.timeStats.dailyPayments),
    hourlyDistributionBarChart: generateHourlyDistributionBarChart(data.timeStats.hourlyDistribution),
  };
}
