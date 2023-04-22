import { useField, Field, FieldHookConfig } from 'formik';
import { useEffect } from 'react';
import { isPropertySignature } from 'typescript';
import ErrorMessage from './error_message';

type SelectInputProps = FieldHookConfig<string | number> & {
  label: string;
  options: { value: string | number; label: string }[];
};

const SelectInput: React.FC<SelectInputProps> = (props) => {
  const [field, meta, helper] = useField(props);

  // Raise error if value is not in options
  useEffect(() => {
    if (
      field.value &&
      !props.options.find((option: any) => option.value == field.value)
    ) {
      console.error(`Value ${field.value} not in options:`, props.options);
    }
  });

  return (
    <div className="relative">
      <select
        {...field}
        id={props.name}
        disabled={props.disabled}
        className="block w-full rounded-lg border border-gray-300 bg-inherit p-2.5 pr-4 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-0 focus:ring-primary disabled:bg-black/10"
      >
        {!field.value && (
          <option value="" disabled>
            {props.label}
          </option>
        )}
        {props.options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={props.name}
        className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform rounded-full px-2 text-sm text-gray-700 backdrop-blur-xl duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary"
      >
        {props.label}
      </label>
      <ErrorMessage meta={meta} />
    </div>
  );
};

export default SelectInput;
