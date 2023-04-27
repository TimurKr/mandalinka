import {
  Label,
  TextInput as RawTextInput,
  Textarea as RawTextArea,
  Select,
} from 'flowbite-react';

import { FileInput as RawFileInput } from './file';

import { Field } from 'formik';
import ErrorMessage from '../error_message';
import SelectMultipleField from './select_multiple';

type Props = {
  name: string;
  label?: string;
  helperText?: string;
};

export function TextInput(props: Props) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <Field
        name={props.name}
        as={RawTextInput}
        helperText={props.helperText}
      />
      <ErrorMessage name={props.name} />
    </div>
  );
}

export function TextArea(props: Props) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <Field name={props.name} as={RawTextArea} helperText={props.helperText} />
      <ErrorMessage name={props.name} />
    </div>
  );
}

export function NumberInput(props: Props) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <Field
        name={props.name}
        as={RawTextInput}
        helperText={props.helperText}
        type="number"
      />
      <ErrorMessage name={props.name} />
    </div>
  );
}

export function FileInput(props: Props) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <RawFileInput name={props.name} />
      <ErrorMessage name={props.name} />
    </div>
  );
}

export type Option = {
  value: string | number;
  label: string;
};

export function SelectInput(props: Props & { options: Option[] }) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <Field name={props.name} as={Select}>
        {props.options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      <ErrorMessage name={props.name} />
    </div>
  );
}

export function SelectMultipleInput(props: Props & { options: Option[] }) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <SelectMultipleField
        name={props.name}
        options={props.options}
        helperText={props.helperText}
      />
      <ErrorMessage name={props.name} />
    </div>
  );
}
