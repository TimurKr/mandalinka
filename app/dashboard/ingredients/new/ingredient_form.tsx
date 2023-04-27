'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useClientSupabase } from '@/lib/auth/client-supabase-provider';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import type { InsertIngredient } from '@/lib/database.types';

import Alert from '@/lib/ui/alert';
import Button from '@/lib/ui/button';
import {
  TextArea,
  TextInput,
  FileInput,
  Option,
  SelectInput,
  SelectMultipleInput,
} from '@/lib/forms/inputs';

type FormValues = {
  name: string;
  extra_info?: string;
  search_tags?: string;
  img: File | '';
  alergens: string[];
  unit: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Povinné pole'),
  extra_info: Yup.object().json(),
  search_tags: Yup.string(),
  img: Yup.mixed(),
  alergens: Yup.array().of(Yup.string()),
  unit: Yup.string().required('Povinné pole'),
});

export default function AddIngredientForm({
  alergens,
  units,
}: {
  alergens: Option[];
  units: Option[];
}) {
  const [error, setError] = useState<string | null>(null);
  const supabase = useClientSupabase();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const bucket = 'ingredients';

      const { name, extra_info, search_tags, img, alergens, unit } = values;

      let path: string | null = null;

      const { data: ingredient, error } = await supabase
        .from('ingredient')
        .insert({
          name: name,
          extra_info: extra_info,
          search_tags: search_tags
            ?.split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ''),
          unit: unit,
        })
        .select('id, name')
        .maybeSingle();

      if (error || !ingredient) {
        console.error('Error inserting ingredient: ', error);
        setError(error?.message || 'Nevrátilo sa žiadne ID ani chyba.');
        return;
      }

      const { data: alergensData, error: alergensError } = await supabase
        .from('ingredient_alergen')
        .insert(
          alergens.map((alergen) => ({
            ingredient: ingredient.id,
            alergen: parseInt(alergen),
          }))
        );

      if (alergensError) {
        console.error('Error inserting alergens: ', alergensError);
        setError(alergensError.message);
        return;
      }

      if (img) {
        path = `${ingredient.name
          .trim()
          .toLowerCase()
          .replace(/ /g, '_')
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')}/thumbnail`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(path, img, {
            upsert: true,
          });
        if (error) {
          console.error('Error uploading img: ', error);
          setError(error.message);
          return;
        }
        path = data.path;

        const { error: updateError } = await supabase
          .from('ingredient')
          .update({ img: path })
          .eq('id', ingredient.id);

        if (updateError) {
          console.error('Error updating ingredient: ', updateError);
          setError(updateError?.message || 'Nevrátilo sa žiadne ID ani chyba.');
          return;
        }
      }
      router.push(`/dashboard/ingredients/${ingredient.id}`);
    },
    [router, supabase]
  );

  const initialValues: FormValues = {
    name: '',
    extra_info: '',
    search_tags: '',
    img: '',
    alergens: [],
    unit: units[0].value.toString(),
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className="w-96">
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
        <TextInput name="name" label="Názov" />
        <TextArea
          name="extra_info"
          label="Extra informácie"
          helperText="Zadajte dáta vo formáte JSON"
        />
        <FileInput name="img" label="Obrázok" />

        <SelectInput name="unit" label="Jednotka" options={units} />
        <SelectMultipleInput
          name="alergens"
          label="Alergény"
          options={alergens}
          helperText="Zvolte všetky aplikovatelné"
        />

        <TextInput
          name="search_tags"
          label="Hľadané tagy"
          helperText="Oddelujte čiarkou"
        />
        <Button variant="primary" type="submit">
          Vytvoriť
        </Button>
      </Form>
    </Formik>
  );
}
