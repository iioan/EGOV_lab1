/**
 * Payments Report API Endpoint - Lab 2 eGovernment 2025
 * 
 * This endpoint generates a PDF report with statistics and charts
 * based on payment data from the database.
 * 
 * GET /api/payments-report
 * Returns: application/pdf
 */

import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { computeReportData } from '@/lib/services/reportDataService';
import { generateAllCharts } from '@/lib/services/chartsService';
import PaymentsReportDocument from '@/components/PaymentsReportDocument';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Starting PDF report generation...');

    // Step 1: Fetch and aggregate data from database
    console.log('Step 1: Fetching and computing report data...');
    const reportData = await computeReportData();
    console.log(`Found ${reportData.totalPayments} payments`);

    // Step 2: Generate all charts as base64 images
    console.log('Step 2: Generating charts...');
    const charts = generateAllCharts(reportData);
    console.log('Charts generated successfully');

    // Step 3: Render PDF document
    console.log('Step 3: Rendering PDF...');
    const documentElement = PaymentsReportDocument({ data: reportData, charts });
    const pdfBuffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      documentElement as any
    );
    console.log('PDF rendered successfully');

    // Step 4: Return PDF response
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `payments-report-${timestamp}.pdf`;

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    const err = error as Error;
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to generate PDF report',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
