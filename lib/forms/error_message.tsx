import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { FieldMetaProps } from "formik";

type Props = {
  meta: FieldMetaProps<any>;
};

const ErrorMessage: React.FC<Props> = ({ meta }) => {
  return (
    <>
      {meta.touched && meta.error ? (
        <div className="mt-1 flex w-full items-center text-sm text-red-500">
          <ExclamationCircleIcon className="mr-1 h-4 w-4 shrink-0" />
          {meta.error}
        </div>
      ) : null}
    </>
  );
};

export default ErrorMessage;
