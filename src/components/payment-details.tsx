'use client';

import React, {useEffect} from 'react';
import {Heading, Select, Text, TextField} from '@radix-ui/themes';
import * as Label from '@radix-ui/react-label';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '@/lib/redux/store';
import {recomputeTarif, setPaymentField, setTipPlata} from '@/lib/redux/features/paymentDetailsSlice';

export default function PaymentDetails() {
  const dispatch = useDispatch();
  const forma = useSelector((s: RootState) => s.academicData.forma);
  const program = useSelector((s: RootState) => s.academicData.program);
  const specializare = useSelector((s: RootState) => s.academicData.specializare);

  const {tipPlata, numeCurs, semestru, numarCredite, tarifCurs, errors} = useSelector(
    (s: RootState) => s.paymentDetails
  );

  useEffect(() => {
    const refacereVisible =
      forma === 'Buget' || (forma === 'Taxă' && tipPlata === 'Plată refacere curs');

    if (refacereVisible) {
      dispatch(recomputeTarif({ program, specializare }) as any);
    }
  }, [dispatch, forma, tipPlata, program, specializare, numarCredite]);

  return (
    <div className="mt-4">
      {forma === 'Taxă' && (
        <div className="mt-4">
          <Heading size="5" className="mb-3 tracking-tight">
            Detalii plată
          </Heading>

          {/* Tip plată */}
          <div className="mb-5 mt-4">
            <Label.Root className="block mb-2 text-sm font-medium">Tip plată</Label.Root>
            <Select.Root value={tipPlata} onValueChange={(v) => dispatch(setTipPlata(v as any))}>
              <Select.Trigger placeholder="Alegeți tipul plății" className="w-full"/>
              <Select.Content>
                <Select.Item value="Plată taxă școlarizare">Plată taxă școlarizare</Select.Item>
                <Select.Item value="Plată refacere curs">Plată refacere curs</Select.Item>
              </Select.Content>
            </Select.Root>
            <Text size="2" className="text-gray-400 block mt-1">
              Alegeți tipul plății.
            </Text>
            {errors.tipPlata && (
              <Text size="2" color="red" className="block mt-1">
                {errors.tipPlata}
              </Text>
            )}
          </div>
        </div>
      )}


      {/* Subsecțiune: Plată refacere curs */}
      {(forma === 'Buget' || (forma === 'Taxă' && tipPlata === 'Plată refacere curs')) && (
        <div className="mt-4">
          <Heading size="5" className="mb-3 tracking-tight">
            Plată refacere curs</Heading>

          {/* Nume curs */}
          <div className="mb-5 mt-4">
            <Label.Root className="block mb-2 text-sm font-medium">Nume curs</Label.Root>
            <TextField.Root
              className="w-full"
              placeholder="ex: Algoritmi și Structuri de Date"
              value={numeCurs}
              onChange={(e) => dispatch(setPaymentField({field: 'numeCurs', value: e.target.value}))}
              aria-invalid={!!errors.numeCurs}
            />
            <Text size="2" className="text-gray-400 block mt-1">Introduceți denumirea completă a cursului.</Text>
            {errors.numeCurs && <Text size="2" color="red" className="block mt-1">{errors.numeCurs}</Text>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-4">
            {/* Semestru */}
            <div className="mb-5">
              <Label.Root className="block mb-2 text-sm font-medium">Semestru</Label.Root>
              <Select.Root
                value={semestru}
                onValueChange={(v) => dispatch(setPaymentField({field: 'semestru', value: v}))}
              >
                <Select.Trigger placeholder="Selectați semestrul" className="w-full"/>
                <Select.Content>
                  <Select.Item value="1">Semestrul 1</Select.Item>
                  <Select.Item value="2">Semestrul 2</Select.Item>
                </Select.Content>
              </Select.Root>
              <Text size="2" className="text-gray-400 block mt-1">Semestrul în care se reface cursul.</Text>
              {errors.semestru && <Text size="2" color="red" className="block mt-1">{errors.semestru}</Text>}
            </div>

            {/* Număr credite */}
            <div className="mb-5">
              <Label.Root className="block mb-2 text-sm font-medium">Număr credite</Label.Root>
              <TextField.Root
                className="w-full"
                placeholder="ex: 5"
                type="number"
                inputMode="numeric"
                value={numarCredite}
                onChange={(e) => dispatch(setPaymentField({field: 'numarCredite', value: e.target.value}))}
                aria-invalid={!!errors.numarCredite}
              />
              <Text size="2" className="text-gray-400 block mt-1">
                De regulă între 3 și 6, conform fișei disciplinei.
              </Text>
              {errors.numarCredite && <Text size="2" color="red" className="block mt-1">{errors.numarCredite}</Text>}
            </div>

            {/* Tarif curs (calcul automat) */}
            <div className="mb-5">
              <Label.Root className="block mb-2 text-sm font-medium">Tarif curs (calcul automat)</Label.Root>
              <TextField.Root
                className="w-full"
                type="number"
                readOnly
                value={tarifCurs.toString()}
                aria-readonly
              />
              <Text size="2" className="text-gray-400 block mt-1">
                Se calculează automat în funcție de program, specializare și numărul de credite.
              </Text>
            </div>
          </div>

          {/* Text informativ */}
          <div className="rounded-md p-3 border border-dashed">
            <Text size="2">
              <strong>Tariful cursului este determinat automat:</strong><br/>
              <em>Licență</em> – 120 lei/credit<br/>
              <em>Master</em> – 150 lei/credit<br/>
              <em>Doctorat</em> – 200 lei/credit
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}