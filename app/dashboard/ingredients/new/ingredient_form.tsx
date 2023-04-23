'use client';

import { Option } from '@/lib/forms/select_multiple';
import Alert from '@/lib/ui/alert';
import { useState, useCallback } from 'react';

import { Formik, Form, Field } from 'formik';
import SelectMultipleField from '@/lib/forms/select_multiple';
import FileInput from '@/lib/forms/file';
import ErrorMessage from '@/lib/forms/error_message';
import Button from '@/lib/ui/button';
import { Label, TextInput, Select, Textarea } from 'flowbite-react';
import * as Yup from 'yup';
import { useClientSupabase } from '@/lib/auth/client-supabase-provider';

interface FormValues {
  name: string;
  extra_info?: string;
  search_tags?: string;
  img: File | '';
  alergens: string[];
  unit: string;
}

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

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const bucket = 'ingredients';

      const { name, extra_info, search_tags, img, alergens, unit } = values;

      let path: string | null = null;

      const { data: ingredient, error } = await supabase
        .from('ingredients')
        .insert(
          {
            name: name,
            extra_info: extra_info,
            search_tags: search_tags?.split(',').map((tag) => tag.trim()).filter((tag) => tag !== ''),
            unit: parseInt(unit),
          },
        ).select('id, name')
        .maybeSingle();

      if (error || !ingredient) {
        console.error('Error inserting ingredient: ', error);
        setError(error?.message || "Nevrátilo sa žiadne ID ani chyba.");
        return;
      }

      const { data: alergensData, error: alergensError } = await supabase
        .from('M2M_ingredients_alergens')
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
        path = `${ingredient.name.trim().toLowerCase().replace(/ /g, '_').normalize("NFD").replace(/\p{Diacritic}/gu, "")}/thumbnail`;

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
          .from('ingredients')
          .update({ img: path })
          .eq('id', ingredient.id);

        if (updateError) {
          console.error('Error updating ingredient: ', updateError);
          setError(updateError?.message || "Nevrátilo sa žiadne ID ani chyba.");
          return;
        }
      }
    },
    [supabase]
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
        <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>
        <div className="p-1">
          <Label htmlFor="name">Názov</Label>
          <Field name="name" as={TextInput} />
          <ErrorMessage name="name" />
        </div>
        <div className="p-1">
          <Label htmlFor="extra_info">Extra info</Label>
          <Field
            name="extra_info"
            as={Textarea}
            helperText="Zadajte dáta vo fomráte JSON"
          />
          <ErrorMessage name="extra_info" />
        </div>
        <div className="p-1">
          <Label htmlFor="img">Obrázok</Label>
          <FileInput name="img" />
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
        <div className="p-1 py-2">
          <Label htmlFor="alergens">Alergény</Label>
          <SelectMultipleField
            name="alergens"
            options={alergens}
            helperText="Zvolte všetky aplikovatelné"
          />
          <ErrorMessage name="alergens" />
        </div>
        <div className="p-1">
          <Label htmlFor="search_tags">Hľadané tagy</Label>
          <Field
            name="search_tags"
            as={TextInput}
            helperText="Oddelujte čiarkou"
          />
          <ErrorMessage name="search_tags" />
        </div>
        <div className="p-1">
          <Button variant="primary" type="submit">
            Vytvoriť
          </Button>
        </div>
      </Form>
    </Formik>
  );
}
