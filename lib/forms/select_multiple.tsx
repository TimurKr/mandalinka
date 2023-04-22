import { useField, Field } from 'formik';
import { BorderedElement } from '@/lib/ui/bordered_element';
import ErrorMessage from './error_message';

const MultiSelectInput = ({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: { value: string | number; label: string }[];
}) => {
  const [field, meta, helper] = useField(name);

  return (
    <BorderedElement
      title={label}
      className="!rounded-lg !border-gray-300 pt-4"
    >
      <div
        role="group"
        aria-labelledby="checkbox-group"
        className="flex flex-wrap justify-center gap-2"
      >
        {options.map((option) => (
          <span key={option.value}>
            <input
              id={`${name}-${option.value?.toString()}`}
              type="checkbox"
              name={name}
              value={option.value}
              checked={field.value.includes(option.value)}
              onChange={(e: any) => {
                const checked = e.target.checked;
                const value = option.value;
                const currentValue = field.value;
                let newValue;
                if (checked) {
                  newValue = [...currentValue, value];
                } else {
                  newValue = currentValue.filter((v: string) => v !== value);
                }
                helper.setValue(newValue);
                console.log(
                  'Just change value of ',
                  field.name,
                  ' to : ',
                  newValue
                );
              }}
              className="peer hidden"
            />
            <label
              key={option.value}
              htmlFor={`${name}-${option.value?.toString()}`}
              className="cursor-pointer rounded-full p-1 px-2 hover:bg-primary-200 hover:shadow peer-checked:bg-primary-400 peer-checked:shadow-md peer-checked:hover:bg-primary-300"
            >
              {option.label}
            </label>
          </span>
        ))}
      </div>
      <ErrorMessage meta={meta} />
    </BorderedElement>
  );
};

export default MultiSelectInput;
