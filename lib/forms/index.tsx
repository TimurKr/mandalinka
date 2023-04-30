import {
  Label,
  TextInput as RawTextInput,
  Textarea as RawTextArea,
  Select,
  Checkbox,
} from 'flowbite-react';

import RawFileInput from './file';
import RawSelectMultipleInput from './select_multiple';
import ErrorMessage from './error_message';

import { Field } from 'formik';
import RawDateTimeInput from './date_time';
import { CurrencyBangladeshiIcon, TagIcon } from '@heroicons/react/24/outline';

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  icon?: typeof TagIcon;
  rightIcon?: typeof TagIcon;
};

export function TextInput(props: Props) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <Field
        name={props.name}
        as={RawTextInput}
        helperText={props.helperText}
        disabled={props.disabled}
        placeholder={props.placeholder}
        icon={props.icon}
        rightIcon={props.rightIcon}
      />
      <ErrorMessage name={props.name} />
    </div>
  );
}

export function TextArea(props: Props) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <Field
        name={props.name}
        as={RawTextArea}
        helperText={props.helperText}
        disabled={props.disabled}
        placeholder={props.placeholder}
        icon={props.icon}
        rightIcon={props.rightIcon}
      />
      <ErrorMessage name={props.name} />
    </div>
  );
}

export function CheckBoxInput(props: Props) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <Field
        name={props.name}
        as={Checkbox}
        helperText={props.helperText}
        disabled={props.disabled}
      />
      <ErrorMessage name={props.name} />
    </div>
  );
}

export function NumberInput(props: Props) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <Field
        type="number"
        name={props.name}
        as={RawTextInput}
        helperText={props.helperText}
        disabled={props.disabled}
        placeholder={props.placeholder}
        icon={props.icon}
        rightIcon={props.rightIcon}
      />
      <ErrorMessage name={props.name} />
    </div>
  );
}

export function FileInput(props: Props) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <RawFileInput name={props.name} disabled={props.disabled} />
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
      <Field name={props.name} as={Select} disabled={props.disabled}>
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
      <RawSelectMultipleInput
        name={props.name}
        options={props.options}
        helperText={props.helperText}
        disabled={props.disabled}
      />
      <ErrorMessage name={props.name} />
    </div>
  );
}

export function DateTimeInput(props: Props & { time?: boolean }) {
  return (
    <div className="p-1">
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
      <RawDateTimeInput name={props.name} time={props.time} />
      <ErrorMessage name={props.name} />
    </div>
  );
}
