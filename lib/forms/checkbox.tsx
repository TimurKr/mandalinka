import { useField, FieldHookConfig } from "formik";

import ErrorMessage from "./error_message";

type CheckBoxInputProps = FieldHookConfig<string> & {
  label: string;
};

const CheckBoxInput: React.FC<CheckBoxInputProps> = ({
  label,
  placeholder,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <>
      <div className="flex flex-auto items-center">
        <input
          {...field}
          id={props.name}
          type="checkbox"
          className="text-primary focus:outline-primary focus:ring-primary disabled:text-primary-600 peer rounded"
          disabled={props.disabled}
          placeholder={placeholder}
        />
        <label
          htmlFor={props.name}
          className="px-2 text-sm text-gray-800 peer-disabled:text-gray-500"
        >
          {label}
        </label>
      </div>
      <ErrorMessage meta={meta} />
    </>
  );
};

export default CheckBoxInput;
