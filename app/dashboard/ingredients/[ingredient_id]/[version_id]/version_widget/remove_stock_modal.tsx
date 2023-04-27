import Alert from '@/components/alert';
import Button from '@/components/button';
import { IngredientVersion } from '@/components/fetching/ingredient_detail';
import { Unit } from '@/components/fetching/units';
import DateTimeInput from '@/components/form_elements/date_time';
import NumberInput from '@/components/form_elements/number';
import parseInvalidResponse from '@/components/form_elements/parse_invalid_response';
import SelectInput from '@/components/form_elements/select';
import TextInput from '@/components/form_elements/text';
import { Modal } from 'flowbite-react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

export default function RemoveModal({
  show,
  units,
  onClose,
  ingredientVersion,
  submit_url,
  router,
}: {
  show: boolean;
  units: Unit[];
  onClose: () => void;
  ingredientVersion: IngredientVersion;
  submit_url: string;
  router: ReturnType<typeof useRouter>;
}) {
  const [all, setAll] = useState(false);
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
    const formValues = new FormData();
    formValues.append('ingredient_version', ingredientVersion.id.toString());
    formValues.append('amount', values.amount);
    formValues.append('unit', values.unit.toString());
    values.order_date instanceof Date
      ? formValues.append('date', values.date.toISOString())
      : formValues.append('date', new Date(values.date).toISOString());
    formValues.append('reason', values.reason);
    formValues.append('description', values.description);

    const response = await fetch(submit_url, {
      method: 'POST',
      body: formValues,
    }).then((response) => {
      parseInvalidResponse(response, setFieldError, setErrorMessage, true);
    });
  }

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
            unit: ingredientVersion.unit.id,
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
            unit: Yup.number().required('Required'),
            // Date must be today or in the past
            date: Yup.date()
              .required('Required')
              .max(
                new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                'Nemôžete nastaviť dátum na viac ako 24 hod v budúcnosti.'
              ),
            reason: Yup.string().required('Required'),
            description: Yup.string().when('reason', {
              is: 'other',
              then: () => Yup.string().required('Required'),
            }),
          })}
        >
          {(props) => (
            <Form className="flex flex-wrap items-center gap-2">
              <div className="flex-auto">
                <NumberInput name="amount" label="Množstvo" disabled={all} />
              </div>
              <div className="flex-auto">
                <SelectInput
                  name="unit"
                  label="Jednotka"
                  options={units.map((unit) => ({
                    value: unit.id,
                    label: unit.name,
                  }))}
                  disabled={all}
                />
              </div>
              <div className="flex flex-auto items-center">
                <input
                  id="all-checkbox"
                  type="checkbox"
                  className="rounded text-primary focus:outline-primary focus:ring-primary"
                  onChange={(event) => {
                    setAll(event.target.checked);
                    props.setFieldValue(
                      'amount',
                      ingredientVersion.in_stock_amount
                    );
                    props.setFieldValue('unit', ingredientVersion.unit.id);
                  }}
                />
                <label
                  htmlFor="all-checkbox"
                  className="px-2 text-sm text-gray-700"
                >
                  Všetko na sklade
                </label>
              </div>
              <div className="flex-auto">
                <DateTimeInput name="date" label="Dátum a čas" time />
              </div>
              <div className="flex-auto shrink-0">
                <SelectInput
                  name="reason"
                  label="Zadajte dôvod"
                  options={[
                    { value: 'expired', label: 'Expirovalo' },
                    { value: 'went_bad', label: 'Pokazilo sa pred expiráciou' },
                    { value: 'other', label: 'Iné' },
                  ]}
                />
              </div>
              <div className="flex-auto shrink-0">
                <TextInput name="description" label="Poznámka" />
              </div>
              <div className="flex-auto">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={props.isSubmitting}
                >
                  Odobrať
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
