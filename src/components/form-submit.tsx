'use client';

import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/lib/redux/store';
import {Button, Checkbox, Text} from '@radix-ui/themes';
import * as Toast from '@radix-ui/react-toast';

type ToastTone = 'success' | 'error';

export default function FormSubmit() {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastDesc, setToastDesc] = useState('');
  const [toastTone, setToastTone] = useState<ToastTone>('success');

  // slices
  const studentIdentity = useSelector((s: RootState) => s.studentIdentity);
  const academicData = useSelector((s: RootState) => s.academicData);
  const paymentDetails = useSelector((s: RootState) => s.paymentDetails);
  const scholarshipType = useSelector((s: RootState) => s.scholarshipType);
  const paymentTotal = useSelector((s: RootState) => (s as any).paymentTotal);

  const isFormValid =
    studentIdentity?.nume &&
    studentIdentity?.prenume &&
    studentIdentity?.cnp &&
    academicData?.program &&
    academicData?.specializare &&
    academicData?.forma &&
    (academicData.forma === 'Buget' || paymentDetails?.tipPlata) &&
    (
      academicData.forma === 'Buget' ||
      paymentDetails?.tipPlata === 'Plată refacere curs' ||
      scholarshipType?.scholarshipType
    ) &&
    agreed;

  const openToast = useCallback((title: string, desc: string, tone: ToastTone = 'success') => {
    setToastTitle(title);
    setToastDesc(desc);
    setToastTone(tone);
    // close if open, then reopen next frame to retrigger animation
    setToastOpen(false);
    requestAnimationFrame(() => setToastOpen(true));
  }, []);

  const triggerDownloadFromBlob = (blob: Blob, filename = 'document.pdf') => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const triggerDownloadFromUrl = (url: string, filename?: string) => {
    // If the server sets Content-Disposition, navigation is enough
    if (!filename) {
      window.location.href = url;
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const b64ToBlob = (b64: string, contentType = 'application/pdf') => {
    const byteChars = atob(b64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        studentIdentity,
        academicData,
        paymentDetails,
        scholarshipType,
        paymentTotal,
      };

      const res = await fetch('/api/send-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get('Content-Type') || '';
      const dispo = res.headers.get('Content-Disposition') || '';
      const filenameMatch = dispo.match(/filename\*?=(?:UTF-8'')?("?)([^";]+)\1/i);
      const streamedFilename = filenameMatch ? decodeURIComponent(filenameMatch[2]) : 'document.pdf';

      // A) Server streamed the PDF directly
      if (res.ok && ct.includes('application/pdf')) {
        openToast('Formular trimis', 'Ordinul de plată se descarcă acum.');
        const blob = await res.blob();
        setTimeout(() => triggerDownloadFromBlob(blob, streamedFilename), 0);
        return;
      }

      // B) Server responded JSON
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || 'Eroare la trimiterea formularului.');
      }

      openToast('Formular trimis', 'Ordinul de plată se descarcă acum.');

      // 1) Direct URL
      if (json?.pdfFile?.url) {
        const fname = json?.pdfFile?.filename;
        setTimeout(() => triggerDownloadFromUrl(json.pdfFile.url, fname), 0);
        return;
      }

      // 2) Base64
      const b64 = json?.pdfFile?.base64 || json?.pdfBase64;
      if (b64) {
        const fname = json?.pdfFile?.filename || 'document.pdf';
        const blob = b64ToBlob(b64, 'application/pdf');
        setTimeout(() => triggerDownloadFromBlob(blob, fname), 0);
        return;
      }

      // 3) Raw bytes
      const bytes = json?.pdfFile?.bytes;
      if (bytes && Array.isArray(bytes)) {
        const fname = json?.pdfFile?.filename || 'document.pdf';
        const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
        setTimeout(() => triggerDownloadFromBlob(blob, fname), 0);
        return;
      }

      // Nothing to download
      openToast('Trimis fără fișier', 'Nu am primit un PDF de la server.', 'error');
    } catch (e: any) {
      const msg = e?.message ?? 'A apărut o problemă.';
      setError(msg);
      openToast('Eroare la trimitere', msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-5 mt-4 text-center space-y-4">
        <div className="flex items-start gap-3 justify-center">
          <Checkbox
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(!!checked)}
            id="gdpr"
          />
          <label htmlFor="gdpr" className="text-sm text-left">
            Sunt de acord cu prelucrarea datelor personale conform politicii de confidențialitate a universității.
          </label>
        </div>

        <Button
          disabled={!isFormValid || submitting}
          onClick={handleSubmit}
          size="3"
          className={`mt-4 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitting ? 'Se trimite…' : 'Trimite formularul'}
        </Button>

        <div className="flex flex-col items-center gap-2 justify-center mt-4">
          {!isFormValid && (
            <Text size="2" color="gray">
              Completează toate câmpurile și acordul GDPR pentru a trimite.
            </Text>
          )}
          {error && (
            <Text size="2" color="red">
              {error}
            </Text>
          )}
        </div>
      </div>

      {/* Radix Toast */}
      <Toast.Provider swipeDirection="right" duration={3500}>
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className="relative rounded-lg shadow-md px-4 py-3 bg-[--color-panel]"
        >
          <Toast.Title className={`font-semibold ${toastTone === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {toastTitle}
          </Toast.Title>
          {toastDesc && (
            <Toast.Description className="mt-1 text-sm opacity-90">
              {toastDesc}
            </Toast.Description>
          )}
          <Toast.Close className="absolute top-2 right-3 text-sm opacity-70 hover:opacity-100">
            ✕
          </Toast.Close>
        </Toast.Root>

        <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-[360px] max-w-[90vw] m-0 outline-none" />
      </Toast.Provider>
    </>
  );
}
