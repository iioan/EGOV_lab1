import React from 'react';
import {Heading, Select, Text} from "@radix-ui/themes";
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '@/lib/redux/store';
import * as Label from "@radix-ui/react-label";
import {setScholarshipType} from "@/lib/redux/features/scholarshipTypeSlice";

export default function ScholarshipType() {

  const dispatch = useDispatch();
  const tipPlata = useSelector((s: RootState) => s.paymentDetails.tipPlata);
  const forma = useSelector((s: RootState) => s.academicData.forma);
  const { scholarshipType, errors } = useSelector((s: RootState) => s.scholarshipType);

  const shouldShow = forma === "Taxă" && tipPlata === "Plată taxă școlarizare";
  if (!shouldShow) return null;

  return (
    <div className="mt-6">
      <Heading size="5" className="mb-3 tracking-tight">
        Plată taxă școlarizare
      </Heading>

      <div className="mt-4 mb-5">
        <Label.Root className="block mb-2 text-sm font-medium">Regim plată taxă școlarizare</Label.Root>
        <Select.Root
          value={scholarshipType}
          onValueChange={(v) => dispatch(setScholarshipType(v as any))}
        >
          <Select.Trigger placeholder="Alegeți tipul plății" className="w-max"/>
          <Select.Content>
            <Select.Item value="Semestrial">Semestrial</Select.Item>
            <Select.Item value="Anual">Anual</Select.Item>
          </Select.Content>
        </Select.Root>

        <Text size="2" className="text-gray-400 block mt-1">
          Suma totală pentru plata taxei de școlarizare se va afișa automat în secțiunea „Total plată”, în funcție de programul de studii, specializare și regim ales.
        </Text>
        {errors.scholarshipType && (
          <Text size="2" color="red" className="block mt-1">
            {errors.scholarshipType}
          </Text>
        )}

        <div className="rounded-md p-3 border border-dashed mt-8">
          <Text size="2">
            <strong>Tariful școlarizării este determinat automat:</strong><br/>
            <em>Licență</em> – 4500 lei/semestru<br/>
            <em>Master</em> – 5500 lei/semestru<br/>
            <em>Doctorat</em> – 7500 lei/semestru

          </Text>
        </div>
      </div>
    </div>
  );
}