import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import {
  IngredientVersion,
  IngredientVersionRemoval,
  InsertIngredientVersionRemoval,
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

export default function RemoveModal({
  show,
  units,
  onClose,
  ingredientVersion,
}: {
  show: boolean;
  units: Pick<Unit, 'sign' | 'name' | 'property'>[];
  onClose: () => void;
  ingredientVersion: Pick<IngredientVersion, 'id' | 'in_stock'> & {
    unit: Pick<Unit, 'sign' | 'property'>;
  };
}) {
  const [removeAll, setRemoveAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    values: any,
    {
      setFieldError,
    }: {
      setFieldError: (field: string, errorMsg: string) => void;
    }
  ) {
    // const formValues = new FormData();
    // formValues.append('ingredient_version', ingredientVersion.id.toString());
    // formValues.append('amount', values.amount);
    // formValues.append('unit', values.unit.toString());
    // values.order_date instanceof Date
    //   ? formValues.append('date', values.date.toISOString())
    //   : formValues.append('date', new Date(values.date).toISOString());
    // formValues.append('reason', values.reason);
    // formValues.append('description', values.description);
    // const response = await fetch(submit_url, {
    //   method: 'POST',
    //   body: formValues,
    // }).then((response) => {
    //   parseInvalidResponse(response, setFieldError, setErrorMessage, true);
    // });
  }

  // TODO: Make this a one-liner perhaps extend-better-supabase types to export enums as well
  type Reason = {
    temp: IngredientVersionRemoval['reason'];
  };

  let reasons = Object.freeze<string[]>(
    Object.values<Reason['temp']>({} as Reason)
  );

  const initialValues = {
    ingredient_version: ingredientVersion.id,
    amount: undefined as unknown as number,
    unit: ingredientVersion.unit.sign,
    date: new Date(),
    reason: 'expired' as IngredientVersionRemoval['reason'],
    description: undefined,
    all: false,
  } as InsertIngredientVersionRemoval;

  return (
    <Modal dismissible={true} show={show} onClose={onClose} size="md">
      <Modal.Header>Odoberte zo skladu</Modal.Header>
      <Modal.Body>
        <Alert
          variant="danger"
          className="!mb-3"
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
        <Formik
          initialValues={{
            amount: 0,
            unit: ingredientVersion.unit.sign,
            date: new Date(),
            reason: '',
            description: '',
            all: false,
          }}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            amount: Yup.number()
              .required('Required')
              .min(0, 'Zadajte kladné číslo'),
            unit: Yup.string().required('Required'),
            // Date must be today or in the past
            date: Yup.date()
              .required('Required')
              .max(
                new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                'Nemôžete nastaviť dátum na viac ako 24 hod v budúcnosti.'
              ),
            reason:
              Yup.mixed<InsertIngredientVersionRemoval['reason']>().required(
                'Required'
              ),
            description: Yup.string().when('reason', {
              is: 'other',
              then: () => Yup.string().required('Required'),
            }),
          })}
        >
          {(props) => (
            <Form className="">
              <NumberInput
                name="amount"
                label="Množstvo"
                disabled={removeAll}
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
                disabled={removeAll}
              />
              <div className="flex flex-auto items-center gap-2 px-2">
                <Checkbox
                  id="all-checkbox "
                  className=""
                  // checked={removeAll}
                  onChange={(event) => {
                    setRemoveAll(event.target.checked);
                    props.setFieldValue(
                      'amount',
                      event.target.checked
                        ? ingredientVersion.in_stock
                        : props.initialValues.amount
                    );
                    props.setFieldValue('unit', ingredientVersion.unit);
                  }}
                />
                <Label htmlFor="all-checkbox">Všetko na sklade</Label>
              </div>
              <DateTimeInput name="date" label="Dátum a čas" time />
              <SelectInput
                name="reason"
                label="Zadajte dôvod"
                options={reasons.map((reason) => ({
                  value: reason,
                  label: reason,
                }))}
              />
              <TextInput name="description" label="Poznámka" />
              <Button
                className="mt-4"
                type="submit"
                variant="primary"
                disabled={props.isSubmitting}
              >
                Odobrať
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
