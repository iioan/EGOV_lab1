'use client';

import {Heading, Text} from "@radix-ui/themes";
import {Navbar} from "@/components/navbar";
import StudentIdentity from "@/components/student-identity";
import AcademicData from "@/components/academic-data";
import PaymentDetails from "@/components/payment-details";
import ScholarshipType from "@/components/scholarship-type";

export default function Home() {
  return (
    <>
      <Navbar/>
      <main className="container mx-auto max-w-6xl px-12 py-12">
        <section className="mb-10">
          <div className="items-center text-center mb-6">
            <Heading size="7" className="md:text-2xl">
              Formular taxe universitare
            </Heading>
          </div>
          <div className="mt-6 mb-6">
            <Text size="4" className="md:text-lg">
              Vă rugăm să completați formularul de mai jos pentru a procesa
              taxele universitare. Asigurați-vă că toate informațiile sunt corecte
              înainte de a trimite formularul.
            </Text>
          </div>

          <StudentIdentity/>
          <AcademicData/>
          <PaymentDetails/>
          <ScholarshipType/>
        </section>
      </main>
    </>
  );
}
