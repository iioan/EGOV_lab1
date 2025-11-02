'use client';

import React from 'react';
import {Heading, Select, Text, TextField} from '@radix-ui/themes';
import * as Label from '@radix-ui/react-label';
import {useDispatch, useSelector} from 'react-redux';
import {setField, yearsForProgram} from '@/lib/redux/features/academicDataSlice';
import type {RootState} from '@/lib/redux/store';

const Row: React.FC<{ children: React.ReactNode }> = ({children}) => (
  <div className="mb-5">{children}</div>
);

export default function AcademicData() {
  const dispatch = useDispatch();
  const {program, specializare, an, forma, errors} = useSelector(
    (s: RootState) => s.academicData
  );
  const yearOptions = yearsForProgram(program);

  return (
    <div>
      <Heading size="5" className="mb-3 tracking-tight">
        Date academice
      </Heading>

      {/* Program de studii */}
      <div className="mt-4">
        <Row>
          <Label.Root className="block mb-2 text-sm font-medium">Program de studii</Label.Root>
          <Select.Root
            value={program}
            onValueChange={(v) => dispatch(setField({field: 'program', value: v}))}
          >
            <Select.Trigger placeholder="Selectați programul de studii" className="w-full"/>
            <Select.Content>
              <Select.Item value="Licență">Licență</Select.Item>
              <Select.Item value="Master">Master</Select.Item>
              <Select.Item value="Doctorat">Doctorat</Select.Item>
            </Select.Content>
          </Select.Root>
          <Text size="2" className="text-gray-400 block mt-1">
            Selectați ciclul de studii urmat.
          </Text>
          {errors.program && (
            <Text size="2" color="red" className="block mt-1">
              {errors.program}
            </Text>
          )}
        </Row>

        {/* Specializare */}
        <Row>
          <Label.Root className="block mb-2 text-sm font-medium">Specializare</Label.Root>
          <TextField.Root
            className="w-full"
            placeholder="ex: IS / CTI / Sisteme Distribuite"
            value={specializare}
            onChange={(e) => dispatch(setField({field: 'specializare', value: e.target.value}))}
            aria-invalid={!!errors.specializare}
          />
          <Text size="2" className="text-gray-400 block mt-1">
            Introduceți denumirea completă sau abrevierea specializării.
          </Text>
          {errors.specializare && (
            <Text size="2" color="red" className="block mt-1">
              {errors.specializare}
            </Text>
          )}
        </Row>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-4">

          {/* An de studiu (depends on Program) */}
          <Row>
            <Label.Root className="block mb-2 text-sm font-medium">An de studiu</Label.Root>
            <Select.Root
              value={an}
              onValueChange={(v) => dispatch(setField({field: 'an', value: v}))}
              disabled={yearOptions.length === 0}
            >
              <Select.Trigger
                placeholder={
                  yearOptions.length ? 'Selectați anul de studiu' : 'Alegeți mai întâi programul'
                }
                className="w-full"
              />
              <Select.Content>
                {yearOptions.map((y) => (
                  <Select.Item key={y} value={y}>
                    Anul {y}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <Text size="2" className="text-gray-400 block mt-1">
              Alegeți anul curent de studiu.
            </Text>
            {errors.an && (
              <Text size="2" color="red" className="block mt-1">
                {errors.an}
              </Text>
            )}
          </Row>

          {/* Forma de învățământ */}
          <Row>
            <Label.Root className="block mb-2 text-sm font-medium">Forma de învățământ</Label.Root>
            <Select.Root
              value={forma}
              onValueChange={(v) => dispatch(setField({field: 'forma', value: v}))}
            >
              <Select.Trigger placeholder="Selectați forma de învățământ" className="w-full"/>
              <Select.Content>
                <Select.Item value="Buget">Buget</Select.Item>
                <Select.Item value="Taxă">Taxă</Select.Item>
              </Select.Content>
            </Select.Root>
            <Text size="2" className="text-gray-400 block mt-1">
              În funcție de opțiune, vor apărea câmpuri suplimentare.
            </Text>
            {errors.forma && (
              <Text size="2" color="red" className="block mt-1">
                {errors.forma}
              </Text>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
}