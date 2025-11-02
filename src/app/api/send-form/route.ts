import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { mapReduxStateToPaymentEntity, PaymentEntity } from '@/lib/models/payment';
import { ReduxPaymentState } from '@/lib/types/reduxState';
import { generatePaymentXML } from '@/utils/xmlGenerator';
import { uploadPaymentXML } from '@/lib/services/storageService';

export async function POST(req: Request) {
  try {
    const data: ReduxPaymentState = await req.json();

    console.log('Received data:', data);

    // Basic sanity checks
    if (!data?.studentIdentity || !data?.academicData) {
      return NextResponse.json(
        { ok: false, error: 'Missing required slices in payload.' },
        { status: 400 }
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
    const { data: insertedData, error: supabaseError } = await supabase
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
        { status: 500 }
      );
    }

    console.log('Payment saved successfully:', insertedData);

    // Generate XML content
    const xmlContent = generatePaymentXML(data, insertedData.id);

    // Upload XML to Supabase Storage
    const uploadResult = await uploadPaymentXML(xmlContent, insertedData.id);

    if (!uploadResult.success) {
      // Don't fail the entire request if XML upload fails
      // but log it for monitoring
      return NextResponse.json({
        ok: true,
        message: 'Payment saved successfully, but XML upload failed',
        paymentId: insertedData.id,
        receivedAt: new Date().toISOString(),
        xmlUploadError: uploadResult.error,
      });
    }

    return NextResponse.json({
      ok: true,
      message: 'Payment saved successfully',
      paymentId: insertedData.id,
      receivedAt: new Date().toISOString(),
      xmlFile: {
        path: uploadResult.path,
        url: uploadResult.url
      }
    });
  } catch (e: unknown) {
    const error = e as Error;
    console.error('send-form error:', error);
    return NextResponse.json(
      { ok: false, error: 'Invalid request or server error.', details: error?.message },
      { status: 400 }
    );
  }
}