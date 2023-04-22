import { useField, FieldHookConfig } from "formik";

import ErrorMessage from "./error_message";

type TextAreaInputProps = FieldHookConfig<string> & {
  label: string;
};

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  placeholder,
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <>
      <div className="relative">
        <textarea
          {...field}
          className="focus:border-primary focus:ring-primary peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0 disabled:bg-black/10"
          disabled={props.disabled}
          placeholder={placeholder}
        />
        <label
          htmlFor="floating_outlined"
          className="peer-focus:text-primary absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform rounded-full px-2 text-sm text-gray-700 backdrop-blur-xl duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
        >
          {label}
        </label>
      </div>
      <ErrorMessage meta={meta} />
    </>
  );
};

export default TextAreaInput;
