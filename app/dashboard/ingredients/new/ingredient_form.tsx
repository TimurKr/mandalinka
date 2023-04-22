'use client';

import { Option } from '@/lib/forms/select';
import Alert from '@/lib/ui/alert';
import { useState, useCallback } from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import SelectMultipleField from '@/lib/forms/select_multiple';
import Button from '@/lib/ui/button';
import { Label, TextInput, FileInput, Select } from 'flowbite-react';

interface FormValues {
  name: string;
  extra_info: string;
  img: File | null;
  alergens: string[];
  unit: string;
}

export default function AddIngredientForm({
  alergens,
  units,
}: {
  alergens: Option[];
  units: Option[];
}) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback((values: any, actions: any) => {
    console.log(values);
  }, []);

  const initialValues: FormValues = {
    name: '',
    extra_info: '',
    img: null,
    alergens: [],
    unit: '',
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form>
          <div className="p-1">
            <Label htmlFor="name">Názov</Label>
            <Field name="name" as={TextInput} />
            <ErrorMessage name="name" />
          </div>
          <div className="p-1">
            <Label htmlFor="extra_info">Extra info</Label>
            <Field
              name="extra_info"
              as={TextInput}
              helperText="Zadajte dáta vo fomráte JSON"
            />
            <ErrorMessage name="extra_info" />
          </div>
          <div className="p-1">
            <Label htmlFor="img">Obrázok</Label>
            <Field name="img" as={FileInput} />
            <ErrorMessage name="img" />
          </div>
          <div className="p-1">
            <Label htmlFor="unit">Jednotka</Label>
            <Field name="unit" as={Select}>
              {units.map((unit) => (
                <option value={unit.value} key={unit.value}>
                  {unit.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="unit" />
          </div>
          <div className="p-1">
            <SelectMultipleField
              name="alergens"
              label="Alergény"
              options={alergens}
            />
            <ErrorMessage name="alergens" />
          </div>
          <div className="p-1">
            <Button variant="primary" type="submit">
              Vytvoriť
            </Button>
          </div>
        </Form>
      </Formik>
      <Alert variant="danger">{error}</Alert>
    </>
  );
}
