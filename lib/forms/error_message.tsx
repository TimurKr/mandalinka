import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { ErrorMessage as EM } from 'formik';

export default function ErrorMessage({ name }: { name: string }) {
  return (
    <EM name={name}>
      {(msg) => (
        <div className="flex items-center text-red-600">
          <ExclamationCircleIcon className="mr-1 h-4 w-4" />
          {msg}
        </div>
      )}
    </EM>
  );
}
