'use client';
import {useSelector} from 'react-redux';
import {RootState} from '@/lib/redux/store';
import {useState} from 'react';
import {Button, Checkbox, Text} from '@radix-ui/themes';

export default function FormSubmit() {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Grab all needed slices
  const studentIdentity = useSelector((s: RootState) => s.studentIdentity);
  const academicData = useSelector((s: RootState) => s.academicData);
  const paymentDetails = useSelector((s: RootState) => s.paymentDetails);
  const scholarshipType = useSelector((s: RootState) => s.scholarshipType);
  const paymentTotal = useSelector((s: RootState) => (s as any).paymentTotal);

  // Your existing validity rules
  const isFormValid =
    studentIdentity?.nume &&
    studentIdentity?.prenume &&
    studentIdentity?.cnp &&
    academicData?.program &&
    academicData?.specializare &&
    academicData?.forma &&
    (academicData.forma === 'Buget' || paymentDetails?.tipPlata) &&
    (academicData.forma === 'Buget' || scholarshipType?.scholarshipType) &&
    agreed;

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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || 'Unknown error while sending form.');
      }

      // Download PDF if available
      if (json.pdfFile?.url && json.pdfFile?.filename) {
        const link = document.createElement('a');
        link.href = json.pdfFile.url;
        link.download = json.pdfFile.filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Formular trimis cu succes! Ordinul de plată a fost descărcat.');
      } else {
        alert('Formular trimis cu succes!');
      }

      // TODO: optionally reset your Redux slices here if desired
      // dispatch(resetAll()); — depending on how you've implemented slice resets
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? 'A apărut o problemă.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
  );
}