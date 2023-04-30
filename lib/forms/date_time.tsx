import { useField, FieldHookConfig } from 'formik';
import DateTime from 'react-datetime';

type DateTimeInputProps = FieldHookConfig<string> & {
  time?: boolean;
};

export default function RawDateTimeInput(props: DateTimeInputProps) {
  const [field, meta, helper] = useField(props);
  return (
    <div className="relative">
      <DateTime
        onChange={(value) => helper.setValue(value.toString())}
        value={new Date(field.value)}
        initialValue={meta.initialValue}
        inputProps={{
          id: props.name,
          className:
            'focus:border-primary focus:ring-primary peer block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none focus:ring-0 disabled:bg-black/10',
        }}
        timeFormat={props.time ? 'HH:mm' : false}
        dateFormat="DD.MM.YYYY"
      />
    </div>
  );
}
