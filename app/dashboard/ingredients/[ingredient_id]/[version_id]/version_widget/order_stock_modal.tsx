import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import {
  IngredientVersion,
  IngredientVersionOrder,
  InsertIngredientVersionOrder,
  Unit,
} from '@/utils/db.types';

import Alert from '@/lib/ui/alert';
import Button from '@/lib/ui/button';
import { Checkbox, Label, Modal } from 'flowbite-react';
import {
  DateTimeInput,
  NumberInput,
  SelectInput,
  TextInput,
} from '@/lib/forms';
import { useSupabase } from '@/utils/supabase/client';
import { CurrencyEuroIcon } from '@heroicons/react/24/outline';

export default function OrderModal({
  show,
  units,
  onClose,
  ingredientVersion,
}: {
  show: boolean;
  units: Pick<Unit, 'sign' | 'name' | 'property'>[];
  onClose: () => void;
  ingredientVersion: Pick<IngredientVersion, 'id' | 'expiration_period'> & {
    unit: Pick<Unit, 'sign' | 'property'>;
  };
}) {
  const supabase = useSupabase();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(
    values: InsertIngredientVersionOrder,
    {
      setFieldError,
    }: {
      setFieldError: (field: string, errorMsg: string) => void;
    }
  ) {
    if (values.status === 'delivered') {
      values.in_stock = values.amount;
    }

    const { error: insertError } = await supabase
      .from('ingredient_version_order')
      .insert(values);

    if (insertError) {
      setErrorMessage(insertError.message);
      return;
    }

    if (values.status === 'delivered') {
      values.in_stock = values.amount;

      const { error: updateError } = await supabase.rpc(
        'update_ingredient_version_in_stock',
        {
          ingredient_version_id: values.ingredient_version,
        }
      );

      if (updateError) {
        setErrorMessage(updateError.message);
        return;
      }
    }

    startTransition(() => {
      setErrorMessage(null);
      onClose();
      router.refresh();
    });
  }

  const initialValues = {
    ingredient_version: ingredientVersion.id,
    amount: undefined as unknown as number,
    unit: ingredientVersion.unit.sign,
    cost: undefined as unknown as number,
    ordered_at: new Date().toISOString(),
    delivery_at: new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000
    ).toISOString(),
    expires_at: new Date(
      new Date().getTime() +
        (1 + ingredientVersion.expiration_period) * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: 'awaiting_order',
    in_stock: undefined,
  } as InsertIngredientVersionOrder;

  return (
    <Modal dismissible={true} show={show} onClose={onClose} size="lg">
      <Modal.Header>Zadajte objednávku</Modal.Header>
      <Modal.Body>
        <Alert
          className="!mb-3"
          onClose={() => setErrorMessage(null)}
          variant="danger"
        >
          {errorMessage}
        </Alert>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            amount: Yup.number()
              .required('Povinné pole')
              .moreThan(0, 'Množstvo musí byť kladné'),
            unit: Yup.string().required('Povinné pole'),
            cost: Yup.number()
              .required('Povinné pole')
              .min(0, 'Zadajte kladné číslo'),
            ordered_at: Yup.date().required('Povinne pole'),
            delivery_at: Yup.date()
              .min(
                Yup.ref('ordered_at'),
                'Dátum dodania musí byť neskôr ako dátum objednania'
              )
              .required('Povinne pole'),
            expires_at: Yup.date()
              .min(
                Yup.ref('delivery_at'),
                'Dátum expirácie musí byť neskôr ako dátum dodania'
              )
              .required('Povinne pole'),
            status: Yup.mixed<IngredientVersionOrder['status']>()
              .required('Povinné pole')
              .oneOf(['awaiting_order', 'ordered', 'delivered']),
            extra_info: Yup.object().json(),
          })}
        >
          {(props) => (
            <Form>
              <NumberInput
                name="amount"
                label="Množstvo"
                placeholder="Zadajte množstvo"
              />
              <SelectInput
                name="unit"
                label="Jednotka"
                options={units
                  .filter(
                    (unit) => unit.property === ingredientVersion.unit.property
                  )
                  .map((unit) => ({
                    value: unit.sign,
                    label: unit.name,
                  }))}
              />
              <NumberInput name="cost" label="Cena" icon={CurrencyEuroIcon} />
              <SelectInput
                name="status"
                label="Stav"
                options={[
                  { value: 'awaiting_order', label: 'Čaká na objednanie' },
                  { value: 'ordered', label: 'Objednané' },
                  { value: 'delivered', label: 'Doručené' },
                ]}
              />
              <DateTimeInput name="ordered_at" label="Dátum objednania" time />
              <DateTimeInput name="delivery_at" time label="Dátum dodania" />
              <DateTimeInput name="expires_at" label="Dátum expirácie" />
              <TextInput
                name="extra_info"
                label="Poznámka"
                helperText="Zadajte dáta vo formáte JSON"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={props.isSubmitting}
              >
                Vytvoriť objednávku
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
