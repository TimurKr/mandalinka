'use client';

import {
  Database,
  Ingredient,
  InsertIngredientVersion,
} from '@/lib/database.types';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Button from '@/lib/ui/button';
import Alert from '@/lib/ui/alert';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NumberInput, TextInput } from '@/lib/forms/inputs';

type IngredientVersionFormInput = InsertIngredientVersion;

export default function IngredientVersionForm({
  ingredient,
  initial,
}: {
  ingredient: Pick<Ingredient, 'id'>;
  initial: Partial<IngredientVersionFormInput>;
}) {
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(
    values: IngredientVersionFormInput,
    {
      setSubmitting,
      setFieldError,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setFieldError: (field: string, errorMsg: string) => void;
    }
  ) {
    // const formData = new FormData();
    // formData.append('ingredient', ingredient.id.toString());
    // formData.append('source', values.source);
    // formData.append('expiration_period', values.expiration_period.toString());
    // await fetch(submit_url, {
    //   method: method,
    //   body: formData,
    // })
    //   .then((response) =>
    //     parseInvalidResponse(response, setFieldError, setFormError)
    //   )
    //   .then(async (response) => {
    //     if (response.ok) {
    //       let json = await response.json();
    //       window.location.href = `/management/ingredients/${json.ingredient}/${json.id}`;
    //     }
    //   });
  }

  return (
    <Formik
      // set initial values, but the ingredient is set from the ingredient prop
      initialValues={{
        ...initial,
        ingredient: ingredient.id,
        source: initial.source ?? '',
        expiration_period: initial.expiration_period ?? 1,
      }}
      validationSchema={Yup.object({
        source: Yup.string().required('Povinné pole'),
        expiration_period: Yup.number()
          .min(1, 'Musí byť viac ako 1')
          .integer('Zadajte celé číslo')
          .required('Povinné pole'),
      })}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <Form className="flex flex-wrap items-center justify-center gap-2">
          <Alert
            className="w-full"
            variant="danger"
            onClose={() => setFormError(null)}
          >
            {formError}
          </Alert>
          <TextInput name="source" label="Zdroj" />
          <NumberInput
            name="expiration_period"
            label="Priemerná doba trvanlivosti"
          />
          <div className="grid place-content-center">
            <Button
              variant="primary"
              type="submit"
              disabled={props.isSubmitting}
            >
              {props.isSubmitting ? 'Odosielam...' : 'Odoslať'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
