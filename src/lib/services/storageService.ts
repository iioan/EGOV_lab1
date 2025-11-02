import { supabase } from '@/utils/supabase';

export interface UploadXMLResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

/**
 * Uploads an XML file to Supabase Storage
 * @param xmlContent - The XML content as a string
 * @param paymentId - The payment ID to use in the filename
 * @returns Upload result with path and URL
 */
export async function uploadPaymentXML(
  xmlContent: string,
  paymentId: number,
  nume: string,
  prenume: string
): Promise<UploadXMLResult> {
  try {
    const now = new Date();
    const datetime = now.toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .split('.')[0];

    const sanitizedNume = nume.replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedPrenume = prenume.replace(/[^a-zA-Z0-9]/g, '_');

    const fileName = `${datetime}_${sanitizedNume}_${sanitizedPrenume}_payment.xml`;
    const filePath = `xmls/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, xmlContent, {
        contentType: 'application/xml',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message
      };
    }

    console.log('XML file uploaded successfully:', uploadData);

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
    console.error('Unexpected error during XML upload:', err);
    return {
      success: false,
      error: err.message
    };
  }
}