'use client';

import React, { ComponentProps } from 'react';
import {Heading, Text, TextField} from '@radix-ui/themes';
import * as Label from '@radix-ui/react-label';
import {useDispatch, useSelector} from 'react-redux';
import {setField} from '@/lib/redux/features/studentIdentitySlice';
import type {RootState} from '@/lib/redux/store';

type RadixTextFieldType = ComponentProps<typeof TextField.Root>['type'];
type RadixInputMode = ComponentProps<typeof TextField.Root>['inputMode'];

const FieldRow: React.FC<{
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
  error?: string;
  type?: RadixTextFieldType;
  inputMode?: RadixInputMode;
}> = ({
        label,
        placeholder,
        value,
        onChange,
        help,
        error,
        type = 'text',
        inputMode,
      }) => (
  <div className="mb-5">
    <Label.Root className="block mb-2 text-sm font-medium">{label}</Label.Root>

    <TextField.Root
      className="w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      inputMode={inputMode}
      aria-invalid={!!error}
      aria-describedby={help ? `${label}-help` : undefined}
    />

    {help && (
      <Text id={`${label}-help`} size="2" className="text-gray-400 block mt-1">
        {help}
      </Text>
    )}
    {error && (
      <Text size="2" color="red" className="block mt-1">
        {error}
      </Text>
    )}
  </div>
);

export default function StudentIdentity() {
  const dispatch = useDispatch();
  const state = useSelector((s: RootState) => s.studentIdentity);

  return (
    <div>
      <Heading size="5" className="mb-3 tracking-tight">
        Date de identificare ale studentului
      </Heading>

      <div className="columns-3 mt-4">
        <FieldRow
          label="Nume"
          placeholder="ex: Popescu"
          value={state.nume}
          onChange={(v) => dispatch(setField({field: 'nume', value: v}))}
          help="Numele de familie al studentului."
        />

        <FieldRow
          label="Prenume"
          placeholder="ex: Ana-Maria"
          value={state.prenume}
          onChange={(v) => dispatch(setField({field: 'prenume', value: v}))}
          help="Prenumele complet (folosiți cratimă dacă este cazul)."
        />
        <FieldRow
          label="Email instituțional"
          placeholder="ex: ana.popescu@student.univ.ro"
          value={state.emailInstitutional}
          onChange={(v) =>
            dispatch(setField({field: 'emailInstitutional', value: v}))
          }
          help="Folosiți adresa instituțională (@univ.ro sau @student.univ.ro)."
          error={state.errors.emailInstitutional}
          type="email"
        />

      </div>

      <div className="columns-3 mt-4">

        <FieldRow
          label="CNP"
          placeholder="ex: 1990101123456"
          value={state.cnp}
          onChange={(v) => dispatch(setField({field: 'cnp', value: v}))}
          help="Introduceți CNP-ul (13 cifre)."
          error={state.errors.cnp}
          inputMode="numeric"
          type="text"
        />
        <FieldRow
          label="Cod student / Matricol"
          placeholder="ex: AC-23-00125"
          value={state.codStudent}
          onChange={(v) => dispatch(setField({field: 'codStudent', value: v}))}
          help="Format: LL-CC-CCC; 5–20 caractere (A–Z, 0–9, -, _)."
          error={state.errors.codStudent}
        />
        <FieldRow
          label="Telefon (opțional)"
          placeholder="ex: 07xx xxx xxx"
          value={state.telefon}
          onChange={(v) => dispatch(setField({field: 'telefon', value: v}))}
          help="Număr de contact (opțional)."
          inputMode="tel"
          type="tel"
        />
      </div>
    </div>
  );
}
