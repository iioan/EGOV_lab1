import { supabase } from '@/utils/supabase';
import type { UploadPDFResult } from '@/lib/types';

/**
 * Uploads a PDF file to Supabase Storage
 * @param pdfBlob - The PDF content as a Blob
 * @param paymentId - The payment ID to use in the filename
 * @param nume - Student last name
 * @param prenume - Student first name
 * @returns Upload result with path and URL
 */
export async function uploadPaymentOrderPDF(
  pdfBlob: Blob,
  paymentId: number,
  nume: string,
  prenume: string
): Promise<UploadPDFResult> {
  try {
    const now = new Date();
    const datetime = now.toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .split('.')[0];

    const sanitizedNume = nume.replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedPrenume = prenume.replace(/[^a-zA-Z0-9]/g, '_');

    const fileName = `${datetime}_${sanitizedNume}_${sanitizedPrenume}_payment_order.pdf`;
    const filePath = `pdfs/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message
      };
    }

    console.log('PDF file uploaded successfully:', uploadData);

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return {
      success: true,
      path: filePath,
      url: publicUrlData.publicUrl
    };
  } catch (error) {
    const err = error as Error;
    console.error('Unexpected error during PDF upload:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Downloads a file from a given URL
 * @param url - The URL of the file to download
 * @param filename - The desired filename for the download
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}