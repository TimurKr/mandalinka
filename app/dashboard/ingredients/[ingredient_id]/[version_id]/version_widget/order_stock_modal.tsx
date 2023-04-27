import Alert from '@/components/alert';
import Button from '@/components/button';
import { IngredientVersion } from '@/components/fetching/ingredient_detail';
import { Unit } from '@/components/fetching/units';
import CheckBoxInput from '@/components/form_elements/checkbox';
import DateTimeInput from '@/components/form_elements/date_time';
import NumberInput from '@/components/form_elements/number';
import parseInvalidResponse from '@/components/form_elements/parse_invalid_response';
import SelectInput from '@/components/form_elements/select';
import TextInput from '@/components/form_elements/text';
import { Modal } from 'flowbite-react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import DateTime from 'react-datetime';
import * as Yup from 'yup';

export default function OrderModal({
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    formValues.append('cost', values.cost);
    formValues.append('unit', values.unit.toString());
    formValues.append('description', values.description);
    values.order_date instanceof Date
      ? formValues.append('order_date', values.order_date.toISOString())
      : formValues.append(
          'order_date',
          new Date(values.order_date).toISOString()
        );
    values.delivery_date instanceof Date
      ? formValues.append('delivery_date', values.delivery_date.toISOString())
      : formValues.append(
          'delivery_date',
          new Date(values.delivery_date).toISOString()
        );
    values.expiration_date instanceof Date
      ? formValues.append(
          'expiration_date',
          values.expiration_date.toISOString().split('T')[0]
        )
      : formValues.append(
          'expiration_date',
          new Date(values.expiration_date).toISOString().split('T')[0]
        );
    formValues.append('is_delivered', values.is_delivered);

    await fetch(submit_url, {
      method: 'POST',
      body: formValues,
    })
      .then((response) => {
        parseInvalidResponse(response, setFieldError, setErrorMessage, true);
      })
      .catch((error) => setErrorMessage(error.message));
  }

  return (
    <Modal dismissible={true} show={show} onClose={onClose} size="md">
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
          initialValues={{
            amount: 1,
            unit: ingredientVersion.unit.id,
            order_date: new Date(),
            delivery_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            expiration_date: new Date(
              new Date().getTime() +
                (1 + ingredientVersion.expiration_period) * 24 * 60 * 60 * 1000
            ),
            is_delivered: false,
            description: '',
            cost: 0,
          }}
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            amount: Yup.number()
              .required('Povinné pole')
              .moreThan(0, 'Množstvo musí byť kladné'),
            unit: Yup.number().required('Povinné pole'),
            cost: Yup.number().min(0, 'Zadajte kladné číslo'),
            order_date: Yup.date().required('Required'),
            delivery_date: Yup.date()
              .required('Povinné pole')
              .min(
                Yup.ref('order_date'),
                'Dátum dodania musí byť neskôr ako dátum objednania'
              ),
            expiration_date: Yup.date()
              .required('Povinné pole')
              .min(
                Yup.ref('delivery_date'),
                'Dátum expirácie musí byť neskôr ako dátum dodania'
              ),
            is_delivered: Yup.boolean(),
            description: Yup.string(),
          })}
        >
          {(props) => (
            <Form className="flex flex-wrap items-center gap-2">
              <div className="flex-auto">
                <NumberInput name="amount" label="Množstvo" />
              </div>
              <div className="flex-auto">
                <SelectInput
                  name="unit"
                  label="Jednotka"
                  options={units.map((unit) => ({
                    value: unit.id,
                    label: unit.name,
                  }))}
                />
              </div>
              <div className="flex-auto">
                <NumberInput name="cost" label="Cena" />
              </div>
              <div className="flex-auto">
                <DateTimeInput
                  name="order_date"
                  label="Dátum objednania"
                  time
                />
              </div>
              <div className="flex-auto">
                <DateTimeInput
                  name="delivery_date"
                  time
                  label={`${
                    !props.getFieldMeta('is_delivered').value
                      ? 'Predpokladaný d'
                      : 'D'
                  }átum dodania`}
                />
              </div>
              <div className="flex-auto shrink-0">
                <CheckBoxInput name="is_delivered" label="Dodané" />
              </div>
              <div className="flex-auto">
                <DateTimeInput name="expiration_date" label="Dátum expirácie" />
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
                  Vytvoriť objednávku
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
