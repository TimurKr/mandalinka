'use client';

import Image from 'next/image';

import { CloudArrowUpIcon } from '@heroicons/react/20/solid';

import { useField, FieldHookConfig } from 'formik';
import ErrorMessage from '../error_message';
import { useDropzone } from 'react-dropzone';
import { TrashIcon } from '@heroicons/react/24/outline';

type FileInputProps = FieldHookConfig<File> & {
  label?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
};

export function FileInput({ ...props }: FileInputProps) {
  const [field, meta, helpers] = useField(props.name);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop(acceptedFiles, fileRejections, event) {
      if (acceptedFiles.length > 0) {
        helpers.setValue(acceptedFiles[0]);
      }
      if (fileRejections.length > 0) {
        helpers.setError(fileRejections[0].errors[0].message);
      }
    },
  });

  return (
    <div
      {...getRootProps({
        className:
          'bg-white border-2 rounded-lg border-dashed p-2 justify-center flex items-center cursor-pointer',
      })}
    >
      <input {...getInputProps()} />
      {field.value ? (
        <div className="group relative">
          <Image
            src={URL.createObjectURL(field.value)}
            alt="Selected image"
            className="object-contain"
            width={props.thumbnail_width || 100}
            height={props.thumbnail_height || 100}
          />
          <TrashIcon
            className="absolute start-1/2 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-xl bg-slate-200/50 p-2 text-red-500 hover:bg-slate-200/80 group-hover:block"
            onClick={(event) => {
              event.stopPropagation();
              helpers.setValue('');
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <>
            <CloudArrowUpIcon className="h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-400">Pridajte obrázok</p>
          </>
        </div>
      )}
    </div>
  );
}
