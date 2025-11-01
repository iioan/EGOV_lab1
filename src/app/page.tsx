'use client';

import { Heading, Text } from "@radix-ui/themes";
import { TextField } from "@radix-ui/themes";
import { Navbar } from "@/components/navbar";
import StudentIdentity from "@/components/student-identity";
import AcademicData from "@/components/academic-data";
import { useSelector, useDispatch } from "react-redux";
import { setText } from "@/lib/redux/features/textSlice";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function Home() {
  const textValue = useSelector((state: any) => state.text.value);
  const dispatch = useDispatch();

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-6xl px-12 py-12">
        <section className="mb-10">
          <div className="items-center text-center mb-6">
            <Heading size="9" className="md:text-3xl">
              Formular taxe universitare
            </Heading>
          </div>
          <div className="mt-6 mb-10">
            <Text size="5" className="md:text-lg">
              Vă rugăm să completați formularul de mai jos pentru a procesa taxele universitare.
            </Text>
          </div>

          <TextField.Root
            placeholder="Introduceți numele dvs."
            value={textValue}
            onChange={(e) => dispatch(setText(e.target.value))}
            className="w-full mb-6"
            size="3"
          />

          <Text>Valoare introdusă: {textValue || "—"}</Text>

          <TextField.Root placeholder="Search the docs…">
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>


          <StudentIdentity />
          <AcademicData />
        </section>
      </main>
    </>
  );
}
