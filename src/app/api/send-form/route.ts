import {NextResponse} from 'next/server';
import {supabase} from '@/utils/supabase';
import {mapReduxStateToPaymentEntity, PaymentEntity} from '@/lib/models/payment';
import {ReduxPaymentState} from '@/lib/types/reduxState';
import {generatePaymentXML} from '@/utils/xmlGenerator';
import {uploadPaymentXML} from '@/lib/services/storageService';
import {generatePaymentOrderPDF} from '@/utils/pdfGenerator';
import {uploadPaymentOrderPDF} from '@/lib/services/pdfStorageService';
import {readFileSync} from 'fs';
import {join} from 'path';

export async function POST(req: Request) {
  try {
    const data: ReduxPaymentState = await req.json();

    console.log('Received data:', data);

    // Basic sanity checks
    if (!data?.studentIdentity || !data?.academicData) {
      return NextResponse.json(
        {ok: false, error: 'Missing required slices in payload.'},
        {status: 400}
      );
    }

    // Load DejaVu Sans font from public folder
    const fontPath = join(process.cwd(), 'public', 'fonts', 'DejaVuSans.ttf');
    const fontBuffer = readFileSync(fontPath);
    const fontBase64 = fontBuffer.toString('base64');

    console.log('Received data:', data);

    // Basic sanity checks
    if (!data?.studentIdentity || !data?.academicData) {
      return NextResponse.json(
        {ok: false, error: 'Missing required slices in payload.'},
        {status: 400}
      );
    }

    // Map Redux state to PaymentEntity (excluding errors and breakdowns)
    const paymentEntity: PaymentEntity = mapReduxStateToPaymentEntity(data);

    // Convert camelCase to snake_case for Supabase columns
    const dbPayload = {
      cnp: paymentEntity.cnp,
      nume: paymentEntity.nume,
      prenume: paymentEntity.prenume,
      cod_student: paymentEntity.codStudent,
      email_institutional: paymentEntity.emailInstitutional,
      telefon: paymentEntity.telefon,
      program: paymentEntity.program,
      specializare: paymentEntity.specializare,
      an: paymentEntity.an,
      forma: paymentEntity.forma,
      tip_plata: paymentEntity.tipPlata,
      nume_curs: paymentEntity.numeCurs,
      semestru: paymentEntity.semestru,
      numar_credite: paymentEntity.numarCredite,
      tarif_curs: paymentEntity.tarifCurs,
      scholarship_type: paymentEntity.scholarshipType,
      final_amount: paymentEntity.finalAmount,
    };

    // Insert into database
    const {data: insertedData, error: supabaseError} = await supabase
      .from('payments')
      .insert([dbPayload])
      .select()
      .single();

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return NextResponse.json(
        {
          ok: false,
          error: 'Failed to save payment to database.',
          details: supabaseError.message
        },
        {status: 500}
      );
    }

    console.log('Payment saved successfully:', insertedData);

    // Generate XML content
    const xmlContent = generatePaymentXML(data, insertedData.id);

    // Upload XML to Supabase Storage
    const uploadXMLResult = await uploadPaymentXML(
      xmlContent,
      insertedData.id,
      insertedData.nume,
      insertedData.prenume
    );

    // Generate PDF
    const pdfBlob = generatePaymentOrderPDF(data, insertedData.id, fontBase64);

    // Upload PDF to Supabase Storage
    const uploadPDFResult = await uploadPaymentOrderPDF(
      pdfBlob,
      insertedData.id,
      insertedData.nume,
      insertedData.prenume
    );

    // Check if both uploads succeeded
    if (!uploadXMLResult.success && !uploadPDFResult.success) {
      return NextResponse.json({
        ok: true,
        message: 'Payment saved successfully, but XML and PDF upload failed',
        paymentId: insertedData.id,
        receivedAt: new Date().toISOString(),
        xmlUploadError: uploadXMLResult.error,
        pdfUploadError: uploadPDFResult.error,
      });
    }

    if (!uploadXMLResult.success) {
      return NextResponse.json({
        ok: true,
        message: 'Payment saved successfully, but XML upload failed',
        paymentId: insertedData.id,
        receivedAt: new Date().toISOString(),
        xmlUploadError: uploadXMLResult.error,
        pdfFile: uploadPDFResult.success ? {
          path: uploadPDFResult.path,
          url: uploadPDFResult.url,
          filename: uploadPDFResult.filename
        } : undefined
      });
    }

    if (!uploadPDFResult.success) {
      return NextResponse.json({
        ok: true,
        message: 'Payment saved successfully, but PDF upload failed',
        paymentId: insertedData.id,
        receivedAt: new Date().toISOString(),
        pdfUploadError: uploadPDFResult.error,
        xmlFile: uploadXMLResult.success ? {
          path: uploadXMLResult.path,
          url: uploadXMLResult.url
        } : undefined
      });
    }

    return NextResponse.json({
      ok: true,
      message: 'Payment saved successfully',
      paymentId: insertedData.id,
      receivedAt: new Date().toISOString(),
      xmlFile: {
        path: uploadXMLResult.path,
        url: uploadXMLResult.url
      },
      pdfFile: {
        path: uploadPDFResult.path,
        url: uploadPDFResult.url,
        filename: uploadPDFResult.filename
      }
    });
  } catch (e: unknown) {
    const error = e as Error;
    console.error('send-form error:', error);
    return NextResponse.json(
      {ok: false, error: 'Invalid request or server error.', details: error?.message},
      {status: 400}
    );
  }
}