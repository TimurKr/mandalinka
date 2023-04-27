import { useField, FieldHookConfig } from 'formik';
import DateTime from 'react-datetime';

type DateTimeInputProps = FieldHookConfig<string> & {
  label: string;
  initialValue?: string | Date;
  time?: boolean;
};

const DateTimeInput: React.FC<DateTimeInputProps> = ({ label, ...props }) => {
  const [field, meta, helper] = useField(props);
  return (
    <>
      <div className="relative">
        <DateTime
          onChange={(value) => helper.setValue(value.toString())}
          value={new Date(field.value)}
          initialValue={props.initialValue}
          inputProps={{
            id: props.name,
            className:
              'focus:border-primary focus:ring-primary peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0 disabled:bg-black/10',
          }}
          timeFormat={props.time ? 'HH:mm' : false}
          dateFormat="DD.MM.YYYY"
        />
        <label
          htmlFor={props.name}
          className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform rounded-full px-2 text-sm text-gray-700 backdrop-blur-xl duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary"
        >
          {label}
        </label>
      </div>
    </>
  );
};

export default DateTimeInput;
